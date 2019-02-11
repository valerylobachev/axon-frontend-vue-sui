import {MutationTree} from 'vuex';
import uuidv4 from 'uuid/v4';
import {CrudState, LoadOptions, UpdateOptions} from '@/annette/core/crud/types';


export function buildMutations<F, T, S>(
    idField: string,
    navigateToEdit: (entity: T) => void,
    generateId?: () => string,
    defaultSortField?: string,
    sortByField?: (s: string, b: boolean) => (a: S, b: S) => number,
): MutationTree<CrudState<F, T, S>> {

    generateId = generateId || uuidv4;

    function sortEntities(state: CrudState<F, T, S>): S[] {
        sortByField = sortByField || defaultSortByField;
        defaultSortField = defaultSortField || 'name'
        const entities: S[] = state.ids.map(id => state.entities[id]);
        if (state.sortField) {
            return entities.sort(sortByField(state.sortField, state.sortAscending));
        } else {
            return entities.sort(sortByField(defaultSortField, true));
        }
    }

    function defaultSortByField(field: string, ascending: boolean) {
        return (aObj: S, bObj: S) => {
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

    return {
        Find: (state: CrudState<F, T, S>, filter: F) => {
            state.entitiesLoading = true;
            state.filter = filter;
            state.filterInitialized = true;
        },
        FindSuccess: (state: CrudState<F, T, S>, entities: S[]) => {
            state.entitiesLoading = false;
            state.ids = entities.map(s => s[idField]);
            state.entities = {};
            entities.forEach(s => state.entities[s[idField]] = s);
            state.sortedEntities = sortEntities(state);
            state.failure = null;
        },
        FindFailure: (state: CrudState<F, T, S>, failure: any) => {
            state.ids = [];
            state.entities = {};
            state.failure = failure;
            state.entitiesLoading = false;
            state.sortedEntities = [];
        },
        ToggleSort: (state: CrudState<F, T, S>, field: string) => {
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
        ClearFailure: (state: CrudState<F, T, S>) => {
            state.failure = null;
        },

        Load: (state: CrudState<F, T, S>) => {
            state.failure = null;
            state.loading = true;
            state.loaded = false;
            state.saved = false;
        },

        LoadSuccess: (state: CrudState<F, T, S>, {mode, entity}: LoadOptions<T>) => {
            state.entity = {...entity};
            if (mode === 'create') {
                state.entity[idField] = generateId();
            }
            state.failure = null;
            state.loading = false;
            state.loaded = true;
        },

        LoadFailure: (state: CrudState<F, T, S>, failure: any) => {
            state.entity = null;
            state.failure = failure;
            state.loading = false;
            state.loaded = false;
        },

        Create: (state: CrudState<F, T, S>) => {
            state.saving = true;
            state.failure = null;
            state.saved = false;
        },

        CreateSuccess: (state: CrudState<F, T, S>, {entity, entitySummary}: UpdateOptions<T, S>) => {
            state.saving = false;
            state.failure = null;
            state.saved = true;
            state.entities[entitySummary[idField]] = entitySummary;
            state.ids = Object.keys(state.entities);
            state.sortedEntities = sortEntities(state);
            state.entity = {...entity};
            navigateToEdit(entity)
        },

        CreateFailure: (state: CrudState<F, T, S>, failure: any) => {
            state.saving = false;
            state.failure = failure;
            state.saved = false;
        },

        Update: (state: CrudState<F, T, S>) => {
            state.saving = true;
            state.failure = null;
            state.saved = false;
        },

        UpdateSuccess: (state: CrudState<F, T, S>, {entity, entitySummary}: UpdateOptions<T, S>) => {
            state.saving = false;
            state.failure = null;
            state.saved = true;
            state.entities[entitySummary[idField]] = entitySummary;
            state.ids = Object.keys(state.entities);
            state.sortedEntities = sortEntities(state);
            state.entity = {...entity};
        },

        UpdateFailure: (state: CrudState<F, T, S>, failure: any) => {
            state.saving = false;
            state.failure = failure;
            state.saved = false;
        },

        Delete: (state: CrudState<F, T, S>, id: string) => {
            state.saving = true;
            state.failure = null;
        },
        DeleteSuccess: (state: CrudState<F, T, S>, id: string) => {
            delete state.entities[id];
            state.ids = state.ids.filter(i => i !== id);
            state.sortedEntities = sortEntities(state);
            state.saving = false;
            state.failure = null;
        },
        DeleteFailure: (state: CrudState<F, T, S>, failure: any) => {
            state.saving = false;
            state.failure = failure;
        },
    };
}



