<template>
    <entity-table :data="sortState.sortedEntities"
                  :sortField="sortState.sortField"
                  :sortAscending="sortState.sortAscending"
                  :selectable="false"
                  keyField="key"
                  captionPrefix="axon.bpm.md.businessProcess"
                  notFoundCaption="axon.bpm.form.businessProcessList.notFound"
                  :columns="columns"
                  @toggleSort="$emit('toggleSort', $event)">
        <template v-slot:nameCell="slotProps">
            <router-link :to="`business-process/view/${slotProps.entity.key}`">{{ slotProps.entity.name }}</router-link>
        </template>

        <template v-slot:processReferenceCell="slotProps">
            <process-reference-view
                    :value="slotProps.entity.processReference"
                    :detail="slotProps.entity.processReferenceDetail"></process-reference-view>
        </template>
        <template v-slot:dataSchemaKeyCell="slotProps">
            <data-schema-view
                    :value="slotProps.entity.dataSchemaKey"
                    :detail="slotProps.entity.dataSchemaDetail"></data-schema-view>
        </template>
        <template v-slot:actionsCell="slotProps">

            <router-link class="ui tiny basic icon button"
                         :to="`business-process/create/${slotProps.entity.key}`">
                <i class="copy outline green icon"></i>
            </router-link>
            <router-link class="ui tiny basic icon button"
                         :to="`business-process/edit/${slotProps.entity.key}`">
                <i class="edit blue icon"></i>
            </router-link>
            <button type="button" class="ui tiny basic icon button"
                    @click="$emit('delete', slotProps.entity)">
                <i class="delete red icon"></i>
            </button>
            <button type="button" class="ui tiny basic icon button"
                    @click="$emit('run', slotProps.entity.key)"><i
                    class="play violet icon"></i>
            </button>

        </template>
    </entity-table>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ProcessReferenceView from '@/axon/bpm/shared/components/ProcessReferenceView.vue';
    import DataSchemaView from '@/axon/knowledge/shared/components/DataSchemaView.vue';
    import {TableColumn} from '@/annette/crud/ui/table-model';
    import EntityTable from '@/annette/crud/ui/EntityTable.vue';

    @Component({
        components: {ProcessReferenceView, DataSchemaView, EntityTable},
    })
    export default class BusinessProcessTable extends Vue {

        @Prop(Object) sortState;
        columns: TableColumn[] = [
            {field: 'key', sortable: true},
            {field: 'name', sortable: true},
            {field: 'description', sortable: true},
            {field: 'processReference', sortable: true},
            {field: 'dataSchemaKey', sortable: true},
            {actions: true, width: '12em'},
        ];
    }
</script>

<style lang="scss">
</style>
