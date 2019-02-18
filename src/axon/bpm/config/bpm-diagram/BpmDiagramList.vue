<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.bpm.form.bpmDiagrams.title') }}</h3>

        <template slot="toolbar">
            <div class="ten wide column">
                <simple-lazy-filter :filter="filter.filter" @filter="find({ filter: $event })" ></simple-lazy-filter>
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
        <div class="ui segment" v-if="!isEmpty">
            <bpm-diagram-table :sortState="sortState" @toggleSort="toggleBpmDiagramSort">
                <template slot-scope="slotProps">

                    <router-link class="ui tiny basic icon button"
                                 :to="`diagram/create/${slotProps.bpmDiagram.id}`">
                        <i class="copy outline green icon"></i>
                    </router-link>
                    <router-link class="ui tiny basic icon button"
                                 :to="`diagram/edit/${slotProps.bpmDiagram.id}`">
                        <i class="edit blue icon"></i>
                    </router-link>
                    <button type="button" class="ui tiny basic icon button"
                            @click="deploy(slotProps.bpmDiagram.id)"><i
                            class="upload violet icon"></i>
                    </button>
                    <button type="button" class="ui tiny basic icon button"
                            @click="requestDelete(slotProps.bpmDiagram.id, slotProps.bpmDiagram.name)">
                        <i class="delete red icon"></i>
                    </button>

                </template>
            </bpm-diagram-table>
        </div>
        <div class="ui placeholder segment" v-if="isEmpty">
            <div class="ui icon header">
                <i class="object group outline icon"></i>
                {{ $t('axon.bpm.form.bpmDiagrams.notFound') }}
            </div>
        </div>


        <sui-modal v-model="deleteModalContext.open" size="tiny">
            <sui-modal-header>{{ $t('axon.shared.delete')}}</sui-modal-header>
            <sui-modal-content image>
                <p>{{ $t('axon.bpm.md.bpmDiagram.delete', {name: deleteModalContext.name})}}</p>
            </sui-modal-content>
            <sui-modal-actions>
                <button class="ui basic button" @click="deleteModalContext.open = false">{{ $t('axon.shared.cancel')}}
                </button>
                <button class="ui red button" @click="performDelete" autofocus>{{ $t('axon.shared.delete')}}</button>
            </sui-modal-actions>
        </sui-modal>

        <sui-modal v-model="deployModalContext.open" size="tiny">
            <sui-modal-header>{{ $t('axon.bpm.form.bpmDiagrams.deployedTitle') }}</sui-modal-header>
            <sui-modal-content image>
                <p>{{ $t('axon.bpm.form.bpmDiagrams.deployed', {name: deployModalContext.name})}}</p>
            </sui-modal-content>
            <sui-modal-actions>
                <button class="ui basic button" @click="deployModalContext.open = false">{{ $t('axon.shared.ok')}}
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
    import ProcessDefList from './ProcessDefLabels.vue';
    import BpmDiagramTable from './BpmDiagramTable.vue';
    import {BPM_DIAGRAM_NAMESPACE} from '@/axon/bpm/shared/diagram/store';
    import bpmDeploymentBackendService from '@/axon/bpm/shared/deployment/backend.service';
    import {BpmDiagramFilter, emptyBpmDiagramFilter} from '@/axon/bpm/shared/diagram/model';
    import SimpleLazyFilter from '@/annette/crud/ui/SimpleLazyFilter.vue';

    const namespace: string = BPM_DIAGRAM_NAMESPACE;

    @Component({
        components: {
            SimpleLazyFilter,
            AppForm,
            ProcessDefList,
            BpmDiagramTable,
        },
    })
    export default class BpmDiagramList extends Vue {

        filter: BpmDiagramFilter = emptyBpmDiagramFilter();
        deleteModalContext = {
            open: false,
            id: '',
            name: '',
        };

        deployModalContext = {
            open: false,
            name: '',
        };

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleBpmDiagramSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        @Action('Delete', {namespace}) deleteBpmDiagram: any;

        constructor() {
            super();
            this.initFilter();
        }

        created() {
            if (this.filterState) {
                this.filter = this.filterState;
            }
        }

        @Watch('filterState')
        onFilterStateChanged(val) {
            this.filter = val;
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
            this.deleteBpmDiagram(this.deleteModalContext.id);
            this.deleteModalContext = {
                open: false,
                id: null,
                name: null,
            };
        }

        deploy(id: string) {
            bpmDeploymentBackendService.deploy(id).then(result => {
                this.deployModalContext = {
                    open: true,
                    name: result.name,
                };
            });
        }
    }
</script>

<style lang="scss">
</style>
