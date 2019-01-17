import {Module} from 'vuex';
import {RootState} from './root-state';
import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';
import {AppState} from './types';

const state: AppState = {
    language: 'en',
    languages: ['en', 'ru'],

    isAuthenticated: false,
    profile: null,
};

const namespaced = true;

export const app: Module<AppState, RootState> = {
    namespaced,
    state,
    mutations,
    actions,
    getters,
};

