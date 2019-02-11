import {ProcessDef} from '@/axon/bpm/shared/deployment/model';
import {DataSchema, DataSchemaFields} from '@/axon/knowledge/shared/data-schema/model';

export interface ProcessReference {
    reference: string,
    key?: string,
    id?: string
}

interface ProcessDefDetail {
    key: string,
    version: string,
    name: string,
}

interface DataSchemaDetail {
    key: string,
    name: string,
}

export interface BusinessProcessSummary {
    id: string,
    name: string,
    description?: string,
    processReference: ProcessReference,
    processReferenceDetail?: ProcessDefDetail
    dataSchemaKey: string,
    dataSchemaDetail?: DataSchemaDetail,
}

export interface BusinessProcess extends BusinessProcessSummary {
    defaults: any,
    dataSchemaFields?: DataSchemaFields,
}

export interface BusinessProcessFilter {
    filter: string
}

export const emptyBusinessProcessFilter: BusinessProcessFilter = {filter: ''};

export const NEW_BUSINESS_PROCESS: BusinessProcess = {
    id: '',
    name: '',
    description: '',
    processReference: {
        reference: 'byKey',
        key: 'myProcess',
    },
    dataSchemaKey: 'Address',
    defaults: {},
};
