<template>
    <sui-modal v-model="open">
        <sui-modal-header>{{ $t('axon.knowledge.form.dataSchemaModalSelector.title') }}</sui-modal-header>
        <sui-modal-content scrolling>
            <sui-modal-description>
                <div class="row" style="margin-bottom: 1em;">
                    <process-def-filter :filter="filter" @filter="find"></process-def-filter>
                </div>
                <process-def-table
                        :sortState="sortState"
                        @toggleSort="toggleSort"
                        :selectable="true"
                        @select="selectEntity($event)"></process-def-table>
            </sui-modal-description>
        </sui-modal-content>
        <sui-modal-actions>
            <sui-button basic @click.native.prevent="close()">{{ $t('axon.shared.cancel') }}</sui-button>
        </sui-modal-actions>
    </sui-modal>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import {BPM_DEPLOYMENT_NAMESPACE} from '@/axon/bpm/shared/deployment/store';
    import ProcessDefTable from '@/axon/bpm/config/deployment/ProcessDefTable.vue';
    import ProcessDefFilter from '@/axon/bpm/config/deployment/ProcessDefFilter.vue';

    const namespace: string = BPM_DEPLOYMENT_NAMESPACE;

    @Component({
        components: {
            ProcessDefTable,
            ProcessDefFilter,
        },
    })
    export default class ProcessReferenceModalSelector extends Vue {

        open = false;
        resolve = null;
        reject = null;

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filter;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        constructor() {
            super();
            this.initFilter();
        }

        select() {
            this.open = true;
            return new Promise<any>((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;

            });
        }

        selectEntity(entity) {
            this.open = false;
            if (this.filter.latest) {
                this.resolve({
                    processReference: {
                        reference: 'byKey',
                        key: entity.key,
                    },
                    entity,
                });
            } else {
                this.resolve({
                    processReference: {
                        reference: 'byId',
                        id: entity.id,
                    },
                    entity,
                });
            }
        }

        close() {
            this.open = false;
            this.reject();
        }

    }
</script>

<style lang="scss">

</style>
