<template>
    <entity-table :data="sortState.sortedEntities"
                  :sortField="sortState.sortField"
                  :sortAscending="sortState.sortAscending"
                  :selectable="false"
                  captionPrefix="axon.bpm.md.bpmDiagram"
                  notFoundCaption="axon.bpm.form.bpmDiagrams.notFound"
                  :columns="columns"
                  @toggleSort="$emit('toggleSort', $event)">
        <template v-slot:nameCell="slotProps">
            <router-link :to="`diagram/view/${slotProps.entity.id}`">{{ slotProps.entity.name }}</router-link>
        </template>
        <template v-slot:notationCell="slotProps">
            <div class="ui basic label">{{ slotProps.entity.notation }}</div>
        </template>
        <template v-slot:processDefinitionsCell="slotProps">
            <process-def-list :value="slotProps.entity.processDefinitions"></process-def-list>
        </template>
        <template v-slot:actionsCell="slotProps">
            <router-link class="ui tiny basic icon button"
                         :to="`diagram/create/${slotProps.entity.id}`">
                <i class="copy outline green icon"></i>
            </router-link>
            <router-link class="ui tiny basic icon button"
                         :to="`diagram/edit/${slotProps.entity.id}`">
                <i class="edit blue icon"></i>
            </router-link>
            <button type="button" class="ui tiny basic icon button"
                    @click="$emit('deploy', slotProps.entity.id)"><i
                    class="upload violet icon"></i>
            </button>
            <button type="button" class="ui tiny basic icon button"
                    @click="$emit('delete', slotProps.entity)">
                <i class="delete red icon"></i>
            </button>
        </template>

    </entity-table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ProcessDefList from './ProcessDefLabels.vue';
    import EntityTable from '@/annette/crud/ui/EntityTable.vue';
    import {TableColumn} from '@/annette/crud/ui/table-model';

    @Component({
        components: {
            ProcessDefList,
            EntityTable,
        },
    })
    export default class BpmDiagramTable extends Vue {

        @Prop(Object) sortState;

        columns: TableColumn[] = [
            {field: 'name', sortable: true},
            {field: 'description', sortable: true},
            {field: 'notation', sortable: true},
            {field: 'processDefinitions', sortable: true},
            {actions: true, width: '12em'},
        ];

    }
</script>

<style lang="scss">
</style>
