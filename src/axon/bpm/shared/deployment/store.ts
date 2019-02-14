import {Module} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {emptyProcessDefFilter, FindProcessDefOptions, ProcessDef} from './model';
import {BaseState, BaseStoreBuilder} from '@/annette/crud/store/index';
import bpmDeploymentBackendService from '@/axon/bpm/shared/deployment/backend.service';

export interface BpmDeploymentState
    extends BaseState<FindProcessDefOptions, ProcessDef, ProcessDef> {
}

const state = BaseStoreBuilder.buildState(emptyProcessDefFilter());

const actions = BaseStoreBuilder.buildActions<FindProcessDefOptions, ProcessDef, ProcessDef>(
    bpmDeploymentBackendService, emptyProcessDefFilter(),
);


function sortByField(field: string, ascending: boolean) {
    return (aObj: ProcessDef, bObj: ProcessDef) => {
        const a = field === 'version' ? aObj[field] : (aObj[field] || '').toLowerCase();
        const b = field === 'version' ? bObj[field] : (bObj[field] || '').toLowerCase();
        if (a < b) {
            return ascending ? -1 : 1;
        } else if (a > b) {
            return ascending ? 1 : -1;
        } else {
            return 0;
        }
    };
}
const mutations = BaseStoreBuilder.buildMutations<FindProcessDefOptions, ProcessDef, ProcessDef>(
    'id', 'name', sortByField,
);

const getters = BaseStoreBuilder.buildGetters<FindProcessDefOptions, ProcessDef, ProcessDef>();

const namespaced: boolean = true;

export const BPM_DEPLOYMENT_NAMESPACE: string = 'bpmDeployment';

export const bpmDeployment: Module<BpmDeploymentState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



