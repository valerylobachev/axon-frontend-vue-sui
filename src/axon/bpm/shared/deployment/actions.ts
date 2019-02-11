import {ActionTree} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {BpmDeploymentState} from '@/axon/bpm/shared/deployment/types';
import {FindProcessDefOptions} from '@/axon/bpm/shared/deployment/model';
import bpmDeploymentBackendService from '@/axon/bpm/shared/deployment/backend.service';

export const actions: ActionTree<BpmDeploymentState, RootState> = {
    InitProcessDefFilter(context) {
        if (!context.state.filterInitialized) {
            context.dispatch('FindProcessDef', {
                key: '',
                name: '',
                latest: false,
            });
        }
    },

    FindProcessDef(context, filter: FindProcessDefOptions) {
        context.commit('FindProcessDef', filter);
        bpmDeploymentBackendService
            .find(filter)
            .then(response => context.commit('FindProcessDefSuccess', response))
            .catch(failure => context.commit('FindProcessDefFailure', failure.response.data));
    },

};
