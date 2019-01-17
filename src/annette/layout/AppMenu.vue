<template>
    <div class="app-menu ui vertical menu">
        <template v-for="item in menuItems">

            <router-link class="item"
                         v-if="item.type === 'link'"
                         :to="item.state"
                         active-class="active">
                <i v-if="item.icon" class="icon" :class="item.icon"></i>
                {{ $t(item.name)}}
            </router-link>

            <div class="item"
                 v-if="item.type === 'header'">
                <strong>{{ $t(item.name)}}</strong>
            </div>

            <a class="item"
               v-if="item.type === 'sub'"
               @click="menuToggle(item)">
                <i v-if="item.icon" class="icon" :class="item.icon"></i>
                {{ $t(item.name) }}
                <i class="caret-icon angle right icon" v-if="!item.isOpen"></i>
                <i class="caret-icon angle down icon" v-if="item.isOpen"></i>

                <div class="menu" v-if="item.isOpen" @click="$event.stopPropagation()">
                    <template v-for="subItem in item.children">
                        <router-link class="item"
                                     v-if="subItem.type === 'link'"
                                     :to="subItem.state"
                                     active-class="active">
                            <i v-if="subItem.icon" class="icon" :class="subItem.icon"></i>
                            {{ $t(subItem.name) }}
                        </router-link>
                        <div class="item"
                             v-if="subItem.type === 'header'">
                            <i v-if="subItem.icon" class="icon" :class="subItem.icon"></i>
                            <div class="header">
                                {{ $t(subItem.name) }}
                            </div>
                        </div>
                    </template>
                </div>
            </a>

        </template>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {MenuModel} from './menu.model';

    @Component({
        components: {},
    })
    export default class AppMenu extends Vue {
        @Prop(Array) menu: MenuModel[];

        menuItems: MenuModel[] = [];

        @Watch('menu', { immediate: true, deep: true })
        onMenuChanged(val: MenuModel[], oldVal: MenuModel[]) {
            this.menuItems = val;
        }

        menuToggle(item) {
            const key = 'isOpen';
            item[key] = !item.isOpen;
            this.menuItems = [...this.menuItems]
        }
    }
</script>

<style lang="scss" scoped>
    .app-menu {
        padding-top: 14px;
    }
    .app-menu.ui.vertical.menu {
        bottom: 0;
        border-radius: 0 !important;
        border-width: 0 1px 0 0;
        box-shadow: none;
        margin: 0;
        width: 100% !important;
        height: 100%;
    }

    .item {
        width: 100% !important;
    }


    .title-icon {
        float: left !important;
        margin: 0 10px 0 0 !important;
    }


    .app-menu.ui.vertical.menu .item > i.icon {
        width: 1.18em;
        float: none;
        margin: 0 .35714286em 0 0;
    }

    .app-menu.ui.vertical.menu .item > i.icon.caret-icon {
        width: 1.18em;
        float: right;
        margin: 0 0 0 .5em;
    }

    .app-menu.ui.vertical.menu .menu .item {
        background: 0 0;
        padding: .92857143em 1.14285714em;
        font-size: 1rem;
        color: rgba(0, 0, 0, .87);
        padding-left: 2rem;
    }

    .app-menu.ui.vertical.menu .menu a.item:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, .03);
        color: rgba(0, 0, 0, .95);
    }

    .app-menu.ui.vertical.menu .item .menu .active.item {
        background: rgba(0, 0, 0, .05);
        border-radius: 0;
        box-shadow: none;
    }

    .menu > .item:last-child {
        margin-bottom: -13px;
    }

    .app-menu.ui.vertical.menu .active.item {
        // background-color: transparent;
        font-weight: 700;
        // color: rgba(0,0,0,.95);
    }

    .app-menu.ui.vertical.menu .item:before {
        position: absolute;
        content: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 0px;
        background: none;
    }
</style>
