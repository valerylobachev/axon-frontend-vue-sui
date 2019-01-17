import {ActionTree} from 'vuex';
import {SchemaState} from '@/axon/bpm/shared/schema/types';
import schemaBackendService from '@/axon/bpm/shared/schema/schema-backend.service';
import {RootState} from '@/annette/core/store/root-state';

export const actions: ActionTree<SchemaState, RootState> = {
    FindSchemas(context, filter: string) {
        context.commit('FindSchemas', filter);
        schemaBackendService
            .find(filter)
            .then(response => context.commit('FindSchemasSuccess', response))
            .catch(failure => context.commit('FindSchemasFailure', failure.response.data));
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

    /**/

};
