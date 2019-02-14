import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {BaseBackendService} from './base-backend.service';
import {sortEntities} from './sort-entities';
import {BaseState} from './base-types';

function buildActions<F, T, S>(
    backendService: BaseBackendService<F, T, S>,
    emptyFilter: F,
): ActionTree<BaseState<F, T, S>, RootState> {
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
    }
}

function buildGetters<F, T, S>(): GetterTree<BaseState<F, T, S>, RootState> {
    return {
        filter: state => state.filter,

        failure: state => state.failure,

        sortState: state => ({
            sortField: state.sortField,
            sortAscending: state.sortAscending,
            sortedEntities: state.sortedEntities,
        }),
    }
}

function buildMutations<F, T, S>(
    idField: string,
    defaultSortField?: string,
    sortByField?: (s: string, b: boolean) => (a: S, b: S) => number,
): MutationTree<BaseState<F, T, S>> {

    return {
        Find: (state: BaseState<F, T, S>, filter: F) => {
            state.entitiesLoading = true;
            state.filter = filter;
            state.filterInitialized = true;
        },
        FindSuccess: (state: BaseState<F, T, S>, entities: S[]) => {
            state.entitiesLoading = false;
            state.ids = entities.map(s => s[idField]);
            state.entities = {};
            entities.forEach(s => state.entities[s[idField]] = s);
            state.sortedEntities = sortEntities(state, defaultSortField, sortByField);
            state.failure = null;
        },
        FindFailure: (state: BaseState<F, T, S>, failure: any) => {
            state.ids = [];
            state.entities = {};
            state.failure = failure;
            state.entitiesLoading = false;
            state.sortedEntities = [];
        },
        ToggleSort: (state: BaseState<F, T, S>, field: string) => {
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
            state.sortedEntities = sortEntities(state, defaultSortField, sortByField);
        },
        ClearFailure: (state: BaseState<F, T, S>) => {
            state.failure = null;
        },

    }
}

function buildState<F, T, S>(filter: F): BaseState<F, T, S> {
    return {
        ids: [],
        entities: {},

        filterInitialized: false,
        filter,
        entitiesLoading: false,

        failure: null,

        sortField: null,
        sortAscending: true,
        sortedEntities: [],
    }
}


export const BaseStoreBuilder = {
    buildState,
    buildActions,
    buildGetters,
    buildMutations,
};
