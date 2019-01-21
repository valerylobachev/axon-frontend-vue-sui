import Vue from 'vue';

import './assets/semantic.min.css';
import './assets/styles.scss';

// @ts-ignore
import SuiVue from 'semantic-ui-vue';

import authService from '@/annette/core/auth/auth-service';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './lang';
import {initStore} from '@/axon/init';
import {sync} from 'vuex-router-sync';

Vue.config.productionTip = false;
Vue.use(SuiVue);
sync(store, router);

export let vm;

authService.init()
    .then(result => {
        Vue.config.productionTip = false;
        Vue.use(SuiVue);
        // sync(store, router);
        initStore(store);
        vm = new Vue({
            router,
            store,
            i18n,
            render: h => h(App),
        });
        vm.$mount('#app');

    })
    .catch(failure => {
        console.error(failure);
    });
