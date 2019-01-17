<template>
    <div class="app-layout">
        <app-header @toggleSidebar="toggleSidebar()"></app-header>
        <div class="app-container">
            <app-sidebar v-if="sidebarVisible">
                <app-menu :menu="menu"></app-menu>
            </app-sidebar>
            <div :class="{'app-sidebar-margin': sidebarVisible}">
               <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import AppHeader from './AppHeader.vue';
    import {MenuModel} from './menu.model';
    import AppSidebar from './AppSidebar.vue';
    import AppMenu from './AppMenu.vue';

    @Component({
        components: {
            AppHeader,
            AppSidebar,
            AppMenu,
        },
    })
    export default class AppLayout extends Vue {
        @Prop({ default: 'Annette' }) name: string;
        @Prop(Array) menu: MenuModel[];

        private sidebarVisible = true;

        private created() {
            // `this` указывает на экземпляр vm
            console.log('AppLayout.created');
        }

        private toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        }
    }
</script>

<style lang="scss" scoped>
    .app-layout {
        min-height: 100vh;
        background-color: #f1f4f5;
    }

    .app-container {
        margin-top: 40px;
        min-height: 100%;
        height: 100%;
        //background-color: #f1f4f5;
    }

    .app-sidebar-margin {
        margin-left: 250px;
    }
</style>
