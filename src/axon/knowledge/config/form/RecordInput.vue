<template>
    <div>
        <div class="ui row" style="margin: 1em 0;"
             v-if="!readOnly">
            <button class="ui primary button"
                    @click="setDefault()">
                Set default
            </button>
        </div>
        <div class="field" :class="{error: !isValid }">
          <textarea
                  type="text"
                  name="value"
                  key="recordInput"
                  v-model.trim="stringValue"
                  @input="onChange($event.target.value)"
                  :readOnly="readOnly"></textarea>
        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Datatype} from '@/axon/knowledge/shared/data-schema/model';
    import dataSchemaBackendService from '@/axon/knowledge/shared/data-schema/backend.service';


    @Component({
        components: {},
    })
    export default class RecordInput extends Vue {
        @Prop(Object) value: any;
        @Prop(Object) datatype: Datatype;
        @Prop(Boolean) readOnly: boolean;

        stringValue = '';
        isValid = true;

        @Watch('value', {immediate: true})
        onValueChanged(val) {
            if (typeof val === 'string') {
                this.stringValue = val;
            } else if (typeof val === 'object') {
                this.stringValue = JSON.stringify(val, null, 2);
            }
        }

        onChange(newValue) {
            let json = {};
            try {
                json = JSON.parse(newValue);
                if (typeof json === 'object') {
                    this.$emit('input', json);
                    this.isValid = true;
                } else {
                    this.isValid = false;
                }

            } catch (e) {
                this.isValid = false;
            }
            this.$emit('validation', this.isValid);
        }

        setDefault() {
            dataSchemaBackendService.buildSingleLevel(this.datatype.key).then(ds => {
                const json = {};
                Object.values(ds.fields).forEach(f => json[f.key] = f.value);
                this.onValueChanged(json);
                this.onChange(this.stringValue);
            });

        }

    }
</script>

<style lang="scss">

</style>
