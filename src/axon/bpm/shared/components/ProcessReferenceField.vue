<template>
    <div>
        <div class="ui left labeled right icon input">
            <div is="router-link" class="ui icon basic label"
                 v-if="value"
                 :to="{name: 'processDefs', query: {key: detail.key}}">
                <i class="tag icon" style="margin-right: 0;"></i>
            </div>
            <input type="text" readonly :value="formatValue">
            <i class="search link icon" @click.prevent="select()"></i>
        </div>
        <process-reference-modal-selector ref="processReferenceSelector"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ProcessReference, ProcessReferenceDetail} from '@/axon/bpm/shared/deployment/model';
    import ProcessReferenceModalSelector from '@/axon/bpm/shared/components/ProcessReferenceModalSelector.vue';


    @Component({
        components: {
            ProcessReferenceModalSelector,
        },
    })
    export default class DataSchemaField extends Vue {
        @Prop(Object) value: ProcessReference;
        @Prop(Boolean) readOnly: boolean;
        @Prop(Object) detail: ProcessReferenceDetail;

        select() {
            (this.$refs.processReferenceSelector as ProcessReferenceModalSelector).select().then(res => {
                this.$emit('input', res.processReference);
                this.$emit('detailChanged', {
                    key: res.entity.key,
                    version: res.processReference.reference === 'byId' ? res.entity.version : null,
                    name: res.entity.name,
                });
            });
        }
        get formatValue() {
            if (this.value && this.detail) {
                const version = this.detail.version ? `(v. ${this.detail.version})` : '(latest)';
                const name = this.detail.name ? `- ${this.detail.name}` : '' ;
                return `${this.detail.key} ${version} ${name}`;
            } else {
                return '';
            }
        }
    }
</script>

<style lang="scss">
</style>
