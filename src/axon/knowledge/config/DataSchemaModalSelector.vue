<template>
    <sui-modal v-model="open">
        <sui-modal-header>{{ $t('axon.knowledge.form.dataSchemaModalSelector.title') }}</sui-modal-header>
        <sui-modal-content scrolling>
            <sui-modal-description>
                <div class="row">
                    <div class="ui icon action input" style="width: 100%;">
                        <input
                            type="text"
                            :placeholder="$t('axon.knowledge.form.dataSchemaList.filter')"
                            v-model="filter"
                            @input="setFilter($event.target.value)"
                        >
                        <i
                            class="close link icon"
                            style="right: 2.6em; width: 2em;"
                            @click="clearFilter()"
                        ></i>
                        <button class="ui icon button" @click="$event.stopPropagation(); refresh()">
                            <i class="search icon"></i>
                        </button>
                    </div>
                </div>
                <data-schema-table
                    v-if="!isEmpty"
                    :sortState="sortState"
                    @toggleSort="toggleDataSchemaSort"
                    :selection="true"
                    @select="selectDataSchema($event)"
                ></data-schema-table>
                <div class="ui placeholder segment" v-if="isEmpty">
                    <div class="ui icon header">
                        <i class="object group outline icon"></i>
                        {{ $t('axon.knowledge.form.dataSchemaList.notFound') }}
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter, Mutation } from 'vuex-class';
import _ from 'lodash';
import AppForm from '@/annette/layout/AppForm.vue';
import DataSchemaTable from '@/axon/knowledge/config/DataSchemaTable.vue';
import { KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE } from '@/axon/knowledge/shared/data-schema/store';
import { DataSchemaSummary } from '@/axon/knowledge/shared/data-schema/model';

const namespace: string = KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE;

@Component({
    components: {
        AppForm,
        DataSchemaTable,
    },
})
export default class DataSchemaModalSelector extends Vue {

    filter: string = '';

    open = false;
    resolve = null;
    reject = null;

    @Action('InitFilter', { namespace }) initFilter: any;
    @Action('Find', { namespace }) find: any;
    @Mutation('ToggleSort', { namespace }) toggleDataSchemaSort: any;
    @Getter('filter', { namespace }) filterState;
    @Getter('sortState', { namespace }) sortState;


    lazyFind = _.debounce(f => {
        this.find(f);
    },
        500);

    constructor() {
        super();
        this.initFilter();
    }

    select() {
        this.open = true;
        return new Promise<DataSchemaSummary>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject

        })
    }

    selectDataSchema(dataSchema: DataSchemaSummary) {
        this.open = false;
        this.resolve(dataSchema)
    }

    close() {
        this.open = false;
        this.reject()
    }

    created() {
        if (this.filterState) { this.filter = this.filterState };
    }

    @Watch('filterState')
    onFilterStateChanged(val: string, oldVal: string) {
        this.filter = val;
    }

    setFilter(filter: string) {
        this.lazyFind(filter);
    }

    clearFilter() {
        this.find('');
    }

    refresh() {
        this.find(this.filterState);
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
