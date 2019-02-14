export interface BaseState<F, T, S> {
    ids: string[];
    entities: { [id: string]: S };

    filterInitialized: boolean;
    filter: F;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: S[]
}


