import {InitOptions} from '@/axon/bpm/shared/diagram/types';
import {BaseBackendService} from '@/annette/core/crud/backend.service';
import {ActionTree} from 'vuex';
import {CrudState} from '@/annette/core/crud/types';
import {RootState} from '@/annette/core/store/root-state';

export function buildActions<F, T, S>(
    backendService: BaseBackendService<F, T, S>,
    emptyFilter: F,
    emptyEntity: T): ActionTree<CrudState<F, T, S>, RootState> {
    return {
        InitFilter(context) {
            if (!context.state.filterInitialized) {
                context.dispatch('Find', emptyFilter);
            }
        },

        Find(context, filter: F) {
            context.commit('Find', filter);
            backendService
                .find(filter)
                .then(response => context.commit('FindSuccess', response))
                .catch(failure => context.commit('FindFailure', failure.response.data));
        },

        Init(context, {mode, id}: InitOptions) {
            if (mode === 'create' && id === 'new') {
                context.commit('LoadSuccess', {mode, entity: emptyEntity});
            } else {
                context.dispatch('Load', {mode, id});
            }
        },

        Load(context, {mode, id}: InitOptions) {
            context.commit('Load');
            backendService
                .findById(id)
                .then(entity => context.commit('LoadSuccess', {mode, entity}))
                .catch(failure => context.commit('LoadFailure', failure.response.data));
        },

        Create(context, entity: T) {
            context.commit('Create');
            backendService
                .create(entity)
                .then(entitySummary => context.commit('CreateSuccess', {entity, entitySummary}))
                .catch(failure => context.commit('CreateFailure', failure.response.data));
        },

        Update(context, entity: T) {
            backendService
                .update(entity)
                .then(entitySummary => context.commit('UpdateSuccess', {entity, entitySummary}))
                .catch(failure => context.commit('UpdateFailure', failure.response.data));
        },

        Delete(context, id: string) {
            backendService
                .remove(id)
                .then(response => {
                    context.commit('DeleteSuccess', id);
                })
                .catch(failure => {
                    context.commit('DeleteFailure', failure.response.data);
                });
        },
    };
}
