import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {app} from '@/annette/core/store/store';
import {bpmDiagram} from '@/axon/bpm/shared/diagram/store';
import {RootState} from '@/annette/core/store/root-state';
import {knowledgeDataSchema, knowledgeDataSchemaSelector} from '@/axon/knowledge/shared/data-schema/store';
import {bpmDeployment} from '@/axon/bpm/shared/deployment/store';
import {bpmBusinessProcess} from '@/axon/bpm/shared/process/store';

Vue.use(Vuex);

const storeOptions: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    app,
    bpmDiagram,
    bpmDeployment,
    bpmBusinessProcess,
    knowledgeDataSchema,
    knowledgeDataSchemaSelector,
  },
};

const store = new Vuex.Store<RootState>(storeOptions);


export default store
