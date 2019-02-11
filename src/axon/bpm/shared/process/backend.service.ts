import {BusinessProcess, BusinessProcessFilter, BusinessProcessSummary} from '@/axon/bpm/shared/process/model';
import {BaseBackendService} from '@/annette/core/crud/backend.service';

const bpmBusinessProcessBackendService =
    new BaseBackendService<BusinessProcessFilter, BusinessProcess, BusinessProcessSummary>(
        '/web-api/bpm/repository', 'businessProcess', 'businessProcesses');

export default bpmBusinessProcessBackendService;
