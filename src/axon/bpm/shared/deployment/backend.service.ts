import axios from 'axios';
import {
    DeploymentWithDefs,
    emptyProcessDefFilter,
    FindProcessDefOptions,
    ProcessDef,
} from '@/axon/bpm/shared/deployment/model';


const SERVICE_BASE = '/web-api/bpm/deployment';

function findAll(): Promise<ProcessDef[]> {
    return find(emptyProcessDefFilter);
}

function find(filter: FindProcessDefOptions): Promise<ProcessDef[]> {
    return axios.post(`${SERVICE_BASE}/processDefs`, filter)
        .then(result => result.data);
}

function deploy(id: string): Promise<DeploymentWithDefs> {
    return axios.post(`${SERVICE_BASE}/deploy/${id}`)
        .then(result => result.data);
}

const bpmDeploymentBackendService = {
    find,
    findAll,
    deploy,
};

export default bpmDeploymentBackendService;
