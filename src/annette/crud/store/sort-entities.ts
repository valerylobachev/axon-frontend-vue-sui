import {BaseState} from './base-types';

export function sortEntities<F, T, S>(state: BaseState<F, T, S>,
                                      defaultSortField?: string,
                                      sortByField?: (s: string, b: boolean) => (a: S, b: S) => number,
): S[] {

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

    sortByField = sortByField || defaultSortByField;
    defaultSortField = defaultSortField || 'name';
    const entities: S[] = state.ids.map(id => state.entities[id]);
    if (state.sortField) {
        return entities.sort(sortByField(state.sortField, state.sortAscending));
    } else {
        return entities.sort(sortByField(defaultSortField, true));
    }
}
