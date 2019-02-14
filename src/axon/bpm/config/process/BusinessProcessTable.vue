<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
        <tr>
            <th @click="toggleSort('key')">
                {{ $t('axon.bpm.md.businessProcess.key') }}
                <i class="sort up icon" v-if="isSortAscending('key')"></i>
                <i class="sort down icon" v-if="isSortDescending('key')"></i>
            </th>
            <th @click="toggleSort('name')">
                {{ $t('axon.bpm.md.businessProcess.name') }}
                <i class="sort up icon" v-if="isSortAscending('name')"></i>
                <i class="sort down icon" v-if="isSortDescending('name')"></i>
            </th>
            <th @click="toggleSort('description')">
                {{ $t('axon.bpm.md.businessProcess.description') }}
                <i class="sort up icon" v-if="isSortAscending('description') "></i>
                <i class="sort down icon" v-if="isSortDescending('description')"></i>
            </th>
            <th @click="toggleSort('processReference')">
                {{ $t('axon.bpm.md.businessProcess.processReference') }}
                <i class="sort up icon" v-if="isSortAscending('processReference')"></i>
                <i class="sort down icon" v-if="isSortDescending('processReference')"></i>
            </th>
            <th @click="toggleSort('dataSchemaKey')">
                {{ $t('axon.bpm.md.businessProcess.dataSchemaKey') }}
                <i class="sort up icon" v-if="isSortAscending('dataSchemaKey')"></i>
                <i class="sort down icon" v-if="isSortDescending('dataSchemaKey')"></i>
            </th>
            <th style="width: 12em;">{{ $t('axon.bpm.form.businessProcessList.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="businessProcess in sortState.sortedEntities">
            <td>{{ businessProcess.key }}</td>
            <td>
                <router-link :to="`business-process/view/${businessProcess.key}`">{{ businessProcess.name }}
                </router-link>
            </td>
            <td>{{ businessProcess.description }}</td>
            <td>
                <process-reference-view
                        :value="businessProcess.processReference"
                        :detail="businessProcess.processReferenceDetail"></process-reference-view>
            </td>
            <td>
                <data-schema-view
                        :value="businessProcess.dataSchemaKey"
                        :detail="businessProcess.dataSchemaDetail"></data-schema-view>

            </td>
            <td>
                <slot v-bind:businessProcess="businessProcess"></slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ProcessReferenceView from '@/axon/bpm/shared/components/ProcessReferenceView.vue';
    import DataSchemaView from '@/axon/knowledge/shared/components/DataSchemaView.vue';

    @Component({
        components: {ProcessReferenceView, DataSchemaView},
    })
    export default class BusinessProcessTable extends Vue {

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
