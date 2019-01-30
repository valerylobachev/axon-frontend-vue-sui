import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {app} from '@/annette/core/store/store';
import {bpmDiagram} from '@/axon/bpm/shared/diagram/store';
import {RootState} from '@/annette/core/store/root-state';

Vue.use(Vuex);

const storeOptions: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    app,
    bpmDiagram,
  },
};

const store = new Vuex.Store<RootState>(storeOptions);


export default store
