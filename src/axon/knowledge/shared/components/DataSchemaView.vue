<template>
        <div class="ui list" style="margin-top: 0;">
            <div class="item">
                <div class="content">
                    <div class="header" v-if="!detail">
                        <div class="ui small red label">
                            {{ $t('axon.knowledge.md.dataSchema.invalidDataSchema') }}
                        </div>
                    </div>
                    <router-link class="header"
                                 v-if="detail"
                                 :to="`/knowledge-config/schema/view/${detail.key}`">
                        {{ detail.key }}
                    </router-link>
                    <div class="description" v-if="detail">{{ detail.name }}</div>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {DataSchemaDetail} from '@/axon/knowledge/shared/data-schema/model';


    @Component({
        components: {},
    })
    export default class DataSchemaView extends Vue {
        @Prop(String) value: string;
        @Prop(Object) detail: DataSchemaDetail;
    }
</script>

<style lang="scss">
</style>
