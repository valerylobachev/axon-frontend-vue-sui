import {GetterTree} from 'vuex';
import {RootState} from './root-state';
import {AppState} from './types';

export const getters: GetterTree<AppState, RootState> = {
    languages: state => state.languages,
    language: state => state.language,

    isAuthenticated: state => state.isAuthenticated,
    profile: state => state.profile,
};
