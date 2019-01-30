import {RootState} from '@/annette/core/store/root-state';
import {Store} from 'vuex';

export function initStore(store: Store<RootState>) {
    console.log('initStore')
    store.dispatch('bpmDiagram/Find', '')
}
