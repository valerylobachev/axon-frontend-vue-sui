import {Module} from 'vuex';
import {RootState} from '@/annette/core/store/root-state';
import {vm} from '@/main';
import {
    DataSchema,
    DataSchemaFilter,
    DataSchemaSummary,
    emptyDataSchemaFilter, newDataSchema,
} from './model';
import {CrudStoreBuilder} from '@/annette/crud/store/crud-store-builder';
import {CrudState} from '@/annette/crud/store/crud-types';
import dataSchemaBackendService from './backend.service';


export interface DataSchemaState
    extends CrudState<DataSchemaFilter, DataSchema, DataSchemaSummary> {
}

export const state: DataSchemaState =
    CrudStoreBuilder.buildState<DataSchemaFilter, DataSchema, DataSchemaSummary>(emptyDataSchemaFilter());


const actions = CrudStoreBuilder.buildActions<DataSchemaFilter, DataSchema, DataSchemaSummary>(
    dataSchemaBackendService, emptyDataSchemaFilter(), newDataSchema(),
);

const mutations = CrudStoreBuilder.buildMutations<DataSchemaFilter, DataSchema, DataSchemaSummary>(
    'key',
    entity => vm.$router.push(`/knowledge-config/schema/edit/${entity.key}`),
    () => '',
);

const getters = CrudStoreBuilder.buildGetters<DataSchemaFilter, DataSchema, DataSchemaSummary>();

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



