import {Module} from 'vuex';
import {BpmDeploymentState} from './types';
import {mutations} from './mutations';
import {actions} from './actions';
import {getters} from './getters';
import {RootState} from '@/annette/core/store/root-state';
import {emptyProcessDefFilter} from '@/axon/bpm/shared/deployment/model';


export const state: BpmDeploymentState = {
    ids: [],
    entities: {},

    filterInitialized: false,
    filter: emptyProcessDefFilter,
    entitiesLoading: false,

    failure: null,
    sortField: null,
    sortAscending: true,
    sortedEntities: [],
};


const namespaced: boolean = true;

export const BPM_DEPLOYMENT_NAMESPACE: string = 'bpmDeployment';

export const bpmDeployment: Module<BpmDeploymentState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



