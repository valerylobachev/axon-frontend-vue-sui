<template>
        <div class="ui list" style="margin-top: 0;">
            <div class="item">
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
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ProcessReference, ProcessReferenceDetail} from '@/axon/bpm/shared/deployment/model';

    @Component({
        components: {},
    })
    export default class ProcessReferenceView extends Vue {
        @Prop(Object) value: ProcessReference;
        @Prop(Object) detail: ProcessReferenceDetail;

    }
</script>

<style lang="scss">
</style>
