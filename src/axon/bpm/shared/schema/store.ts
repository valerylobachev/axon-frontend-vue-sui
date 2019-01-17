import {Module} from 'vuex';
import {SchemaState} from './types';
import {mutations} from './mutations';
import {actions} from './actions';
import {getters} from './getters';
import {RootState} from '@/annette/core/store/root-state';


export const state: SchemaState = {
    ids: [],
    entities: {},

    filter: '',
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


const namespaced: boolean = true;

export const bpmSchema: Module<SchemaState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};



