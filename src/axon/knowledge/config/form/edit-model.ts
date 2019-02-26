import {Datatype} from '@/axon/knowledge/shared/data-schema/model';

export interface EditItem {
    key: string,
    name: string,
    datatype: Datatype,
    value?: any,
    recordItems?: EditItem[]
    arrayItems?: EditItem[]
}
