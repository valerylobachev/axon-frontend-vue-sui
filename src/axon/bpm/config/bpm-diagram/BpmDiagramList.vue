<template>
    <app-form>
        <h3 slot="header" class="header">{{ $t('axon.bpm.form.bpmDiagrams.title') }}</h3>
        <template slot="toolbar">
            <div class="ten wide column">
                <simple-lazy-filter :filter="filter.filter" @filter="find({ filter: $event })"></simple-lazy-filter>
            </div>
            <div class="right floated three wide column">
                <div class="ui right floated primary buttons">
                    <router-link class="ui primary button" to="diagram/create/BPMN">
                        {{ $t('axon.bpm.form.bpmDiagrams.createBPMN')}}
                    </router-link>
                    <sui-dropdown class="ui floating dropdown icon button">
                        <sui-dropdown-menu>
                            <router-link class="item" to="diagram/create/DMN">
                                {{ $t('axon.bpm.form.bpmDiagrams.createDMN')}}
                            </router-link>
                            <router-link class="item" to="diagram/create/CMMN">
                                {{ $t('axon.bpm.form.bpmDiagrams.createCMMN')}}
                            </router-link>
                        </sui-dropdown-menu>
                    </sui-dropdown>
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

        <div class="ui segment">
            <bpm-diagram-table :sortState="sortState"
                               @toggleSort="toggleSort"
                               @deploy="deploy($event)"
                               @delete="requestDelete($event)">
            </bpm-diagram-table>
        </div>

        <delete-entity-modal ref="deleteDialog"></delete-entity-modal>
        <message-modal ref="deployDialog"></message-modal>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import BpmDiagramTable from './BpmDiagramTable.vue';
    import {BPM_DIAGRAM_NAMESPACE} from '@/axon/bpm/shared/diagram/store';
    import bpmDeploymentBackendService from '@/axon/bpm/shared/deployment/backend.service';
    import SimpleLazyFilter from '@/annette/crud/ui/SimpleLazyFilter.vue';
    import {BpmDiagramSummary} from '@/axon/bpm/shared/diagram/model';
    import DeleteEntityModal from '@/annette/crud/ui/DeleteEntityModal.vue';
    import MessageModal from '@/annette/crud/ui/MessageModal.vue';

    const namespace: string = BPM_DIAGRAM_NAMESPACE;

    @Component({
        components: {
            AppForm,
            BpmDiagramTable,
            MessageModal,
            DeleteEntityModal,
            SimpleLazyFilter,
        },
    })
    export default class BpmDiagramList extends Vue {

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

        requestDelete(entity: BpmDiagramSummary) {
            const message = {
                code: 'axon.bpm.md.bpmDiagram.delete',
                name: entity.name,
            };

            (this.$refs.deleteDialog as DeleteEntityModal).show(null, message).then(del => {
                this.deleteEntity(entity.id);
            });
        }


        deploy(id: string) {
            bpmDeploymentBackendService.deploy(id).then(result => {
                const message = {
                    code: 'axon.bpm.form.bpmDiagrams.deployed',
                    name: result.name,
                };
                (this.$refs.deployDialog as MessageModal)
                    .show('axon.bpm.form.bpmDiagrams.deployedTitle', message);
            });
        }
    }
</script>

<style lang="scss">
</style>
