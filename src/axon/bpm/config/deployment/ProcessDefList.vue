<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.bpm.form.processDefList.title') }}</h3>

        <template slot="toolbar">
            <process-def-filter :filter="filter" @filter="find"></process-def-filter>
        </template>

        <div class="ui segment" v-if="failure">
            <div class="ui negative message">
                <i class="close icon" @click="clearFailure"></i>
                <div class="header">
                    {{ $t('axon.shared.error') }}
                </div>
                <p> {{ $t(failure.code, failure) }}</p>
            </div>
        </div>
        <div class="ui segment" >
            <process-def-table :sortState="sortState" @toggleSort="toggleProcessDefSort"></process-def-table>
        </div>

    </app-form>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import {BPM_DEPLOYMENT_NAMESPACE} from '@/axon/bpm/shared/deployment/store';
    import ProcessDefTable from './ProcessDefTable.vue';
    import {emptyProcessDefFilter} from '@/axon/bpm/shared/deployment/model';
    import ProcessDefFilter from '@/axon/bpm/config/deployment/ProcessDefFilter.vue';

    const namespace: string = BPM_DEPLOYMENT_NAMESPACE;

    @Component({
        components: {
            AppForm,
            ProcessDefTable,
            ProcessDefFilter,
        },
    })
    export default class ProcessDefList extends Vue {

        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleProcessDefSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filter;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        created() {
            const key = 'key';
            if (!this.$route.query[key]) {
                this.initFilter();
            }
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            if (to.query.key) {
                this.find({...emptyProcessDefFilter(), key: to.query.key})
            }
        }

        get isEmpty() {
            if (this.sortState && this.sortState.sortedEntities) {
                return this.sortState.sortedEntities.length === 0;
            } else {
                return true;
            }
        }

    }
</script>

<style lang="scss">

</style>
