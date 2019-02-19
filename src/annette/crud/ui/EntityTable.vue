<template>
    <div>
        <table class="ui fixed single line striped table"
               :class="{selectable: selectable}"
               v-if="data && data.length > 0">
            <thead>
            <tr>
                <template v-for="column in columns">
                    <th v-if="column.field"
                        :class="{'pointer-cursor': column.sortable}"
                        :style="{width: column.width ? column.width : null}"
                        @click="toggleSort(column)">
                        <slot :name="`${column.field}Header`">
                            {{ caption(column) }}
                            <i class="sort up icon" v-if="column.sortable && isSortAscending(column.field)"></i>
                            <i class="sort down icon" v-if="column.sortable && isSortDescending(column.field)"></i>
                        </slot>
                    </th>
                    <th v-if="column.actions"
                        :style="{width: column.width ? column.width : null}">
                        <slot :name="'actionsHeader'">
                            {{ caption(column) }}
                        </slot>
                    </th>
                </template>
            </tr>
            </thead>
            <tbody>
            <tr :class="{ 'pointer-cursor': selectable }"
                v-for="entity in data"
                :key="entity[keyField]"
                @click="selectEntity(entity)">

                <template v-for="column in columns">
                    <td>
                        <slot v-if="column.field"
                              :name="`${column.field}Cell`"
                              v-bind:entity="entity">
                            {{ entity[column.field] }}
                        </slot>
                        <slot v-if="column.actions"
                              :name="'actionsCell'"
                              v-bind:entity="entity">
                        </slot>
                    </td>
                </template>
            </tr>
            </tbody>
        </table>
        <div class="ui placeholder segment" v-else>
            <div class="ui icon header">
                <i class="archive icon"></i>
                {{ $t(notFoundCaption) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {TableColumn} from '@/annette/crud/ui/table-model';

    @Component({
        components: {},
    })
    export default class EntityTable extends Vue {

        @Prop(Array) data: any[];
        @Prop(String) sortField: string;
        @Prop(Boolean) sortAscending: boolean;

        @Prop({default: false}) selectable: boolean;
        @Prop(String) captionPrefix: string;
        @Prop({default: 'id'}) keyField: string;
        @Prop({default: 'annette.entityTable.notFound'}) notFoundCaption: string;

        @Prop(Array) columns: TableColumn[];

        toggleSort(column: TableColumn) {
            if (column.sortable && column.field) {
                this.$emit('toggleSort', column.field);
            }
        }

        isSortAscending(field: string) {
            return this.sortField === field && this.sortAscending;
        }

        isSortDescending(field: string) {
            return this.sortField === field && !this.sortAscending;
        }

        selectEntity(entity) {
            if (this.selectable) {
                this.$emit('select', entity);
            }
        }

        caption(column: TableColumn) {
            if (column.caption) {
                return this.$t(column.caption);
            } else if (this.captionPrefix && column.field) {
                return this.$t(`${this.captionPrefix}.${column.field}`);
            } else if (column.actions) {
                return this.$t('axon.shared.actions');
            } else if (column.field) {
                return column.field;
            } else {
                return '';
            }
        }
    }
</script>

<style lang="scss">
    .pointer-cursor {
        cursor: pointer !important;
    }
</style>
