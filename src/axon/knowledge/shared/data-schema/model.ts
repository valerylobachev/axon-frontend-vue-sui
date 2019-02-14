export interface DataSchemaSummary {
    key: string,
    name: string,
    description?: string,

}

export interface Datatype {
    type: string,
    key?: string,
    element?: Datatype,
    struct?: DataSchema,
}

export interface DataSchemaField {
    key: string,
    name: string,
    caption: string,
    datatype: Datatype,
    value?: any,
}

export interface DataSchemaFields {
    [key: string]: DataSchemaField
}

export interface DataSchema extends DataSchemaSummary {
    baseSchemas: string[],
    fields: DataSchemaFields
}

export const NEW_DATA_SCHEMA: DataSchema = {
    key: '',
    name: '',
    description: '',
    baseSchemas: [],
    fields: {},
};


export interface DataSchemaDetail {
    key: string,
    name: string,
}
