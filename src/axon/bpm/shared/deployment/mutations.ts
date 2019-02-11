import {MutationTree} from 'vuex';
import {BpmDeploymentState} from '@/axon/bpm/shared/deployment/types';
import {FindProcessDefOptions, ProcessDef} from '@/axon/bpm/shared/deployment/model';

export const mutations: MutationTree<BpmDeploymentState> = {
    FindProcessDef: (state: BpmDeploymentState, filter: FindProcessDefOptions) => {
        state.entitiesLoading = true;
        state.filter = filter;
        state.filterInitialized = true;
    },
    FindProcessDefSuccess: (state: BpmDeploymentState, diagrams: ProcessDef[]) => {
        state.entitiesLoading = false;
        state.ids = diagrams.map(s => s.id);
        state.entities = {};
        diagrams.forEach(s => state.entities[s.id] = s);
        state.sortedEntities = sortEntities(state);
        state.failure = null;
    },
    FindProcessDefFailure: (state: BpmDeploymentState, failure: any) => {
        state.ids = [];
        state.entities = {};
        state.failure = failure;
        state.entitiesLoading = false;
        state.sortedEntities = [];
    },
    ToggleProcessDefSort: (state: BpmDeploymentState, field: string) => {
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
    ClearFailure: (state: BpmDeploymentState) => {
        state.failure = null;
    },

};

function sortEntities(state: BpmDeploymentState): ProcessDef[] {
    const entities: ProcessDef[] = state.ids.map(id => state.entities[id]);
    if (state.sortField) {
        return entities.sort(sortByField(state.sortField, state.sortAscending));
    } else {
        return entities.sort(sortByField('name', true));
    }
}

function sortByField(field: string, ascending: boolean) {
    return (aObj: ProcessDef, bObj: ProcessDef) => {
        const a = field === 'version' ? aObj[field] : (aObj[field] || '').toLowerCase();
        const b = field === 'version' ? bObj[field] : (bObj[field] || '').toLowerCase();
        if (a < b) {
            return ascending ? -1 : 1;
        } else if (a > b) {
            return ascending ? 1 : -1;
        } else {
            return 0;
        }
    };
}
