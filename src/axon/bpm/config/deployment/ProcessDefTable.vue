<template>
    <entity-table :data="sortState.sortedEntities"
                  :sortField="sortState.sortField"
                  :sortAscending="sortState.sortAscending"
                  :selectable="selectable"
                  captionPrefix="axon.bpm.md.processDef"
                  notFoundCaption="axon.bpm.form.processDef.notFound"
                  :columns="columns"
                  @toggleSort="$emit('toggleSort', $event)"
                  @select="selectEntity($event)">
    </entity-table>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {TableColumn} from '@/annette/crud/ui/table-model';
    import EntityTable from '@/annette/crud/ui/EntityTable.vue';

    @Component({
        components: {
            EntityTable,
        },
    })
    export default class ProcessDefTable extends Vue {

        @Prop(Object) sortState;
        @Prop({default: false}) selectable;

        columns: TableColumn[] = [
            {field: 'key', sortable: true},
            {field: 'version', sortable: true},
            {field: 'name', sortable: true},
            {field: 'description', sortable: true},
        ];

        selectEntity(entity) {
            if (this.selectable) {
                this.$emit('select', entity);
            }
        }
    }
</script>

<style lang="scss">

</style>
