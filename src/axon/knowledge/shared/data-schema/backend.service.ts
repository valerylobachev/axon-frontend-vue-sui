import {DataSchema, DataSchemaFilter, DataSchemaSummary} from './model';
import axios from 'axios';
import {CrudBackendService} from '@/annette/crud/store/crud-backend.service';

class DataSchemaBackendService extends CrudBackendService<DataSchemaFilter, DataSchema, DataSchemaSummary> {
    constructor() {
        super('/web-api/knowledge/repository', 'dataSchema', 'dataSchemas');
    }

    findByKeys(keys: string[]): Promise<DataSchemaSummary[]> {
        return axios.put(`${this.serviceBase}/${this.entityPluralName}`, keys)
            .then(result => result.data);
    }
}

const dataSchemaBackendService = new DataSchemaBackendService();

export default dataSchemaBackendService;
