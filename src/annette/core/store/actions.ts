import {ActionTree} from 'vuex';
import {RootState} from './root-state';
import {AppState} from './types';

export const actions: ActionTree<AppState, RootState> = {
    setLanguage({commit}, lang: string) {
        commit('SET_LANGUAGE', lang);
    },

    login({commit}, profile: Keycloak.KeycloakProfile) {
        commit('AUTH_LOGIN', profile);
    },
    logout({commit}) {
        commit('AUTH_LOGOUT');
    },

};
