<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
        <tr>
            <th @click="toggleSort('name')">
                {{ $t('axon.bpm.md.schema.name') }}
                <i class="sort up icon" v-if="isSortAscending('name')"></i>
                <i class="sort down icon" v-if="isSortDescending('name')"></i>
            </th>
            <th @click="toggleSort('description')">
                {{ $t('axon.bpm.md.schema.description') }}
                <i class="sort up icon" v-if="isSortAscending('description') "></i>
                <i class="sort down icon" v-if="isSortDescending('description')"></i>
            </th>
            <th @click="toggleSort('notation')">
                {{ $t('axon.bpm.md.schema.notation') }}
                <i class="sort up icon" v-if="isSortAscending('notation')"></i>
                <i class="sort down icon" v-if="isSortDescending('notation')"></i>
            </th>
            <th @click="toggleSort('processDefinitions')">
                {{ $t('axon.bpm.md.schema.processDefinitions') }}
                <i class="sort up icon" v-if="isSortAscending('processDefinitions')"></i>
                <i class="sort down icon" v-if="isSortDescending('processDefinitions')"></i>
            </th>
            <th>{{ $t('axon.bpm.form.schemas.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="schema in sortState.sortedEntities">
            <td>
                <router-link :to="`schema/view/${schema.id}`">{{ schema.name }}</router-link>
            </td>
            <td>{{ schema.description }}</td>
            <td>
                <div class="ui basic label">{{ schema.notation }}</div>
            </td>
            <td>
                <process-def-list :value="schema.processDefinitions"></process-def-list>
            </td>
            <td>
                <slot v-bind:schema="schema"></slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SchemaSummary} from '@/axon/bpm/shared/schema/schema.model';
    import ProcessDefList from '@/axon/bpm/config/ProcessDefList.vue';

    @Component({
        components: {
            ProcessDefList,
        },
    })
    export default class SchemaTable extends Vue {

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

        processDefinitionsList(schema: SchemaSummary) {
            if (schema && schema.processDefinitions && schema.processDefinitions.length > 0) {
                return schema.processDefinitions.split(' ');
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
