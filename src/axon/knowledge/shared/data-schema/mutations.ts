import {MutationTree} from 'vuex';
import {LoadOptions, DataSchemaState, UpdateOptions} from './types';
import {DataSchemaSummary} from './model';
import {vm} from '@/main';

export const mutations: MutationTree<DataSchemaState> = {
    Find: (state: DataSchemaState, filter: string) => {
        state.entitiesLoading = true;
        state.filter = filter;
        state.filterInitialized = true;
    },
    FindSuccess: (state: DataSchemaState, diagrams: DataSchemaSummary[]) => {
        state.entitiesLoading = false;
        state.keys = diagrams.map(s => s.key);
        state.entities = {};
        diagrams.forEach(s => state.entities[s.key] = s);
        state.sortedEntities = sortEntities(state);
        state.failure = null;
    },
    FindFailure: (state: DataSchemaState, failure: any) => {
        state.keys = [];
        state.entities = {};
        state.failure = failure;
        state.entitiesLoading = false;
        state.sortedEntities = [];
    },
    ToggleSort: (state: DataSchemaState, field: string) => {
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
    Sort(state: DataSchemaState, { field, ascending }) {
        state.sortField = field;
        state.sortAscending = ascending;
        state.sortedEntities = sortEntities(state);

    },
    ClearFailure: (state: DataSchemaState) => {
        state.failure = null;
    },

    Load: (state: DataSchemaState) => {
        state.failure = null;
        state.loading = true;
        state.loaded = false;
        state.saved = false;
    },

    LoadSuccess: (state: DataSchemaState, {mode, schema}: LoadOptions) => {
        state.entity = {...schema};
        if (mode === 'create') {
            state.entity.key = ''
        }
        state.failure = null;
        state.loading = false;
        state.loaded = true;
    },

    LoadFailure: (state: DataSchemaState, failure: any) => {
        state.entity = null;
        state.failure = failure;
        state.loading = false;
        state.loaded = false;
    },

    Create: (state: DataSchemaState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    CreateSuccess: (state: DataSchemaState, {schema, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.key] = summary;
        state.keys = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...schema};
        vm.$router.push(`/knowledge-config/schema/edit/${schema.key}`)
    },

    CreateFailure: (state: DataSchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    Update: (state: DataSchemaState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    UpdateSuccess: (state: DataSchemaState, {schema, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.key] = summary;
        state.keys = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...schema};
    },

    UpdateFailure: (state: DataSchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    Delete: (state: DataSchemaState, key: string) => {
        state.saving = true;
        state.failure = null;
    },
    DeleteSuccess: (state: DataSchemaState, key: string) => {
        delete state.entities[key];
        state.keys = state.keys.filter(i => i !== key);
        state.sortedEntities = sortEntities(state);
        state.saving = false;
        state.failure = null;
    },
    DeleteFailure: (state: DataSchemaState, failure: any) => {
        state.saving = false;
        state.failure = failure;
    },

};

function sortEntities(state: DataSchemaState): DataSchemaSummary[] {
    const entities: DataSchemaSummary[] = state.keys.map(key => state.entities[key]);
    if (state.sortField) {
        return entities.sort(sortByField(state.sortField, state.sortAscending));
    } else {
        return entities.sort(sortByField('name', true));
    }
}

function sortByField(field: string, ascending: boolean) {
    return (aObj: DataSchemaSummary, bObj: DataSchemaSummary) => {
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
