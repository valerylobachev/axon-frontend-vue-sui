import {Module} from 'vuex';
import {DataSchemaState} from './types';
import {mutations} from './mutations';
import {actions} from './actions';
import {getters} from './getters';
import {RootState} from '@/annette/core/store/root-state';


export const state: DataSchemaState = {
    keys: [],
    entities: {},

    filterInitialized: false,
    filter: '',
    entitiesLoading: false,

    failure: null,

    sortField: null,
    sortAscending: true,
    sortedEntities: [],

    mode: null,
    key: null,
    entity: null,

    loading: false,
    loaded: false,

    saving: false,
    saved: false,
};


const namespaced: boolean = true;

export const KNOWLEDGE_DATA_SCHEMA_NAMESPACE: string = 'knowledgeDataSchema';
export const KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE: string = 'knowledgeDataSchemaSelector';

export const knowledgeDataSchema: Module<DataSchemaState, RootState> = {
    namespaced,
    state: {...state},
    mutations,
    actions,
    getters,
};

export const knowledgeDataSchemaSelector: Module<DataSchemaState, RootState> = {
    namespaced,
    state: {...state},
    mutations,
    actions,
    getters,
};



