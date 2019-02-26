<template>
    <div class="ui grid">
        <div class="row">
            <div class="column">
                <h4 class="ui header" style="height: 2.5em">SchemaFields
                    <button type="button" class="ui right floated primary button"
                            v-if="!readonly"
                            @click.stop.prevent="createField()">
                        {{$t('axon.shared.create')}}
                    </button>
                </h4>

                <entity-table :data="schemaFields"
                              :sortField="sortField"
                              :sortAscending="sortAscending"
                              :selectable="true"
                              keyField="key"
                              captionPrefix="axon.knowledge.md.dataSchemaField"
                              notFoundCaption="axon.knowledge.form.schemaFieldTable.notFound"
                              :columns="columns"
                              @toggleSort="toggleSort($event)"
                              @select="editField($event)">

                    <template v-slot:datatypeCell="slotProps">
                        {{ displayDatatype(slotProps.entity.datatype)}}
                    </template>

                    <template v-slot:actionsCell="slotProps">


                        <button type="button" class="ui tiny basic icon button"
                                v-if="!readonly"
                                @click.stop.prevent="deleteField(slotProps.entity.key)">
                            <i class="delete red icon"></i>
                        </button>

                    </template>
                </entity-table>
                <schema-field-dialog ref="schemaFieldDialog" :readonly="readonly"></schema-field-dialog>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {DataSchemaField, DataSchemaFields, Datatype} from '@/axon/knowledge/shared/data-schema/model';
    import DatatypeSelector from './DatatypeSelector.vue';
    import RecordInput from '@/axon/knowledge/config/form/RecordInput.vue';
    import {TableColumn} from '@/annette/crud/ui/table-model';
    import EntityTable from '@/annette/crud/ui/EntityTable.vue';
    import SchemaFieldDialog from '@/axon/knowledge/config/form/SchemaFieldDialog.vue';

    const EDIT_COLUMNS: TableColumn[] = [
        {field: 'key', sortable: true},
        {field: 'name', sortable: true},
        {field: 'caption', sortable: true},
        {field: 'datatype', sortable: false},
        {field: 'value', sortable: false},
        {actions: true, width: '7em'},
    ];

    const READONLY_COLUMNS: TableColumn[] = [
        {field: 'key', sortable: true},
        {field: 'name', sortable: true},
        {field: 'caption', sortable: true},
        {field: 'datatype', sortable: false},
        {field: 'value', sortable: false},
    ];

    @Component({
        components: {
            EntityTable,
            SchemaFieldDialog,
        },
    })
    export default class SchemaFieldsTable extends Vue {


        @Prop(Object) value: DataSchemaFields;
        @Prop(Boolean) readonly: boolean;

        columns: TableColumn[] = EDIT_COLUMNS;

        schemaFields: DataSchemaField[] = [];
        selected: DataSchemaField = null;

        sortField = 'key';
        sortAscending = true;

        @Watch('readonly', {immediate: true})
        onReadonlyChanged(newVal) {
            if (newVal) {
                this.columns = READONLY_COLUMNS;
            } else {
                this.columns = EDIT_COLUMNS;
            }
        }

        @Watch('value', {immediate: true})
        onValueChanged(newVal: DataSchemaFields) {
            this.schemaFields = Object.values(newVal);
            if (!this.schemaFields) {
                this.schemaFields = [];
            } else {
                this.sortEntities();
            }
        }

        toggleSort(field: string) {
            switch (this.sortField) {
                case field: {
                    if (this.sortAscending) {
                        this.sortAscending = false;
                    } else {
                        this.sortField = 'key';
                    }
                    break;
                }
                default: {
                    this.sortField = field;
                    this.sortAscending = true;
                    break;
                }
            }
            this.sortEntities();
        }

        sortEntities() {
            function sortByField(field: string, ascending: boolean) {
                return (aObj: DataSchemaField, bObj: DataSchemaField) => {
                    const a = (aObj[field] || '').toLowerCase();
                    const b = (bObj[field] || '').toLowerCase();
                    if (a < b) {
                        return ascending ? -1 : 1;
                    } else if (a > b) {
                        return ascending ? 1 : -1;
                    } else {
                        return 0;
                    }
                };
            }

            if (this.sortField) {
                this.$set(this, 'schemaFields', this.schemaFields.sort(sortByField(this.sortField, this.sortAscending)));
            } else {
                this.$set(this, 'schemaFields', this.schemaFields.sort(sortByField('key', true)));
            }
        }

        editField(field: DataSchemaField) {
            (this.$refs.schemaFieldDialog as SchemaFieldDialog)
                .show(field)
                .then(newValue => {
                    this.schemaFields.push(newValue);
                    this.emitUpdate();
                });
        }

        createField() {
            (this.$refs.schemaFieldDialog as SchemaFieldDialog)
                .show({
                    key: '',
                    name: '',
                    caption: '',
                    datatype: {type: 'string'},
                    value: null,
                })
                .then(newValue => {
                    this.schemaFields.push(newValue);
                    this.emitUpdate();
                });
        }

        deleteField(key: string) {
            const newValue = {...this.value};
            delete (newValue[key]);
            this.onValueChanged(newValue);
            this.emitUpdate();
        }

        emitUpdate() {
            const schemaFields: DataSchemaFields = {};
            this.schemaFields.forEach(f => schemaFields[f.key] = f);
            this.$emit('input', schemaFields);
        }

        displayDatatype(dt: Datatype): string {
            if (dt.type === 'record') {
                return `Record ${dt.key}`;
            } else if (dt.type === 'array') {
                const elementType = this.displayDatatype(dt.element);
                return `Array of ${elementType}`;
            } else {
                return this.capitalizeFirstLetter(dt.type);
            }
        }

        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    }
</script>

<style lang="scss">

</style>
