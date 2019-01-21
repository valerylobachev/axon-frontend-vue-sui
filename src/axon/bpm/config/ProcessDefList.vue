<template>
    <div class="ui small labels">
        <router-link class="ui label"
                     v-for="pd in processDefinitionsList()"
                     to="TBD"
                     :key="pd">
            {{ pd }}
        </router-link>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class ProcessDefList extends Vue {
        @Prop(String) value: string

        processDefinitionsList() {
            if (this.value && this.value.length > 0) {
                return this.value.split(' ');
            } else {
                return [];
            }
        }
    }
</script>

<style lang="scss">
</style>
