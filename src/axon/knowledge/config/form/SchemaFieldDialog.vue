<template>


    <sui-modal v-model="open">
        <sui-modal-header v-if="readonly">{{ $t('axon.knowledge.form.schemaFieldDialog.viewTitle') }}</sui-modal-header>
        <sui-modal-header v-else>{{ $t('axon.knowledge.form.schemaFieldDialog.editTitle') }}</sui-modal-header>
        <sui-modal-content scrolling>
            <sui-modal-description>
                <div class="ui form" v-if="schemaField">
                    <div class="two fields">

                        <div class="field">
                            <label>{{ $t('axon.knowledge.md.dataSchemaField.key') }}</label>
                            <input type="text" name="key" v-model="schemaField.key" :readOnly="readonly">
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>{{ $t('axon.knowledge.md.dataSchemaField.name') }}</label>
                            <input type="text" name="name" v-model="schemaField.name" :readOnly="readonly">
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.knowledge.md.dataSchemaField.caption') }}</label>
                            <input
                                    type="text"
                                    name="caption"
                                    v-model="schemaField.caption"
                                    :readOnly="readonly">
                        </div>
                    </div>

                    <datatype-selector
                            v-model="schemaField.datatype"
                            :readOnly="readonly"
                            :caption="$t('axon.knowledge.md.dataSchemaField.datatype')"/>

                    <div class="field">
                        <label>{{ $t('axon.knowledge.md.dataSchemaField.value') }}</label>
                        <div class="field">
                            <div class="ui buttons">
                                <button class="ui button"
                                        :class="{active: isNone }"
                                        @click="setNone()">None
                                </button>
                                <button class="ui button"
                                        :class="{active: isValue }"
                                        @click="setValue()">Value
                                </button>
                            </div>
                        </div>
                        <template v-if="isValue">
                            <record-input
                                    v-if="schemaField.datatype.type === 'record'"
                                    v-model="schemaField.value"
                                    :datatype="schemaField.datatype"
                                    @validation="valueValid = $event"
                                    :readOnly="readonly"></record-input>
                            <array-input
                                    v-if="schemaField.datatype.type === 'array'"
                                    v-model="schemaField.value"
                                    :datatype="schemaField.datatype"
                                    @validation="valueValid = $event"
                                    :readOnly="readonly"></array-input>
                            <textarea
                                    type="text"
                                    name="value"
                                    key="string"
                                    v-if="schemaField.datatype.type === 'string'"
                                    v-model.trim="schemaField.value"
                                    :readOnly="readonly"></textarea>
                            <input type="number"
                                   name="value"
                                   key="number"
                                   v-if="schemaField.datatype.type === 'int' || schemaField.datatype.type === 'decimal' || schemaField.datatype.type === 'double'"
                                   v-model.number="schemaField.value"
                                   :readOnly="readonly">
                            <input type="date"
                                   name="value"
                                   key="date"
                                   v-if="schemaField.datatype.type === 'date'"
                                   v-model="schemaField.value"
                                   :readOnly="readonly">
                            <div class="inline fields" v-if="schemaField.datatype.type === 'boolean'">
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input type="radio"
                                               name="ratioFalse"
                                               key="ratioFalse"
                                               v-model="schemaField.value"
                                               :value="false"
                                               :readOnly="readonly">
                                        <label>False</label>
                                    </div>
                                </div>
                                <div class="ui radio checkbox">

                                    <div class="ui radio checkbox">
                                        <input type="radio"
                                               name="ratioTrue"
                                               key="ratioTrue"
                                               v-model="schemaField.value"
                                               :value="true"
                                               :readOnly="readonly">
                                        <label>True</label>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
            <sui-button basic @click.native.prevent="onCancel()">{{ $t('axon.shared.cancel') }}</sui-button>
            <sui-button primary
                        @click.native.prevent="onSave()"
                        :disabled="!isValid">{{ $t('axon.shared.save') }}
            </sui-button>
        </sui-modal-actions>
    </sui-modal>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {DataSchemaField, DataSchemaFields, Datatype} from '@/axon/knowledge/shared/data-schema/model';
    import DatatypeSelector from './DatatypeSelector.vue';
    import RecordInput from '@/axon/knowledge/config/form/RecordInput.vue';
    import ArrayInput from '@/axon/knowledge/config/form/ArrayInput.vue';


    @Component({
        components: {
            DatatypeSelector,
            RecordInput,
            ArrayInput,
        },
    })
    export default class SchemaFieldDialog extends Vue {

        @Prop(Boolean) readonly: boolean;

        schemaField: DataSchemaField = {
            key: '',
            name: '',
            caption: '',
            datatype: {type: 'string'},
            value: null,
        };

        open = false;
        resolve = null;
        reject = null;

        valueValid = true;


        show(schemaField: DataSchemaField) {
            this.open = true;
            this.schemaField = JSON.parse(JSON.stringify(schemaField));
            return new Promise<DataSchemaField>((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;

            });
        }

        onSave() {
            this.open = false;
            this.resolve(this.schemaField);
        }

        onCancel() {
            this.open = false;
            this.reject();
        }

        get nameChange() {
            if (this.schemaField) {
                return this.schemaField.name;
            } else {
                return null;
            }
        }

        @Watch('nameChange')
        onNameChange(newVal: string, oldVal: string) {
            if (this.schemaField && newVal !== oldVal && this.schemaField.caption === oldVal) {
                this.schemaField.caption = newVal;
            }
        }

        get isNone() {
            return this.schemaField.value === null || this.schemaField.value === undefined;
        }

        get isValue() {
            return (this.schemaField.value || this.schemaField.value === '' ||
                this.schemaField.value === false || this.schemaField.value === 0);
        }

        setNone() {
            if (!this.readonly && !this.isNone) {
                this.schemaField.value = null;
            }
        }

        setValue() {
            console.log('setValue 1');
            if (!this.readonly && !this.isValue) {
                console.log('setValue 2');

                switch (this.schemaField.datatype.type) {
                    case 'string':
                        this.$set(this.schemaField, 'value', '');
                        break;
                    case 'int':
                        this.$set(this.schemaField, 'value', 0);
                        break;
                    case 'decimal':
                        this.$set(this.schemaField, 'value', 0);
                        break;
                    case 'double':
                        this.$set(this.schemaField, 'value', 0);
                        break;
                    case 'boolean':
                        this.$set(this.schemaField, 'value', false);
                        break;
                    case 'date':
                        this.$set(this.schemaField, 'value', new Date().toISOString().slice(0, 10));
                        break;
                    case 'record':
                        this.$set(this.schemaField, 'value', {});
                        break;
                    case 'array':
                        this.$set(this.schemaField, 'value', []);
                        break;
                }
                console.log(this.schemaField.value);
            }
        }

        get isValid() {
            return !!this.schemaField.key && !!this.schemaField.name && this.valueValid;
        }
    }
</script>

<style lang="scss">

</style>
