<template>
    <div>
        <div class="ui list">
            <div class="item">
                <div class="right floated content" v-if="!readOnly">
                    <div class="ui icon button" @click.prevent="select()">
                        <i class="search link icon"></i>
                    </div>
                </div>
                <div class="content">
                    <div class="header" v-if="!detail">
                        <div class="ui small red label">
                            {{ $t('axon.bpm.md.processDef.invalidProcessReference') }}
                        </div>
                    </div>
                    <router-link class="header" v-if="detail"
                                 :to="{name: 'processDefs', query: {key: detail.key}}">
                        {{ detail.key }}
                        <span v-if="detail.version">
                            (v. {{ detail.version }})
                        </span>
                        <span v-if="!detail.version">
                                        (latest)
                        </span>
                    </router-link>
                    <div class="description" v-if="detail && detail.name">{{ detail.name }}</div>
                </div>
            </div>
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
                    name: res.entity.key,
                });
            });
        }

    }
</script>

<style lang="scss">
</style>
