import {Schema, SchemaSummary} from '@/axon/bpm/shared/schema/schema.model';

export interface SchemaState {
    ids: string[];
    entities: { [id: string]: SchemaSummary };

    filter: string;
    entitiesLoading: boolean;

    failure: any;

    sortField: string
    sortAscending: boolean
    sortedEntities: SchemaSummary[]

    mode: string;
    id: string
    entity: Schema;

    loading: boolean;
    loaded: boolean;

    saving: boolean;
    saved: boolean;
}
