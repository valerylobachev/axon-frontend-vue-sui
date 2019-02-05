import {ActionTree} from 'vuex';
import {InitOptions, DataSchemaState} from './types';
import dataSchemaBackendService from './backend.service';
import {RootState} from '@/annette/core/store/root-state';
import {NEW_DATA_SCHEMA, DataSchema} from './model';

export const actions: ActionTree<DataSchemaState, RootState> = {
    InitFilter(context) {
        if (!context.state.filterInitialized) {
            context.dispatch('Find', '');
        }
    },

    Find(context, filter: string) {
        context.commit('Find', filter);
        dataSchemaBackendService
            .find(filter)
            .then(response => context.commit('FindSuccess', response))
            .catch(failure => context.commit('FindFailure', failure.response.data));
    },

    Init(context, {mode, key}: InitOptions) {
        if (mode === 'create' && key === 'new' ) {
            context.commit('LoadSuccess', {mode, schema: NEW_DATA_SCHEMA});
        } else {
            context.dispatch('Load', {mode, key});
        }
    },

    Load(context, {mode, key}: InitOptions) {
        context.commit('Load');
        dataSchemaBackendService
            .findByKey(key)
            .then(schema => context.commit('LoadSuccess', {mode, schema}))
            .catch(failure => context.commit('LoadFailure', failure.response.data));
    },

    Create(context, schema: DataSchema) {
        context.commit('Create');
        dataSchemaBackendService
            .create(schema)
            .then(summary => context.commit('CreateSuccess', {schema, summary}))
            .catch(failure => context.commit('CreateFailure', failure.response.data));
    },

    Update(context, schema: DataSchema) {
        dataSchemaBackendService
            .update(schema)
            .then(summary => context.commit('UpdateSuccess', {schema, summary}))
            .catch(failure => context.commit('UpdateFailure', failure.response.data));
    },

    Delete(context, key: string) {
        dataSchemaBackendService
            .delete(key)
            .then(response => {
                context.commit('DeleteSuccess', key);
            })
            .catch(failure => {
                context.commit('DeleteFailure', failure.response.data);
            });
    },


};
