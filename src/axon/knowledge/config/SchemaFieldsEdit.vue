<template>
    <div class="ui grid">
        <div class="row">
            <div class="ten wide column">
                <h4 class="ui header">Fields</h4>
                <table class="ui selectable fixed single line striped table">
                    <thead>
                    <tr>
                        <th @click="toggleSort('key')">
                            {{ $t('axon.knowledge.md.dataSchemaField.key') }}
                            <i
                                    class="sort up icon"
                                    v-if="isSortAscending('key')"
                            ></i>
                            <i class="sort down icon" v-if="isSortDescending('key')"></i>
                        </th>
                        <th @click="toggleSort('name')">
                            {{ $t('axon.knowledge.md.dataSchemaField.name') }} /
                            {{ $t('axon.knowledge.md.dataSchemaField.caption') }}
                            <i
                                    class="sort up icon"
                                    v-if="isSortAscending('name')"
                            ></i>
                            <i class="sort down icon" v-if="isSortDescending('name')"></i>
                        </th>
                        <th>{{ $t('axon.knowledge.md.dataSchemaField.datatype') }}</th>
                        <th>{{ $t('axon.knowledge.md.dataSchemaField.value') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                            v-for="(field, index) in fields"
                            :key="field.key"
                            :class="{ active: field === selected }"
                            @click="select(field, index)"
                    >
                        <td>{{ field.key }}</td>
                        <td>
                            <div class="ui list">
                                <div class="item">
                                    <div class="content">
                                        <div class="header">{{field.name}}</div>
                                        <div class="description">{{ field.caption }}</div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{{ dislpayDatatype(field.datatype)}}</td>
                        <td>
                            <pre>{{ field.value }}</pre>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="six wide column">
                <h4 class="ui header">Selected field</h4>
                <div v-if="!readonly" style="display: flex; justify-content: space-around;">
                    <button type="button"
                            class="ui basic button"
                            v-if="mode !== 'create'"
                            @click.prevent="onCreate"
                    >{{ $t('axon.shared.create') }}
                    </button>
                    <button type="button"
                            class="ui negative button"
                            :class="{ disabled: !selected}"
                            v-if="mode !== 'create'"
                            @click.prevent="onDelete"
                    >{{ $t('axon.shared.delete') }}
                    </button>
                    <button type="button"
                            class="ui primary button"
                            v-if="mode === 'create'"
                            @click.prevent="onSave"
                    >{{ $t('axon.shared.save') }}
                    </button>
                    <button type="button"
                            class="ui basic button"
                            v-if="mode === 'create'"
                            @click.prevent="onCancel"
                    >{{ $t('axon.shared.cancel') }}
                    </button>
                </div>
                <div class="ui form" v-if="selected">
                    <div class="field">
                        <label>{{ $t('axon.knowledge.md.dataSchemaField.key') }}</label>
                        <input type="text" name="key" v-model="selected.key" :readOnly="readonly">
                    </div>
                    <div class="field">
                        <label>{{ $t('axon.knowledge.md.dataSchemaField.name') }}</label>
                        <input type="text" name="name" v-model="selected.name" :readOnly="readonly">
                    </div>
                    <div class="field">
                        <label>{{ $t('axon.knowledge.md.dataSchemaField.caption') }}</label>
                        <input
                                type="text"
                                name="caption"
                                v-model="selected.caption"
                                :readOnly="readonly"
                        >
                    </div>
                    <datatype-selector
                            v-model="selected.datatype"
                            :readOnly="readonly"
                            :caption="$t('axon.knowledge.md.dataSchemaField.datatype')"
                    />

                    <div class="field" :class="{error: invalidObject }">
                        <label>{{ $t('axon.knowledge.md.dataSchemaField.value') }}</label>
                        <textarea
                                type="text"
                                name="value"
                                key="string"
                                v-if="selected.datatype.type === 'string' || selected.datatype.type === 'array' || selected.datatype.type === 'record'"
                                v-model.trim="selected.value"
                                :readOnly="readonly"></textarea>
                        <input type="number"
                               name="value"
                               key="number"
                               v-if="selected.datatype.type === 'int' || selected.datatype.type === 'decimal' || selected.datatype.type === 'double'"
                               v-model.number="selected.value"
                               :readOnly="readonly">
                        <input type="date"
                               name="value"
                               key="date"
                               v-if="selected.datatype.type === 'date'"
                               v-model="selected.value"
                               :readOnly="readonly">
                        <div class="inline fields" v-if="selected.datatype.type === 'boolean'">
                            <div class="ui radio checkbox">
                                <input type="radio"
                                       name="ratioFalse"
                                       key="ratioFalse"
                                       v-model="selected.value"
                                       :value="false"
                                       :readOnly="readonly">
                                <label>False</label>
                            </div>
                            <div class="ui radio checkbox">
                                <input type="radio"
                                       name="ratioFalse"
                                       key="ratioFalse"
                                       v-model="selected.value"
                                       :value="true"
                                       :readOnly="readonly">
                                <label>True</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {DataSchemaField, DataSchemaFields, Datatype} from '@/axon/knowledge/shared/data-schema/model';
    import DatatypeSelector from './DatatypeSelector.vue';


    @Component({
        components: {
            DatatypeSelector,
        },
    })
    export default class SchemaFieldsEdit extends Vue {
        @Prop(Object) value: DataSchemaFields;
        @Prop(Boolean) readonly: boolean;

        fields: DataSchemaField[] = [];
        selected: DataSchemaField = null;
        selectedIndex: number = null;
        mode = 'edit';

        sortField = 'key';
        sortAscending = true;

        created() {
            this.onValueChanged(this.value);
        }

        @Watch('value')
        onValueChanged(newVal: DataSchemaFields) {
            this.fields = Object.values(newVal);
            if (!this.fields) {
                this.fields = [];
            } else {
                this.sortEntities();
            }
        }

        nameUpdated(event) {
            console.log('event');
            console.log(event);
            console.log('selected');
            console.log(this.selected);
        }

        get nameChange() {
            if (this.selected) {
                return this.selected.name;
            } else {
                return null;
            }
        }

        @Watch('nameChange')
        onNameChange(newVal: string, oldVal: string) {
            if (this.selected && newVal !== oldVal && this.selected.caption === oldVal) {
                this.selected.caption = newVal;
            }
        }

        isSortAscending(field: string) {
            return this.sortField === field && this.sortAscending === true;
        }

        isSortDescending(field: string) {
            return this.sortField === field && this.sortAscending === false;
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
                this.fields = this.fields.sort(sortByField(this.sortField, this.sortAscending));
            } else {
                this.fields = this.fields.sort(sortByField('key', true));
            }
        }

        select(field: DataSchemaField, index: number) {
            if (this.selectedIndex === index) {
                this.mode = 'edit';
                this.selected = null;
                this.selectedIndex = null;
            } else {
                this.mode = 'edit';
                this.selectedIndex = index;
                this.selected = field;
            }
        }

        onCreate() {
            this.mode = 'create';
            this.selected = {
                key: '',
                name: '',
                caption: '',
                datatype: {type: 'string'},
                value: null,
            };
        }

        onSave() {
            this.mode = 'edit';
            this.fields.push(this.selected);
            this.emitUpdate();
        }

        onCancel() {
            this.mode = 'edit';
            this.selected = null;
        }

        onDelete() {
            this.fields.splice(this.selectedIndex);
            this.selected = null;
            this.selectedIndex = null;
            this.emitUpdate();
        }

        emitUpdate() {
            const fields: DataSchemaFields = {};
            this.fields.forEach(f => fields[f.key] = f);
            this.$emit('input', fields);
        }

        dislpayDatatype(dt: Datatype): string {
            if (dt.type === 'record') {
                return `Record ${dt.key}`;
            } else if (dt.type === 'array') {
                const elementType = this.dislpayDatatype(dt.element);
                return `Array of ${elementType}`;
            } else {
                return this.capitalizeFirstLetter(dt.type);
            }
        }

        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        get invalidObject() {
            if (this.selected && this.selected.datatype.type === 'array') {
                try {
                    const a = JSON.parse(this.selected.value);
                    return !Array.isArray(a);
                } catch (e) {
                    return true;
                }
            } else if (this.selected && this.selected.datatype.type === 'record') {
                try {
                    const a = JSON.parse(this.selected.value);
                    return typeof a !== 'object';
                } catch (e) {
                    return true;
                }
            } else {
                return false;
            }

        }
    }
</script>

<style lang="scss">

</style>
