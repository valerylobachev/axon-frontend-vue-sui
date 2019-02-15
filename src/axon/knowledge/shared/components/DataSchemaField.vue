<template>
    <div>
        <div class="ui left labeled right icon input">
            <div is="router-link" class="ui icon basic label"
                 v-if="value"
                 :to="`/knowledge-config/schema/view/${value}`">
                <i class="tag icon" style="margin-right: 0;"></i>
            </div>
            <input type="text" readonly :value="formatValue">
            <i class="search link icon" @click.prevent="select()"></i>
        </div>
        <data-schema-modal-selector ref="dataSchemaSelector"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {DataSchemaDetail} from '@/axon/knowledge/shared/data-schema/model';
    import DataSchemaModalSelector from '@/axon/knowledge/shared/components/DataSchemaModalSelector.vue';


    @Component({
        components: {
            DataSchemaModalSelector,
        },
    })
    export default class DataSchemaField extends Vue {
        @Prop(String) value: string;
        @Prop(Object) detail: DataSchemaDetail;

        select() {
            (this.$refs.dataSchemaSelector as DataSchemaModalSelector).select().then(res => {
                this.$emit('input', res.key);
                this.$emit('detailChanged', res);
            });
        }

        get formatValue() {
            if (this.value && this.detail && this.detail.name) {
                return this.value + ' - ' + this.detail.name;
            } else if (this.value) {
                return this.value;
            } else {
                return '';
            }
        }

    }
</script>

<style lang="scss">
</style>
