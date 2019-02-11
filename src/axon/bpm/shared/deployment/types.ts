import {FindProcessDefOptions, ProcessDef} from '@/axon/bpm/shared/deployment/model';

export interface BpmDeploymentState {
    ids: string[];
    entities: { [id: string]: ProcessDef };

    filterInitialized: boolean;
    filter: FindProcessDefOptions;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: ProcessDef[]
}

