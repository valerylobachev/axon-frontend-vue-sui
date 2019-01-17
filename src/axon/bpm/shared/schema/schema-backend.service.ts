import {Schema, SchemaSummary} from './schema.model';
import axios from 'axios';


const SERVICE_BASE = '/web-api/bpm/config';

function findAll(): Promise<SchemaSummary[]> {
    return find('');
}

function find(filter: string): Promise<SchemaSummary[]> {
    return axios.post(`${SERVICE_BASE}/schemas`, {filter})
        .then(result => result.data);
}

function findById(id: string): Promise<SchemaSummary> {
    return axios.get(`${SERVICE_BASE}/schema/${id}`)
        .then(result => result.data);
}

function create(schema: Schema): Promise<SchemaSummary> {
    return axios.post(`${SERVICE_BASE}/schema`, schema)
        .then(result => result.data);
}

function update(schema: Schema): Promise<SchemaSummary> {
    return axios.put(`${SERVICE_BASE}/schema`, schema)
        .then(result => result.data);
}

function remove(id: string) {
    const res =  axios.delete(`${SERVICE_BASE}/schema/${id}`)
        .then(result => result.data);
    return res;
}

const schemaBackendService = {
    findAll,
    find,
    findById,
    create,
    update,
    delete: remove,
};

export default schemaBackendService;
