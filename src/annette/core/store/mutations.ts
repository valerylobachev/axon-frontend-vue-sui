import {MutationTree} from 'vuex';
import i18n from '@/lang';
import {AppState} from './types';

export const mutations: MutationTree<AppState> = {
    SET_LANGUAGE: (state: AppState, lang: string) => {
        state.language = lang;
        i18n.locale = lang;
    },

    AUTH_LOGIN: (state: AppState, profile: Keycloak.KeycloakProfile) => {
        state.isAuthenticated = true;
        state.profile = profile;
    },
    AUTH_LOGOUT: (state: AppState) => {
        state.isAuthenticated = false;
        // @ts-ignore
        state.profile = null;
    },
};
