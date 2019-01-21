import {ActionTree} from 'vuex';
import {InitOptions, SchemaState} from '@/axon/bpm/shared/schema/types';
import schemaBackendService from '@/axon/bpm/shared/schema/schema-backend.service';
import {RootState} from '@/annette/core/store/root-state';
import {NEW_BPMN_SCHEMA, NEW_CMMN_SCHEMA, NEW_DMN_SCHEMA, Schema} from '@/axon/bpm/shared/schema/schema.model';

export const actions: ActionTree<SchemaState, RootState> = {
    FindSchemas(context, filter: string) {
        context.commit('FindSchemas', filter);
        schemaBackendService
            .find(filter)
            .then(response => context.commit('FindSchemasSuccess', response))
            .catch(failure => context.commit('FindSchemasFailure', failure.response.data));
    },

    InitSchema(context, {mode, id}: InitOptions) {
        if (mode === 'create' && id === 'BPMN') {
            context.commit('LoadSchemaSuccess', {mode, schema: NEW_BPMN_SCHEMA});
        } else if (mode === 'create' && id === 'DMN') {
            context.commit('LoadSchemaSuccess', {mode, schema: NEW_DMN_SCHEMA});
        } else if (mode === 'create' && id === 'CMMN') {
            context.commit('LoadSchemaSuccess', {mode, schema: NEW_CMMN_SCHEMA});
        } else {
            context.dispatch('LoadSchema', {mode, id});
        }
    },

    LoadSchema(context, {mode, id}: InitOptions) {
        context.commit('LoadSchema');
        schemaBackendService
            .findById(id)
            .then(schema => context.commit('LoadSchemaSuccess', {mode, schema}))
            .catch(failure => context.commit('LoadSchemaFailure', failure.response.data));
    },

    CreateSchema(context, schema: Schema) {
        context.commit('CreateSchema');
        schemaBackendService
            .create(schema)
            .then(summary => context.commit('CreateSchemaSuccess', {schema, summary}))
            .catch(failure => context.commit('CreateSchemaFailure', failure.response.data));
    },

    UpdateSchema(context, schema: Schema) {
        schemaBackendService
            .update(schema)
            .then(summary => context.commit('UpdateSchemaSuccess', {schema, summary}))
            .catch(failure => context.commit('UpdateSchemaFailure', failure.response.data));
    },

    DeleteSchema(context, id: string) {
        schemaBackendService
            .delete(id)
            .then(response => {
                context.commit('DeleteSchemaSuccess', id);
            })
            .catch(failure => {
                context.commit('DeleteSchemaFailure', failure.response.data);
            });
    },


};
