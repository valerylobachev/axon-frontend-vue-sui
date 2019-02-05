import {ActionTree} from 'vuex';
import {InitOptions, BpmDiagramState} from '@/axon/bpm/shared/diagram/types';
import bpmDiagramBackendService from '@/axon/bpm/shared/diagram/backend.service';
import {RootState} from '@/annette/core/store/root-state';
import {NEW_BPMN_DIAGRAM, NEW_CMMN_DIAGRAM, NEW_DMN_DIAGRAM, BpmDiagram} from '@/axon/bpm/shared/diagram/model';

export const actions: ActionTree<BpmDiagramState, RootState> = {
    InitFilter(context) {
        if (!context.state.filterInitialized) {
            context.dispatch('Find', '');
        }
    },

    Find(context, filter: string) {
        context.commit('Find', filter);
        bpmDiagramBackendService
            .find(filter)
            .then(response => context.commit('FindSuccess', response))
            .catch(failure => context.commit('FindFailure', failure.response.data));
    },

    Init(context, {mode, id}: InitOptions) {
        if (mode === 'create' && id === 'BPMN') {
            context.commit('LoadSuccess', {mode, diagram: NEW_BPMN_DIAGRAM});
        } else if (mode === 'create' && id === 'DMN') {
            context.commit('LoadSuccess', {mode, diagram: NEW_DMN_DIAGRAM});
        } else if (mode === 'create' && id === 'CMMN') {
            context.commit('LoadSuccess', {mode, diagram: NEW_CMMN_DIAGRAM});
        } else {
            context.dispatch('Load', {mode, id});
        }
    },

    Load(context, {mode, id}: InitOptions) {
        context.commit('Load');
        bpmDiagramBackendService
            .findById(id)
            .then(diagram => context.commit('LoadSuccess', {mode, diagram}))
            .catch(failure => context.commit('LoadFailure', failure.response.data));
    },

    Create(context, diagram: BpmDiagram) {
        context.commit('Create');
        bpmDiagramBackendService
            .create(diagram)
            .then(summary => context.commit('CreateSuccess', {diagram, summary}))
            .catch(failure => context.commit('CreateFailure', failure.response.data));
    },

    Update(context, diagram: BpmDiagram) {
        bpmDiagramBackendService
            .update(diagram)
            .then(summary => context.commit('UpdateSuccess', {diagram, summary}))
            .catch(failure => context.commit('UpdateFailure', failure.response.data));
    },

    Delete(context, id: string) {
        bpmDiagramBackendService
            .delete(id)
            .then(response => {
                context.commit('DeleteSuccess', id);
            })
            .catch(failure => {
                context.commit('DeleteFailure', failure.response.data);
            });
    },


};
