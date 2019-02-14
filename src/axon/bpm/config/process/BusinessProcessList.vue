<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.bpm.form.businessProcessList.title') }}</h3>

        <template slot="toolbar">
            <div class="ten wide column">
                <div class="ui icon action input" style="width: 100%;">
                    <input type="text" :placeholder="$t('axon.bpm.form.businessProcessList.filter')"
                           v-model="filter.filter"
                           @input="setFilter({filter: $event.target.value})">
                    <i class=" close link icon"
                       style="right: 2.6em; width: 2em;"
                       @click="clearFilter()"></i>
                    <button class="ui icon button" @click="$event.stopPropagation(); refresh()">
                        <i class="search icon"></i>
                    </button>
                </div>
            </div>
            <div class="right floated three wide column">
                <router-link class="ui right floated primary button" to="business-process/create/new">
                    {{ $t('axon.bpm.form.businessProcessList.create')}}
                </router-link>
            </div>
        </template>

        <div class="ui segment" v-if="failure">

            <div class="ui negative message">
                <i class="close icon" @click="clearFailure"></i>
                <div class="header">
                    {{ $t('axon.shared.error') }}
                </div>
                <p> {{ $t(failure.code, failure) }}</p>
            </div>
        </div>
        <div class="ui segment" v-if="!isEmpty">
            <business-process-table :sortState="sortState" @toggleSort="toggleBusinessProcessSort">
                <template slot-scope="slotProps">

                    <router-link class="ui tiny basic icon button"
                                 :to="`business-process/create/${slotProps.businessProcess.key}`">
                        <i class="copy outline green icon"></i>
                    </router-link>
                    <router-link class="ui tiny basic icon button"
                                 :to="`business-process/edit/${slotProps.businessProcess.key}`">
                        <i class="edit blue icon"></i>
                    </router-link>
                    <button type="button" class="ui tiny basic icon button"
                            @click="requestDelete(slotProps.businessProcess.key, slotProps.businessProcess.name)">
                        <i class="delete red icon"></i>
                    </button>
                    <button type="button" class="ui tiny basic icon button"
                            @click="run(slotProps.businessProcess.key)"><i
                            class="play violet icon"></i>
                    </button>

                </template>
            </business-process-table>
        </div>
        <div class="ui placeholder segment" v-if="isEmpty">
            <div class="ui icon header">
                <i class="object group outline icon"></i>
                {{ $t('axon.bpm.form.businessProcessList.notFound') }}
            </div>
        </div>


        <sui-modal v-model="deleteModalContext.open" size="tiny">
            <sui-modal-header>{{ $t('axon.shared.delete')}}</sui-modal-header>
            <sui-modal-content image>
                <p>{{ $t('axon.bpm.md.businessProcess.delete', {name: deleteModalContext.name})}}</p>
            </sui-modal-content>
            <sui-modal-actions>
                <button class="ui basic button" @click="deleteModalContext.open = false">{{ $t('axon.shared.cancel')}}
                </button>
                <button class="ui red button" @click="performDelete" autofocus>{{ $t('axon.shared.delete')}}</button>
            </sui-modal-actions>
        </sui-modal>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import _ from 'lodash';
    import AppForm from '@/annette/layout/AppForm.vue';
    import BusinessProcessTable from './BusinessProcessTable.vue';
    import {BPM_BUSINESS_PROCESS_NAMESPACE} from '@/axon/bpm/shared/process/store';
    import {BusinessProcessFilter, emptyBusinessProcessFilter} from '@/axon/bpm/shared/process/model';

    const namespace: string = BPM_BUSINESS_PROCESS_NAMESPACE;

    @Component({
        components: {
            AppForm,
            BusinessProcessTable,
        },
    })
    export default class BusinessProcessList extends Vue {

        filter: BusinessProcessFilter = emptyBusinessProcessFilter();

        deleteModalContext = {
            open: false,
            key: '',
            name: '',
        };

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleBusinessProcessSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        @Action('Delete', {namespace}) deleteBusinessProcess: any;

        lazyFind = _.debounce(f => {
                this.find(f);
            },
            500);

        constructor() {
            super();
            this.initFilter();
        }

        created() {
            if (this.filterState) {
                this.filter = this.filterState;
            }
        }

        @Watch('filterState', {deep: true})
        onFilterStateChanged(val: BusinessProcessFilter, oldVal: BusinessProcessFilter) {
            this.filter = {...val};
        }

        setFilter(filter: string) {
            this.lazyFind(filter);
        }

        clearFilter() {
            this.find(emptyBusinessProcessFilter());
        }

        refresh() {
            this.find(this.filterState);
        }

        get isEmpty() {
            if (this.sortState && this.sortState.sortedEntities) {
                return this.sortState.sortedEntities.length === 0;
            } else {
                return true;
            }
        }

        requestDelete(key: string, name: string) {
            this.deleteModalContext = {
                open: true,
                key,
                name,
            };
        }

        performDelete() {
            this.deleteBusinessProcess(this.deleteModalContext.key);
            this.deleteModalContext = {
                open: false,
                key: null,
                name: null,
            };
        }
    }
</script>

<style lang="scss">
</style>
