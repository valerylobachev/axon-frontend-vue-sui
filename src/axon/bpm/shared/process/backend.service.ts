import {BusinessProcess, BusinessProcessFilter, BusinessProcessSummary} from '@/axon/bpm/shared/process/model';
import {CrudBackendService} from '@/annette/crud/store/index';

const bpmBusinessProcessBackendService =
    new CrudBackendService<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
        '/web-api/bpm/repository', 'businessProcess', 'businessProcesses');

export default bpmBusinessProcessBackendService;
