<template>
    <div class="app-sidebar">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class AppSidebar extends Vue {

    }
</script>

<style scoped>
    .app-sidebar {
        position: fixed;
        top: 40px;
        bottom: 0;
        border-radius: 0 !important;
        border-width: 0 1px 0 0;
        box-shadow: none;
        margin: 0;
        width: 250px !important;
        overflow-x: hidden;
        will-change: transform;
     /*background-color: rgb(27, 28, 29);*/
    }
</style>
