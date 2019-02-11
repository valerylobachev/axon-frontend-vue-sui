<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.bpm.form.processDefList.title') }}</h3>

        <template slot="toolbar">
            <div class="ui form form-row">
                <div class="form-input">
                    <div class="fields">
                        <div class="eight wide field">
                            <label>{{ $t('axon.bpm.md.processDef.key') }}</label>
                            <div class="ui fluid icon input">

                                <input type="text"
                                       v-model="filter.key">
                                <i class=" close link icon"
                                   @click="filter.key = ''"></i>
                            </div>
                        </div>
                        <div class="eight wide field">
                            <label>{{ $t('axon.bpm.md.processDef.name') }}</label>
                            <div class="ui fluid icon input">

                                <input type="text"
                                       v-model="filter.name">
                                <i class=" close link icon"
                                   @click="filter.name = ''"></i>
                            </div>
                        </div>
                    </div>
                    <div class="ui toggle checkbox">
                        <input type="checkbox" v-model="filter.latest">
                        <label>{{ $t('axon.bpm.form.processDefList.latest') }}</label>
                    </div>
                </div>
                <div class="form-buttons">
                    <button class="ui fluid primary button" @click.prevent="refresh()">
                        {{ $t('axon.shared.find') }}
                    </button>
                    <button type="button" class="ui fluid basic button" @click.prevent="clearFilter()">
                        {{ $t('axon.shared.clear') }}
                    </button>
                </div>
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
            <process-def-table :sortState="sortState" @toggleSort="toggleProcessDefSort">
            </process-def-table>
        </div>
        <div class="ui placeholder segment" v-if="isEmpty">
            <div class="ui icon header">
                <i class="object group outline icon"></i>
                {{ $t('axon.bpm.form.processDefList.notFound') }}
            </div>
        </div>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import _ from 'lodash';
    import AppForm from '@/annette/layout/AppForm.vue';
    import {BPM_DEPLOYMENT_NAMESPACE} from '@/axon/bpm/shared/deployment/store';
    import ProcessDefTable from './ProcessDefTable.vue';
    import {emptyProcessDefFilter, FindProcessDefOptions} from '@/axon/bpm/shared/deployment/model';

    const namespace: string = BPM_DEPLOYMENT_NAMESPACE;

    @Component({
        components: {
            AppForm,
            ProcessDefTable,
        },
    })
    export default class ProcessDefList extends Vue {

        filter: FindProcessDefOptions = emptyProcessDefFilter;

        deleteModalContext = {
            open: false,
            id: '',
            name: '',
        };


        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('FindProcessDef', {namespace}) find: any;
        @Mutation('ToggleProcessDefSort', {namespace}) toggleProcessDefSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;


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

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            if (to.query.key) {
                this.find({...emptyProcessDefFilter, key: to.query.key})
            }
        }

        @Watch('filterState')
        onFilterStateChanged(newVal: FindProcessDefOptions) {
            this.filter = newVal;
        }

        setFilter(filter: FindProcessDefOptions) {
            this.lazyFind(filter);
        }

        clearFilter() {
            this.find(emptyProcessDefFilter);
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

    }
</script>

<style lang="scss">

    .form-row {
        display: flex;
        justify-content: space-between;
        align-content: center;

        width: 100%;
        margin: 0 1em;
    }

    .form-input {
        margin-right: 1em;
        flex-grow: 1
    }

    .form-buttons {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 2em;
        min-width: 9em;
    }
</style>
