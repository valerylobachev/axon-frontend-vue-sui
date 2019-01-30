import {BpmDiagram, BpmDiagramSummary} from '@/axon/bpm/shared/diagram/model';

export interface BpmDiagramState {
    ids: string[];
    entities: { [id: string]: BpmDiagramSummary };

    filter: string;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: BpmDiagramSummary[]

    mode: string;
    id: string
    entity: BpmDiagram;

    loading: boolean;
    loaded: boolean;

    saving: boolean;
    saved: boolean;
}

export interface InitOptions {
    mode: string,
    id: string
}

export interface LoadOptions {
    mode: string,
    diagram: BpmDiagram
}

export interface UpdateOptions {
    diagram: BpmDiagram
    summary: BpmDiagramSummary
}
