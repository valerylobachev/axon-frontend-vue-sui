<template>
    <div class="ui labels">
        <router-link class="ui label"
                     v-for="pd in processDefinitionsLabels()"
                     :to="{name: 'processDefs', query: {key: pd}}"
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

        processDefinitionsLabels() {
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
