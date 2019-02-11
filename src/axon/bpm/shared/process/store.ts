import {ActionTree, Module} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import bpmBusinessProcessBackendService from '@/axon/bpm/shared/process/backend.service';
import {
    BusinessProcess,
    BusinessProcessFilter,
    BusinessProcessSummary, emptyBusinessProcessFilter,
    NEW_BUSINESS_PROCESS,
} from '@/axon/bpm/shared/process/model';
import {buildEmptyCrudState, CrudState} from '@/annette/core/crud/types';
import {buildMutations} from '@/annette/core/crud/mutations';
import {buildActions} from '@/annette/core/crud/actions';
import {buildGetters} from '@/annette/core/crud/getters';
import {vm} from '@/main';


export interface BusinessProcessState
    extends CrudState<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary> {
}

export const state: BusinessProcessState =
    buildEmptyCrudState<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(emptyBusinessProcessFilter);


const actions = buildActions<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
    bpmBusinessProcessBackendService, {...emptyBusinessProcessFilter}, {...NEW_BUSINESS_PROCESS},
);

const mutations = buildMutations<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
    'id', entity => vm.$router.push(`/bpm-config/business-process/edit/${entity.id}`),
);

const getters = buildGetters<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>();

const namespaced: boolean = true;

export const BPM_BUSINESS_PROCESS_NAMESPACE: string = 'bpmBusinessProcess';

export const bpmBusinessProcess: Module<BusinessProcessState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



