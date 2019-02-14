import {Module} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {vm} from '@/main';
import {CrudState, InitOptions} from '@/annette/crud/store/crud-types';
import {CrudStoreBuilder} from '@/annette/crud/store/crud-store-builder';
import {
    BpmDiagram,
    BpmDiagramFilter,
    BpmDiagramSummary,
    emptyBpmDiagramFilter,
    newBpmnDiagram, newCmmnDiagram, newDmnDiagram,
} from '@/axon/bpm/shared/diagram/model';
import bpmDiagramBackendService from '@/axon/bpm/shared/diagram/backend.service';
import uuidv4 from 'uuid/v4';


export interface BpmDiagramState
    extends CrudState<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary> {
}

export const state: BpmDiagramState =
    CrudStoreBuilder.buildState<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary>(emptyBpmDiagramFilter());


const crudActions = CrudStoreBuilder.buildActions<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary>(
    bpmDiagramBackendService, emptyBpmDiagramFilter(), newBpmnDiagram(),
);

const actions = {
    ...crudActions,
    Init(context, {mode, id}: InitOptions) {
        if (mode === 'create' && id === 'BPMN') {
            context.commit('LoadSuccess', {mode, entity: newBpmnDiagram()});
        } else if (mode === 'create' && id === 'DMN') {
            context.commit('LoadSuccess', {mode, entity: newDmnDiagram()});
        } else if (mode === 'create' && id === 'CMMN') {
            context.commit('LoadSuccess', {mode, entity: newCmmnDiagram()});
        } else {
            context.dispatch('Load', {mode, id});
        }
    },
}

const mutations = CrudStoreBuilder.buildMutations<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary>(
    'id',
    entity => vm.$router.push(`/bpm-config/diagram/edit/${entity.id}`),
    () => uuidv4(),
);

const getters = CrudStoreBuilder.buildGetters<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary>();



const namespaced: boolean = true;

export const BPM_DIAGRAM_NAMESPACE: string = 'bpmDiagram';

export const bpmDiagram: Module<BpmDiagramState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



