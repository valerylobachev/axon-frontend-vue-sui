<template>
    <div class="ui inverted fixed blue menu">
        <a class="item labeled openbtn" @click="$emit('toggleSidebar')">
            <i class="bars icon"></i>
        </a>
        <router-link class="item header" to="/">Annette Axon</router-link>

        <div class="right menu">

            <sui-dropdown class="ui primary dropdown button" :text="appState.language.toUpperCase()">
                <sui-dropdown-menu>
                    <sui-dropdown-item v-for="lang in appState.languages"
                                       :key="lang"
                                       @click="setLanguage(lang)"
                    :active="lang === appState.language">
                        {{ lang.toUpperCase() }}
                    </sui-dropdown-item>
                </sui-dropdown-menu>
            </sui-dropdown>

            <sui-dropdown class="ui primary dropdown button" :text="username">
                <sui-dropdown-menu>
                    <sui-dropdown-item @click="onProfileClick()">
                        <sui-icon name="user"/>
                        {{ $t('annette.appHeader.profile') }}
                    </sui-dropdown-item>
                    <router-link class="item" to="/settings">
                        <i class="cog icon"></i>
                        {{ $t('annette.appHeader.settings') }}
                    </router-link>
                    <sui-dropdown-item @click="onLogoutClick()">
                        <sui-icon name="power off"/>
                        {{ $t('annette.appHeader.logout') }}
                    </sui-dropdown-item>
                </sui-dropdown-menu>
            </sui-dropdown>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import authService from '@/annette/core/auth/auth-service';
    import {Action, State} from 'vuex-class';
    import {AppState} from '@/annette/core/store/types';

    const namespace = 'app';

    @Component({
        components: {},
    })
    export default class AppHeader extends Vue {
        @State('app') appState: AppState;
        @Action('setLanguage', { namespace }) setLanguage: any;

        private created() {
            // `this` указывает на экземпляр vm
            console.log('AppHeader.created');
        }

        private onProfileClick() {
            authService.accountManagement();
        }

        private onLogoutClick() {
            authService.logout();
        }

        get username() {
            const profile = this.appState.profile;
            if (profile) {
                return profile.firstName + ' ' + profile.lastName;
            } else {
                return '';
            }
        }

    }
</script>

<style scoped>

</style>
