import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enCoreLocale from '@/annette/core/lang/en'
import ruCoreLocale from '@/annette/core/lang/ru'
import enAxonLocale from '@/axon/lang/en'
import ruAxonLocale from '@/axon/lang/ru'

Vue.use(VueI18n)

const messages = {
    en: {
        ...enCoreLocale,
        ...enAxonLocale,
    },
    ru: {
        ...ruCoreLocale,
        ...ruAxonLocale,
    },

};

const i18n = new VueI18n({
    // options: en | ru
    locale: 'en',
    // set locale messages
    messages,
});

export default i18n
