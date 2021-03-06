<template>
    <div class="field">
        <label>{{ caption }}</label>
        <sui-dropdown
                selection
                :options="options"
                v-model="datatype.type"
                @input="selectDatatype($event)"/>
        <div class="field"
             style="padding-left: 1em;"
             v-if="datatype.type === 'record'"
             :class="{error: datatype.key === ''}">
            <label>Data schema key</label>
            <div class="ui icon input">
                <input type="text" readOnly v-model="datatype.key">
                <i class="search link icon" @click.prevent="select()"></i>
            </div>
        </div>
        <datatype-selector
                style="padding-left: 1em;"
                v-if="datatype.type === 'array'"
                :nested="true"
                v-model="datatype.element"
                :caption="$t('axon.knowledge.md.dataSchemaField.elementDatatype')"/>
        <data-schema-modal-selector ref="dataSchemaSelector"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Datatype, DataSchemaSummary} from '@/axon/knowledge/shared/data-schema/model';
    import DataSchemaModalSelector from '@/axon/knowledge/shared/components/DataSchemaModalSelector.vue';

    const TYPE_OPTIONS = [
        {value: 'string', text: 'String'},
        {value: 'int', text: 'Integer'},
        {value: 'double', text: 'Double'},
        {value: 'decimal', text: 'Decimal'},
        {value: 'boolean', text: 'Boolean'},
        {value: 'date', text: 'Date'},
        {value: 'record', text: 'Record'},
        {value: 'array', text: 'Array'},
    ];

    const NESTED_TYPE_OPTIONS = [
        {value: 'string', text: 'String'},
        {value: 'int', text: 'Integer'},
        {value: 'double', text: 'Double'},
        {value: 'decimal', text: 'Decimal'},
        {value: 'boolean', text: 'Boolean'},
        {value: 'date', text: 'Date'},
        {value: 'record', text: 'Record'},
    ];

    @Component({
        components: {
            DataSchemaModalSelector,
        },
    })
    export default class DatatypeSelector extends Vue {
        @Prop(Object) value: Datatype;
        @Prop(Boolean) readOnly: boolean;
        @Prop({default: false}) nested: boolean;
        @Prop(String) caption: string;

        datatype: Datatype = {type: 'string'};
        options = TYPE_OPTIONS;
        dataSchema: DataSchemaSummary = {
            key: '',
            name: '',
            description: '',
        };

        @Watch('value', {immediate: true, deep: true})
        onValueChanged(newVal: Datatype) {
            this.datatype = newVal;
            if (!this.datatype) {
                this.datatype = {type: 'string'};
            }
        }

        @Watch('nested', {immediate: true})
        onNestedChanged(newVal: boolean) {
            console.log('onNestedChanged ' + newVal);
            if (newVal) {
                this.$set(this, 'options', NESTED_TYPE_OPTIONS);
            } else {
                this.$set(this, 'options', TYPE_OPTIONS);
            }
        }

        emitUpdate() {
            this.$emit('input', this.datatype);
        }

        select() {
            (this.$refs.dataSchemaSelector as DataSchemaModalSelector).select().then(res => {
                this.datatype.key = res.key;
                this.emitUpdate();
            });
        }

        selectDatatype(event) {
            console.log(event);
            if (event === 'array') {
                this.$set(this.datatype, 'element', {type: 'string'});
                this.$set(this.datatype, 'key', null);
                this.emitUpdate();
            } else if (event === 'record') {
                this.$set(this.datatype, 'element', null);
                this.$set(this.datatype, 'key', '');
                this.emitUpdate();
            } else {
                this.$set(this.datatype, 'element', null);
                this.$set(this.datatype, 'key', null);
            }
        }
    }
</script>

<style lang="scss">
</style>
