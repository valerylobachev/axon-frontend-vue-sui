import {MutationTree} from 'vuex';
import {LoadOptions, SchemaState, UpdateOptions} from '@/axon/bpm/shared/schema/types';
import {SchemaSummary} from '@/axon/bpm/shared/schema/schema.model';
import uuidv4 from 'uuid/v4';
import {vm} from '@/main';

export const mutations: MutationTree<SchemaState> = {
    FindSchemas: (state: SchemaState, filter: string) => {
        state.entitiesLoading = true;
        state.filter = filter;
    },
    FindSchemasSuccess: (state: SchemaState, schemas: SchemaSummary[]) => {
        state.entitiesLoading = false;
        state.ids = schemas.map(s => s.id);
        state.entities = {};
        schemas.forEach(s => state.entities[s.id] = s);
        state.sortedEntities = sortEntities(state);
        state.failure = null;
    },
    FindSchemasFailure: (state: SchemaState, failure: any) => {
        state.ids = [];
        state.entities = {};
        state.failure = failure;
        state.entitiesLoading = false;
        state.sortedEntities = [];
    },
    ToggleSchemaSort: (state: SchemaState, field: string) => {
        switch (state.sortField) {
            case field: {
                if (state.sortAscending) {
                    state.sortAscending = false;
                } else {
                    state.sortField = null;
                }
                break;
            }
            default: {
                state.sortField = field;
                state.sortAscending = true;
                break;
            }
        }
        state.sortedEntities = sortEntities(state);
    },
    ClearFailure: (state: SchemaState) => {
        state.failure = null;
    },

    LoadSchema: (state: SchemaState) => {
        state.failure = null;
        state.loading = true;
        state.loaded = false;
    },

    LoadSchemaSuccess: (state: SchemaState, {mode, schema}: LoadOptions) => {
        state.entity = {...schema};
        if (mode === 'create') {
            state.entity.id = uuidv4()
        }
        state.failure = null;
        state.loading = false;
        state.loaded = true;
    },

    LoadSchemaFailure: (state: SchemaState, failure: any) => {
        state.entity = null;
        state.failure = failure;
        state.loading = false;
        state.loaded = false;
    },

    CreateSchema: (state: SchemaState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    CreateSchemaSuccess: (state: SchemaState, {schema, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.id] = summary;
        state.ids = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...schema};
        vm.$router.push(`/bpm-config/schema/update/${schema.id}`)
    },

    CreateSchemaFailure: (state: SchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    UpdateSchema: (state: SchemaState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    UpdateSchemaSuccess: (state: SchemaState, {schema, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.id] = summary;
        state.ids = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...schema};
    },

    UpdateSchemaFailure: (state: SchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    DeleteSchema: (state: SchemaState, id: string) => {
        state.saving = true;
        state.failure = null;
    },
    DeleteSchemaSuccess: (state: SchemaState, id: string) => {
        delete state.entities[id];
        state.ids = state.ids.filter(i => i !== id);
        state.sortedEntities = sortEntities(state);
        state.saving = false;
        state.failure = null;
    },
    DeleteSchemaFailure: (state: SchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
    },

};

function sortEntities(state: SchemaState): SchemaSummary[] {
    const entities: SchemaSummary[] = state.ids.map(id => state.entities[id]);
    if (state.sortField) {
        return entities.sort(sortByField(state.sortField, state.sortAscending));
    } else {
        return entities.sort(sortByField('name', true));
    }
}

function sortByField(field: string, ascending: boolean) {
    return (aObj: SchemaSummary, bObj: SchemaSummary) => {
        const a = (aObj[field] || '').toLowerCase();
        const b = (bObj[field] || '').toLowerCase();
        if (a < b) {
            return ascending ? -1 : 1;
        } else if (a > b) {
            return ascending ? 1 : -1;
        } else {
            return 0;
        }
    };
}
