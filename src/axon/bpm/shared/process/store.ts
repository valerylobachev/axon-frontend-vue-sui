import {Module} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import bpmBusinessProcessBackendService from './backend.service';
import {
    BusinessProcess,
    BusinessProcessFilter,
    BusinessProcessSummary, emptyBusinessProcessFilter,
    newBusinessProcess,
} from './model';
import {vm} from '@/main';
import {CrudState, CrudStoreBuilder} from '@/annette/crud/store/index';


export interface BusinessProcessState
    extends CrudState<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary> {
}

export const state: BusinessProcessState =
    CrudStoreBuilder.buildState<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(emptyBusinessProcessFilter());


const actions = CrudStoreBuilder.buildActions<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
    bpmBusinessProcessBackendService, emptyBusinessProcessFilter(), newBusinessProcess(),
);

const mutations = CrudStoreBuilder.buildMutations<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
    'key',
    entity => vm.$router.push(`/bpm-config/business-process/edit/${entity.key}`),
    () => '',
);

const getters = CrudStoreBuilder.buildGetters<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>();

const namespaced: boolean = true;

export const BPM_BUSINESS_PROCESS_NAMESPACE: string = 'bpmBusinessProcess';

export const bpmBusinessProcess: Module<BusinessProcessState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



