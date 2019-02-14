<template>
    <sui-modal v-model="open">
        <sui-modal-header>{{ $t('axon.knowledge.form.dataSchemaModalSelector.title') }}</sui-modal-header>
        <sui-modal-content scrolling>
            <sui-modal-description>
                <div class="row">
                    <div class="ui form form-row">
                        <div class="form-input">
                            <div class="fields">
                                <div class="eight wide field">
                                    <label>{{ $t('axon.bpm.md.processDef.key') }}</label>
                                    <div class="ui fluid icon input">
                                        <input type="text" v-model="filter.key">
                                        <i class=" close link icon" @click="filter.key = ''"></i>
                                    </div>
                                </div>
                                <div class="eight wide field">
                                    <label>{{ $t('axon.bpm.md.processDef.name') }}</label>
                                    <div class="ui fluid icon input">
                                        <input type="text" v-model="filter.name">
                                        <i class=" close link icon" @click="filter.name = ''"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="ui toggle checkbox">
                                <input type="checkbox" v-model="filter.latest">
                                <label>{{ $t('axon.bpm.form.processDefList.latest') }}</label>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button class="ui fluid primary button" @click="find(filter)">
                                {{ $t('axon.shared.find') }}
                            </button>
                            <button class="ui fluid basic button" @click="clearFilter()">
                                {{ $t('axon.shared.clear') }}
                            </button>
                        </div>
                    </div>
                </div>
                <process-def-table
                        v-if="!isEmpty"
                        :sortState="sortState"
                        @toggleSort="toggleSort"
                        :selection="true"
                        @select="selectEntity($event)"
                ></process-def-table>
                <div class="ui placeholder segment" v-if="isEmpty">
                    <div class="ui icon header">
                        <i class="object group outline icon"></i>
                        {{ $t('axon.bpm.form.processDefList.notFound') }}
                    </div>
                </div>
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
    import _ from 'lodash';
    import {emptyProcessDefFilter, FindProcessDefOptions} from '@/axon/bpm/shared/deployment/model';
    import {BPM_DEPLOYMENT_NAMESPACE} from '@/axon/bpm/shared/deployment/store';
    import ProcessDefTable from '@/axon/bpm/config/deployment/ProcessDefTable.vue';

    const namespace: string = BPM_DEPLOYMENT_NAMESPACE;

    @Component({
        components: {
            ProcessDefTable,
        },
    })
    export default class ProcessReferenceModalSelector extends Vue {

        open = false;
        resolve = null;
        reject = null;

        filter: FindProcessDefOptions = emptyProcessDefFilter();


        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        constructor() {
            super();
            this.initFilter();
        }

        created() {
            if (this.filterState) {
                this.filter = this.filterState;
            }
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            if (to.query.key) {
                this.find({...emptyProcessDefFilter(), key: to.query.key});
            }
        }

        @Watch('filterState')
        onFilterStateChanged(newVal: FindProcessDefOptions) {
            this.filter = newVal;
        }

        clearFilter() {
            this.find(emptyProcessDefFilter());
        }

        get isEmpty() {
            if (this.sortState && this.sortState.sortedEntities) {
                return this.sortState.sortedEntities.length === 0;
            } else {
                return true;
            }
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

    .form-row {
        display: flex;
        justify-content: space-between;
        align-content: center;

        width: 100%;
        margin: 0 1em;
    }

    .form-input {
        margin-right: 1em;
        flex-grow: 1
    }

    .form-buttons {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 2em;
        min-width: 9em;
    }
</style>
