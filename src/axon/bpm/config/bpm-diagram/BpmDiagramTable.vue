<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
        <tr>
            <th @click="toggleSort('name')">
                {{ $t('axon.bpm.md.bpmDiagram.name') }}
                <i class="sort up icon" v-if="isSortAscending('name')"></i>
                <i class="sort down icon" v-if="isSortDescending('name')"></i>
            </th>
            <th @click="toggleSort('description')">
                {{ $t('axon.bpm.md.bpmDiagram.description') }}
                <i class="sort up icon" v-if="isSortAscending('description') "></i>
                <i class="sort down icon" v-if="isSortDescending('description')"></i>
            </th>
            <th @click="toggleSort('notation')">
                {{ $t('axon.bpm.md.bpmDiagram.notation') }}
                <i class="sort up icon" v-if="isSortAscending('notation')"></i>
                <i class="sort down icon" v-if="isSortDescending('notation')"></i>
            </th>
            <th @click="toggleSort('processDefinitions')">
                {{ $t('axon.bpm.md.bpmDiagram.processDefinitions') }}
                <i class="sort up icon" v-if="isSortAscending('processDefinitions')"></i>
                <i class="sort down icon" v-if="isSortDescending('processDefinitions')"></i>
            </th>
            <th style="width: 12em;">{{ $t('axon.bpm.form.bpmDiagrams.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bpmDiagram in sortState.sortedEntities">
            <td>
                <router-link :to="`diagram/view/${bpmDiagram.id}`">{{ bpmDiagram.name }}</router-link>
            </td>
            <td>{{ bpmDiagram.description }}</td>
            <td>
                <div class="ui basic label">{{ bpmDiagram.notation }}</div>
            </td>
            <td>
                <process-def-list :value="bpmDiagram.processDefinitions"></process-def-list>
            </td>
            <td>
                <slot v-bind:bpmDiagram="bpmDiagram"></slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {BpmDiagramSummary} from '@/axon/bpm/shared/diagram/model';
    import ProcessDefList from './ProcessDefLabels.vue';

    @Component({
        components: {
            ProcessDefList,
        },
    })
    export default class BpmDiagramTable extends Vue {

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

        processDefinitionsList(bpmDiagram: BpmDiagramSummary) {
            if (bpmDiagram && bpmDiagram.processDefinitions && bpmDiagram.processDefinitions.length > 0) {
                return bpmDiagram.processDefinitions.split(' ');
            } else {
                return [];
            }
        }
    }
</script>

<style lang="scss">
    .ui.table thead th {
        cursor: pointer;
    }
</style>
