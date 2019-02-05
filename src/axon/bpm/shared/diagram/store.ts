import {Module} from 'vuex';
import {BpmDiagramState} from './types';
import {mutations} from './mutations';
import {actions} from './actions';
import {getters} from './getters';
import {RootState} from '@/annette/core/store/root-state';


export const state: BpmDiagramState = {
    ids: [],
    entities: {},

    filterInitialized: false,
    filter: '',
    entitiesLoading: false,

    failure: null,

    sortField: null,
    sortAscending: true,
    sortedEntities: [],

    mode: null,
    id: null,
    entity: null,

    loading: false,
    loaded: false,

    saving: false,
    saved: false,
};


const namespaced: boolean = true;

export const BPM_DIAGRAM_NAMESPACE: string = 'bpmDiagram';

export const bpmDiagram: Module<BpmDiagramState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};


