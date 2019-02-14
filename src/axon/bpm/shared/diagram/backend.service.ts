import {BpmDiagram, BpmDiagramFilter, BpmDiagramSummary} from './model';
import {CrudBackendService} from '@/annette/crud/store/crud-backend.service';


const bpmDiagramBackendService =
    new CrudBackendService<BpmDiagramFilter, BpmDiagram, BpmDiagramSummary>(
        '/web-api/bpm/repository', 'bpmDiagram', 'bpmDiagrams');

export default bpmDiagramBackendService;
