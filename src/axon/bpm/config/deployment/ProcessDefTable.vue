<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
        <tr>
            <th @click="toggleSort('key')">
                {{ $t('axon.bpm.md.processDef.key') }}
                <i class="sort up icon" v-if="isSortAscending('key') "></i>
                <i class="sort down icon" v-if="isSortDescending('key')"></i>
            </th>
            <th @click="toggleSort('version')">
                {{ $t('axon.bpm.md.processDef.version') }}
                <i class="sort up icon" v-if="isSortAscending('version')"></i>
                <i class="sort down icon" v-if="isSortDescending('version')"></i>
            </th>
            <th @click="toggleSort('name')">
                {{ $t('axon.bpm.md.processDef.name') }}
                <i class="sort up icon" v-if="isSortAscending('name')"></i>
                <i class="sort down icon" v-if="isSortDescending('name')"></i>
            </th>
            <th @click="toggleSort('description')">
                {{ $t('axon.bpm.md.processDef.description') }}
                <i class="sort up icon" v-if="isSortAscending('description') "></i>
                <i class="sort down icon" v-if="isSortDescending('description')"></i>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entity in sortState.sortedEntities">
            <td>{{ entity.key }}</td>
            <td>{{ entity.version }}</td>
            <td>{{ entity.name }}          </td>
            <td>{{ entity.description }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {BpmDiagramSummary} from '@/axon/bpm/shared/diagram/model';
    import ProcessDefList from './ProcessDefList.vue';

    @Component({
        components: {
            ProcessDefList,
        },
    })
    export default class ProcessDefTable extends Vue {

        @Prop(Object) sortState;

        toggleSort(field: string) {
            this.$emit('toggleSort', field);
        }

        isSortAscending(field: string) {
            return this.sortState.sortField === field && this.sortState.sortAscending;
        }

        isSortDescending(field: string) {
            return this.sortState.sortField === field && !this.sortState.sortAscending;
        }

    }
</script>

<style lang="scss">
    .ui.table thead th {
        cursor: pointer;
    }
</style>
