import keycloak from '@/annette/core/auth/keycloak';
import store from '@/store';
import axios from 'axios';
import router from '@/router';

function loggedIn() {
    keycloak
        .loadUserProfile()
        .success(
            profile =>
                store.dispatch('app/login', profile),
        )
        .error(error => console.error(error));
}

function loggedOut() {
    store.dispatch('app/logout');
}

function logout() {
    keycloak
        .logout()
        .success(() => loggedOut())
        .error(error => console.error(error));
}

function accountManagement() {
    keycloak.accountManagement();
}



function authGuard(to, from, next) {
    console.log('router.beforeEach')
    console.log(from)
    console.log(to)
    if (!keycloak.authenticated) {
        console.log('Keycloak logging in');
        keycloak.login()
            .success(result => {
                console.log('Keycloak logged in');
                console.log(result);
                loggedIn()
                next();
            })
            .error(failure => {
                loggedOut()
                console.log('Keycloak login failure');
                console.log(failure);
            });
    } else {
        console.log('router.beforeEach: already authenticated')
        next()
    }
}

function tokenInterceptor() {
    axios.interceptors.request.use(
        config => {
            return new Promise((resolve, reject) => {
                keycloak
                    .updateToken(30)
                    .success(() => {
                        config.headers.Authorization = `Bearer ${keycloak.token}`;
                        resolve(config);
                    })
                    .error(failure => {
                        reject(`Failed to refresh the token, or the session has expired: ${failure}`);
                    });
            });
        },
        error => {
            return Promise.reject(error);
        });
}

function init(options?: any) {
    options = options || {onLoad: 'login-required'};
    return new Promise((resolve, reject) => {
        console.log('Keycloak initializing...');
        keycloak
            .init(options)
            .success(result => {
                console.log('Keycloak initialized');
                tokenInterceptor();
                authService.loggedIn();
                resolve(result);
            })
            .error(failure => {
                console.log('Keycloak init failure');
                authService.loggedOut();
                reject(failure);
            });
    })
}

const authService = {
    loggedIn,
    loggedOut,
    logout,
    accountManagement,
    authGuard,
    init,
};

export default authService;
