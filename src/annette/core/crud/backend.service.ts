import axios from 'axios';

export class BaseBackendService<F, T, S> {

    constructor(private serviceBase: string, private entityName: string, private entityPluralName: string) {
        if (!entityPluralName) {
            this.entityPluralName = `${entityName}s`;
        }
    }

    find(filter: F): Promise<S[]> {
        return axios.post(`${this.serviceBase}/${this.entityPluralName}`, filter)
            .then(result => result.data);
    }

    findById(id: string): Promise<S> {
        return axios.get(`${this.serviceBase}/${this.entityName}/${id}`)
            .then(result => result.data);
    }

    create(entity: T): Promise<S> {
        return axios.post(`${this.serviceBase}/${this.entityName}`, entity)
            .then(result => result.data);
    }

    update(entity: T): Promise<S> {
        return axios.put(`${this.serviceBase}/${this.entityName}`, entity)
            .then(result => result.data);
    }

    remove(id: string) {
        const res = axios.delete(`${this.serviceBase}/${this.entityName}/${id}`)
            .then(result => result.data);
        return res;
    }

}
