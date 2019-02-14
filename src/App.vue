<template>
    <app-layout :name="$t('axon.title')" :menu="menu"></app-layout>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AppLayout from '@/annette/layout/AppLayout.vue';
    import {MenuModel} from '@/annette/layout/menu.model';
    import {MENU} from '@/axon/menu';

    @Component({
        components: {
            AppLayout,
        },
    })
    export default class App extends Vue {
        private menu: MenuModel[] = MENU;

    }
</script>

<style lang="scss">

</style>
