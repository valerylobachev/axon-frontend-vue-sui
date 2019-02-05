import {DataSchema, DataSchemaSummary} from './model';

export interface DataSchemaState {
    keys: string[];
    entities: { [key: string]: DataSchemaSummary };

    filterInitialized: boolean;
    filter: string;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: DataSchemaSummary[]

    mode: string;
    key: string
    entity: DataSchema;

    loading: boolean;
    loaded: boolean;

    saving: boolean;
    saved: boolean;
}

export interface InitOptions {
    mode: string,
    key: string
}

export interface LoadOptions {
    mode: string,
    schema: DataSchema
}

export interface UpdateOptions {
    schema: DataSchema
    summary: DataSchemaSummary
}
