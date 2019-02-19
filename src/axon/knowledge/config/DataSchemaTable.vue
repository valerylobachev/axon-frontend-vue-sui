<template>

    <entity-table :data="sortState.sortedEntities"
                  :sortField="sortState.sortField"
                  :sortAscending="sortState.sortAscending"
                  :selectable="selectable"
                  keyField="key"
                  captionPrefix="axon.knowledge.md.dataSchema"
                  notFoundCaption="axon.knowledge.form.dataSchemaList.notFound"
                  :columns="columns"
                  @toggleSort="$emit('toggleSort', $event)"
                  @select="selectEntity($event)">
        <template v-if="!selectable" v-slot:nameCell="slotProps">
            <router-link v-if="!selectable" :to="`/knowledge-config/schema/view/${slotProps.entity.key}`">
                {{ slotProps.entity.name }}
            </router-link>
        </template>


        <template v-if="!selectable" v-slot:actionsCell="slotProps">

            <router-link class="ui tiny basic icon button"
                         :to="`/knowledge-config/schema/create/${slotProps.entity.key}`">
                <i class="copy outline green icon"></i>
            </router-link>
            <router-link class="ui tiny basic icon button"
                         :to="`/knowledge-config/schema/edit/${slotProps.entity.key}`">
                <i class="edit blue icon"></i>
            </router-link>
            <button type="button" class="ui tiny basic icon button"
                    @click="$emit('delete', slotProps.entity)">
                <i class="delete red icon"></i>
            </button>

        </template>
    </entity-table>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {TableColumn} from '@/annette/crud/ui/table-model';
    import EntityTable from '@/annette/crud/ui/EntityTable.vue';

    const COLUMNS: TableColumn[] = [
        {field: 'key', sortable: true},
        {field: 'name', sortable: true},
        {field: 'description', sortable: true},
        {actions: true, width: '9em'},
    ];

    const COLUMNS_FOR_SELECTION: TableColumn[] = [
        {field: 'key', sortable: true},
        {field: 'name', sortable: true},
        {field: 'description', sortable: true},
    ];

    @Component({
        components: {EntityTable},
    })
    export default class DataSchemaTable extends Vue {

        @Prop(Object) sortState;
        @Prop({default: false}) selectable;

        selectEntity(entity) {
            if (this.selectable) {
                this.$emit('select', entity);
            }
        }

        get columns() {
            if (this.selectable) {
                return COLUMNS_FOR_SELECTION;
            } else {
                return COLUMNS;
            }
        }
    }
</script>

<style lang="scss">
</style>
