<template>
    <div>
        <div class="field" :class="{error: !isValid }">
          <textarea
                  type="text"
                  name="arrayInput"
                  key="arrayInput"
                  v-model.trim="stringValue"
                  @input="onChange($event.target.value)"
                  :readOnly="readOnly"></textarea>
        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Datatype} from '@/axon/knowledge/shared/data-schema/model';


    @Component({
        components: {},
    })
    export default class ArrayInput extends Vue {
        @Prop(Array) value: any;
        @Prop(Object) datatype: Datatype;
        @Prop(Boolean) readOnly: boolean;

        stringValue = '';
        isValid = true;

        @Watch('value', {immediate: true})
        onValueChanged(val) {
            if (typeof val === 'string') {
                this.stringValue = val;
            } else if (Array.isArray(val)) {
                this.stringValue = JSON.stringify(val, null, 2);
            }
        }

        onChange(newValue) {
            let json = {};
            try {
                json = JSON.parse(newValue);
                if (Array.isArray(json)) {
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

    }
</script>

<style lang="scss">

</style>
