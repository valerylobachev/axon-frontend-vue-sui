import {DataSchemaDetail, DataSchemaFields} from '@/axon/knowledge/shared/data-schema/model';
import {ProcessReference, ProcessReferenceDetail} from '@/axon/bpm/shared/deployment/model';

export interface BusinessProcessSummary {
    key: string,
    name: string,
    description?: string,
    processReference: ProcessReference,
    processReferenceDetail?: ProcessReferenceDetail
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

export function emptyBusinessProcessFilter(): BusinessProcessFilter {
    return {filter: ''};
}

export function newBusinessProcess(): BusinessProcess {
    return {
        key: '',
        name: '',
        description: '',
        processReference: null,
        dataSchemaKey: null,
        defaults: {},
    };
};
