export interface CrudState<F, T, S> {
    ids: string[];
    entities: { [id: string]: S };

    filterInitialized: boolean;
    filter: F;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: S[]

    mode: string;
    id: string
    entity: T;

    loading: boolean;
    loaded: boolean;

    saving: boolean;
    saved: boolean;
}

export function buildEmptyCrudState<F, T, S>(filter: F): CrudState<F, T, S> {
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

        mode: null,
        id: null,
        entity: null,

        loading: false,
        loaded: false,

        saving: false,
        saved: false,
    };
};

export interface InitOptions {
    mode: string,
    id: string
}

export interface LoadOptions<T> {
    mode: string,
    entity: T
}

export interface UpdateOptions<T, S> {
    entity: T
    entitySummary: S
}
