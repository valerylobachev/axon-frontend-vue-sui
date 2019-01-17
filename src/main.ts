import Vue from 'vue';

import './assets/semantic.min.css'
import './assets/styles.scss'
// @ts-ignore
import SuiVue from 'semantic-ui-vue';

import authService from '@/annette/core/auth/auth-service';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './lang';
import {initStore} from '@/axon/init';

Vue.config.productionTip = false;

authService.init()
    .then(result => {
        Vue.use(SuiVue);
        Vue.config.productionTip = false;
        initStore(store)
        new Vue({
            router,
            store,
            i18n,
            render: h => h(App),
        }).$mount('#app');

    })
    .catch(failure => {
        console.error(failure)
    });
