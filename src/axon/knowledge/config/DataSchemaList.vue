<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.knowledge.form.dataSchemaList.title') }}</h3>

        <template slot="toolbar">
            <div class="ten wide column">
                <simple-lazy-filter :filter="filter.filter" @filter="find({ filter: $event })"></simple-lazy-filter>
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

        <div class="ui segment">
            <data-schema-table :sortState="sortState"
                               @toggleSort="toggleSort"
                               @delete="requestDelete($event)"></data-schema-table>
        </div>

        <delete-entity-modal ref="deleteDialog"></delete-entity-modal>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import DataSchemaTable from '@/axon/knowledge/config/DataSchemaTable.vue';
    import {KNOWLEDGE_DATA_SCHEMA_NAMESPACE} from '@/axon/knowledge/shared/data-schema/store';
    import SimpleLazyFilter from '@/annette/crud/ui/SimpleLazyFilter.vue';
    import DeleteEntityModal from '@/annette/crud/ui/DeleteEntityModal.vue';
    import {DataSchemaSummary} from '@/axon/knowledge/shared/data-schema/model';

    const namespace: string = KNOWLEDGE_DATA_SCHEMA_NAMESPACE;

    @Component({
        components: {
            AppForm,
            DataSchemaTable,
            SimpleLazyFilter,
            DeleteEntityModal,
        },
    })
    export default class DataSchemaList extends Vue {


        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filter;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        @Action('Delete', {namespace}) deleteEntity: any;


        constructor() {
            super();
            this.initFilter();
        }

        requestDelete(entity: DataSchemaSummary) {
            const message = {
                code: 'axon.knowledge.md.dataSchema.delete',
                name: entity.name,
            };

            (this.$refs.deleteDialog as DeleteEntityModal).show(null, message).then(del => {
                this.deleteEntity(entity.key);
            });
        }

    }
</script>

<style lang="scss">
</style>
