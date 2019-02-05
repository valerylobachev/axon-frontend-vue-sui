import {DataSchema, DataSchemaSummary} from './model';
import axios from 'axios';


const SERVICE_BASE = '/web-api/knowledge/repository';

function findAll(): Promise<DataSchemaSummary[]> {
    return find('');
}

function find(filter: string): Promise<DataSchemaSummary[]> {
    return axios.post(`${SERVICE_BASE}/dataSchemas`, {filter})
        .then(result => result.data);
}

function findByKeys(keys: string[]): Promise<DataSchemaSummary[]> {
    return axios.put(`${SERVICE_BASE}/dataSchemas`, keys)
        .then(result => result.data);
}

function findByKey(key: string): Promise<DataSchemaSummary> {
    return axios.get(`${SERVICE_BASE}/dataSchema/${key}`)
        .then(result => result.data);
}

function create(dataSchema: DataSchema): Promise<DataSchemaSummary> {
    return axios.post(`${SERVICE_BASE}/dataSchema`, dataSchema)
        .then(result => result.data);
}

function update(dataSchema: DataSchema): Promise<DataSchemaSummary> {
    return axios.put(`${SERVICE_BASE}/dataSchema`, dataSchema)
        .then(result => result.data);
}

function remove(key: string) {
    const res =  axios.delete(`${SERVICE_BASE}/dataSchema/${key}`)
        .then(result => result.data);
    return res;
}

const dataSchemaBackendService = {
    findAll,
    find,
    findByKey,
    findByKeys,
    create,
    update,
    delete: remove,
};

export default dataSchemaBackendService;
