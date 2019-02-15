<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.knowledge.form.dataSchemaList.title') }}</h3>

        <template slot="toolbar">
            <div class="ten wide column">
                <div class="ui icon action input" style="width: 100%;">
                    <input type="text" :placeholder="$t('axon.knowledge.form.dataSchemaList.filter')"
                           v-model="filter.filter"
                           @input="setFilter($event.target.value)">
                    <i class=" close link icon"
                       style="right: 2.6em; width: 2em;"
                       @click="clearFilter()"></i>
                    <button class="ui icon button" @click="refresh()">
                        <i class="search icon"></i>
                    </button>
                </div>
            </div>
            <div class="right floated three wide column">
                <router-link class="ui right floated primary button" to="schema/create/new">
                    {{ $t('axon.knowledge.form.dataSchemaList.create')}}
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
            <data-schema-table :sortState="sortState" @toggleSort="toggleDataSchemaSort">
                <template slot-scope="slotProps">

                    <router-link class="ui tiny basic icon button" :to="`schema/create/${slotProps.dataSchema.key}`">
                        <i class="copy outline green icon"></i>
                    </router-link>
                    <router-link class="ui tiny basic icon button" :to="`schema/edit/${slotProps.dataSchema.key}`">
                        <i class="edit blue icon"></i>
                    </router-link>
                    <button class="ui tiny basic icon button"
                            @click="requestDelete(slotProps.dataSchema.key, slotProps.dataSchema.name)">
                        <i class="delete red icon"></i>
                    </button>

                </template>
            </data-schema-table>
        </div>
        <div class="ui placeholder segment" v-if="isEmpty">
            <div class="ui icon header">
                <i class="object group outline icon"></i>
                {{ $t('axon.knowledge.form.dataSchemaList.notFound') }}
            </div>
        </div>


        <sui-modal v-model="deleteModalContext.open" size="tiny">
            <sui-modal-header>{{ $t('axon.shared.delete')}}</sui-modal-header>
            <sui-modal-content image>
                <p>{{ $t('axon.knowledge.md.dataSchema.delete', {name: deleteModalContext.name})}}?</p>
            </sui-modal-content>
            <sui-modal-actions>
                <button class="ui basic button" @click="deleteModalContext.open = false">{{ $t('axon.shared.cancel')}}
                </button>
                <button class="ui red button" @click="performDelete" autofocus>{{
                    $t('axon.shared.delete')}}
                </button>
            </sui-modal-actions>
        </sui-modal>
    </app-form>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import _ from 'lodash';
    import AppForm from '@/annette/layout/AppForm.vue';
    import DataSchemaTable from '@/axon/knowledge/config/DataSchemaTable.vue';
    import {KNOWLEDGE_DATA_SCHEMA_NAMESPACE} from '@/axon/knowledge/shared/data-schema/store';
    import {DataSchemaFilter, emptyDataSchemaFilter} from '@/axon/knowledge/shared/data-schema/model';

    const namespace: string = KNOWLEDGE_DATA_SCHEMA_NAMESPACE;

    @Component({
        components: {
            AppForm,
            DataSchemaTable,
        },
    })
    export default class DataSchemaList extends Vue {

        filter: DataSchemaFilter = emptyDataSchemaFilter();

        deleteModalContext = {
            open: false,
            id: '',
            name: '',
        };

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleDataSchemaSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        @Action('Delete', {namespace}) deleteDataSchema: any;

        lazyFind = _.debounce(f => {
                this.find(f);
            },
            500);

        constructor() {
            super();
            this.initFilter();
        }

        created() {
            if (this.filterState) { this.filter = this.filterState };
        }

        @Watch('filterState')
        onFilterStateChanged(val) {
            this.filter = val;
        }

        setFilter(filter: string) {
            this.lazyFind({ filter });
        }

        clearFilter() {
            this.find(emptyDataSchemaFilter());
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

        requestDelete(id: string, name: string) {
            this.deleteModalContext = {
                open: true,
                id,
                name,
            };
        }

        performDelete() {
            this.deleteDataSchema(this.deleteModalContext.id);
            this.deleteModalContext = {
                open: false,
                id: null,
                name: null,
            };
        }
    }
</script>

<style lang="scss">
</style>
