<template>
    <sui-modal v-model="open">
        <sui-modal-header>{{ $t('axon.knowledge.form.dataSchemaModalSelector.title') }}</sui-modal-header>
        <sui-modal-content scrolling>
            <sui-modal-description>
                <div class="row" style="margin-bottom: 1em;">
                    <simple-lazy-filter :filter="filter.filter" @filter="find({ filter: $event })"></simple-lazy-filter>
                </div>
                <data-schema-table
                        :sortState="sortState"
                        @toggleSort="toggleSort"
                        :selectable="true"
                        @select="selectEntity($event)"></data-schema-table>
            </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
            <sui-button basic @click.native.prevent="close()">{{ $t('axon.shared.cancel') }}</sui-button>
        </sui-modal-actions>
    </sui-modal>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import _ from 'lodash';
    import AppForm from '@/annette/layout/AppForm.vue';
    import DataSchemaTable from '@/axon/knowledge/config/DataSchemaTable.vue';
    import {KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE} from '@/axon/knowledge/shared/data-schema/store';
    import {
        DataSchemaFilter,
        DataSchemaSummary,
        emptyDataSchemaFilter
    } from '@/axon/knowledge/shared/data-schema/model';
    import SimpleLazyFilter from '@/annette/crud/ui/SimpleLazyFilter.vue';

    const namespace: string = KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE;

    @Component({
        components: {
            AppForm,
            DataSchemaTable,
            SimpleLazyFilter,
        },
    })
    export default class DataSchemaModalSelector extends Vue {


        open = false;
        resolve = null;
        reject = null;

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleSort: any;
        @Getter('filter', {namespace}) filter;
        @Getter('sortState', {namespace}) sortState;


        constructor() {
            super();
            this.initFilter();
        }

        select() {
            this.open = true;
            return new Promise<DataSchemaSummary>((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;

            });
        }

        selectEntity(entity: DataSchemaSummary) {
            this.open = false;
            this.resolve(entity);
        }

        close() {
            this.open = false;
            this.reject();
        }

    }
</script>

<style lang="scss">
</style>
