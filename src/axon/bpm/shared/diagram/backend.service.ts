import {BpmDiagram, BpmDiagramSummary} from './model';
import axios from 'axios';
import {DeploymentWithDefs} from '@/axon/bpm/shared/deployment/model';


const SERVICE_BASE = '/web-api/bpm/repository';

function findAll(): Promise<BpmDiagramSummary[]> {
    return find('');
}

function find(filter: string): Promise<BpmDiagramSummary[]> {
    return axios.post(`${SERVICE_BASE}/bpmDiagrams`, {filter})
        .then(result => result.data);
}

function findById(id: string): Promise<BpmDiagramSummary> {
    return axios.get(`${SERVICE_BASE}/bpmDiagram/${id}`)
        .then(result => result.data);
}

function create(bpmDiagram: BpmDiagram): Promise<BpmDiagramSummary> {
    return axios.post(`${SERVICE_BASE}/bpmDiagram`, bpmDiagram)
        .then(result => result.data);
}

function update(bpmDiagram: BpmDiagram): Promise<BpmDiagramSummary> {
    return axios.put(`${SERVICE_BASE}/bpmDiagram`, bpmDiagram)
        .then(result => result.data);
}

function remove(id: string) {
    const res =  axios.delete(`${SERVICE_BASE}/bpmDiagram/${id}`)
        .then(result => result.data);
    return res;
}

const bpmDiagramBackendService = {
    findAll,
    find,
    findById,
    create,
    update,
    delete: remove,
};

export default bpmDiagramBackendService;
