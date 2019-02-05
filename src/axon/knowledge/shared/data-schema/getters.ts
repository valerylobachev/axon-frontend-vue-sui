import {GetterTree} from 'vuex';
import {DataSchemaState} from './types';
import {RootState} from '@/annette/core/store/root-state';

export const getters: GetterTree<DataSchemaState, RootState> = {
    filter: state => state.filter,

    failure: state => state.failure,
    loading: state => state.loading,

    sortState: state => ({
        sortField: state.sortField,
        sortAscending: state.sortAscending,
        sortedEntities: state.sortedEntities,
    }),

    entity: state => state.entity,
    saved: state => state.saved,

    loadingState: state => ({
        loading: state.loading,
        loaded: state.loaded,
    }),

    savingState: state => ({
        saving: state.saving,
        saved: state.saved,
    }),

};




