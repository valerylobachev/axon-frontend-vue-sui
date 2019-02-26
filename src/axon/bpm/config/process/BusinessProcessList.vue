<template>
    <app-form>
        <h3 slot="header" class="header">{{ $t('axon.bpm.form.businessProcessList.title') }}</h3>
        <template slot="toolbar">
            <div class="ten wide column">
                <simple-lazy-filter :filter="filter.filter" @filter="find({ filter: $event })"></simple-lazy-filter>
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

        <div class="ui segment">
            <business-process-table :sortState="sortState"
                                    @toggleSort="toggleSort"
                                    @delete="requestDelete($event)"
                                    @run="run($event)">
            </business-process-table>
        </div>

        <delete-entity-modal ref="deleteDialog"></delete-entity-modal>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import BusinessProcessTable from './BusinessProcessTable.vue';
    import {BPM_BUSINESS_PROCESS_NAMESPACE} from '@/axon/bpm/shared/process/store';
    import SimpleLazyFilter from '@/annette/crud/ui/SimpleLazyFilter.vue';
    import DeleteEntityModal from '@/annette/crud/ui/DeleteEntityModal.vue';
    import {BusinessProcessSummary} from '@/axon/bpm/shared/process/model';

    const namespace: string = BPM_BUSINESS_PROCESS_NAMESPACE;

    @Component({
        components: {
            AppForm,
            BusinessProcessTable,
            SimpleLazyFilter,
            DeleteEntityModal,
        },
    })
    export default class BusinessProcessList extends Vue {


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

        requestDelete(entity: BusinessProcessSummary) {
            const message = {
                code: 'axon.bpm.md.businessProcess.delete',
                name: entity.name,
            };

            (this.$refs.deleteDialog as DeleteEntityModal).show(null, message).then(del => {
                this.deleteEntity(entity.key);
            });
        }

        run(key) {
            console.log('Not implemented')
        }
    }
</script>

<style lang="scss">
</style>
