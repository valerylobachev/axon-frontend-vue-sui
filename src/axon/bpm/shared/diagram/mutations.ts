import {MutationTree} from 'vuex';
import {LoadOptions, BpmDiagramState, UpdateOptions} from '@/axon/bpm/shared/diagram/types';
import {BpmDiagramSummary} from '@/axon/bpm/shared/diagram/model';
import uuidv4 from 'uuid/v4';
import {vm} from '@/main';

export const mutations: MutationTree<BpmDiagramState> = {
    Find: (state: BpmDiagramState, filter: string) => {
        state.entitiesLoading = true;
        state.filter = filter;
    },
    FindSuccess: (state: BpmDiagramState, diagrams: BpmDiagramSummary[]) => {
        state.entitiesLoading = false;
        state.ids = diagrams.map(s => s.id);
        state.entities = {};
        diagrams.forEach(s => state.entities[s.id] = s);
        state.sortedEntities = sortEntities(state);
        state.failure = null;
    },
    FindFailure: (state: BpmDiagramState, failure: any) => {
        state.ids = [];
        state.entities = {};
        state.failure = failure;
        state.entitiesLoading = false;
        state.sortedEntities = [];
    },
    ToggleSort: (state: BpmDiagramState, field: string) => {
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
    ClearFailure: (state: BpmDiagramState) => {
        state.failure = null;
    },

    Load: (state: BpmDiagramState) => {
        state.failure = null;
        state.loading = true;
        state.loaded = false;
        state.saved = false;
    },

    LoadSuccess: (state: BpmDiagramState, {mode, diagram}: LoadOptions) => {
        state.entity = {...diagram};
        if (mode === 'create') {
            state.entity.id = uuidv4()
        }
        state.failure = null;
        state.loading = false;
        state.loaded = true;
    },

    LoadFailure: (state: BpmDiagramState, failure: any) => {
        state.entity = null;
        state.failure = failure;
        state.loading = false;
        state.loaded = false;
    },

    Create: (state: BpmDiagramState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    CreateSuccess: (state: BpmDiagramState, {diagram, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.id] = summary;
        state.ids = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...diagram};
        vm.$router.push(`/bpm-config/diagram/edit/${diagram.id}`)
    },

    CreateFailure: (state: BpmDiagramState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    Update: (state: BpmDiagramState) => {
        state.saving = true;
        state.failure = null;
        state.saved = false;
    },

    UpdateSuccess: (state: BpmDiagramState, {diagram, summary}: UpdateOptions) => {
        state.saving = false;
        state.failure = null;
        state.saved = true;
        state.entities[summary.id] = summary;
        state.ids = Object.keys(state.entities);
        state.sortedEntities = sortEntities(state);
        state.entity = {...diagram};
    },

    UpdateFailure: (state: BpmDiagramState, failure: any) => {
        state.saving = false;
        state.failure = failure;
        state.saved = false;
    },

    Delete: (state: BpmDiagramState, id: string) => {
        state.saving = true;
        state.failure = null;
    },
    DeleteSuccess: (state: BpmDiagramState, id: string) => {
        delete state.entities[id];
        state.ids = state.ids.filter(i => i !== id);
        state.sortedEntities = sortEntities(state);
        state.saving = false;
        state.failure = null;
    },
    DeleteFailure: (state: BpmDiagramState, failure: any) => {
        state.saving = false;
        state.failure = failure;
    },

};

function sortEntities(state: BpmDiagramState): BpmDiagramSummary[] {
    const entities: BpmDiagramSummary[] = state.ids.map(id => state.entities[id]);
    if (state.sortField) {
        return entities.sort(sortByField(state.sortField, state.sortAscending));
    } else {
        return entities.sort(sortByField('name', true));
    }
}

function sortByField(field: string, ascending: boolean) {
    return (aObj: BpmDiagramSummary, bObj: BpmDiagramSummary) => {
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
