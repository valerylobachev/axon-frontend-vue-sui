import {GetterTree} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {BpmDeploymentState} from '@/axon/bpm/shared/deployment/types';

export const getters: GetterTree<BpmDeploymentState, RootState> = {
    filter: state => state.filter,

    failure: state => state.failure,

    sortState: state => ({
        sortField: state.sortField,
        sortAscending: state.sortAscending,
        sortedEntities: state.sortedEntities,
    }),

};




