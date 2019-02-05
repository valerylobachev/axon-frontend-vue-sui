<template>
    <div class="ui grid">
        <div class="two column row">
            <div class="column">
                <h4 class="ui header">Selected data schemas</h4>
                <div class="ui middle aligned divided selection list">
                    <div class="item" v-for="(key, index) in baseSchemas" :key="key">
                        <div class="right floated content" v-if="!readonly">
                            <div class="ui basic icon mini button"
                                 :class="{ disabled: index == baseSchemas.length - 1 }"
                                 @click="down(index)"><i class="arrow down icon"></i></div>
                            <div class="ui basic icon mini button"
                                 :class="{ disabled: index == 0}"
                                 @click="up(index)"><i class="arrow up icon"></i></div>
                            <div class="ui basic icon mini button"
                                 @click="remove(key)"><i class="delete red icon"></i></div>
                        </div>
                        <div class="content">
                            <router-link class="header" :to="`../../schema/view/${key}`">{{key}}</router-link>
                            <div class="description" v-if="schemaSummaries[key]">{{ schemaSummaries[key].name }}</div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="column">
                <h4 class="ui header">Data schema to select</h4>
                <div class="ui icon action input fluid">
                    <input type="text" :placeholder="$t('axon.knowledge.form.dataSchemaList.filter')"
                           v-model="filter"
                           @input="setFilter($event.target.value)">
                    <i class=" close link icon"
                       style="right: 2.6em; width: 2em;"
                       @click="clearFilter()"></i>
                    <button class="ui icon button" @click.prevent="refresh()">
                        <i class="search icon"></i>
                    </button>
                </div>
                <div style="padding-top: 5px; padding-bottom: 5px;">
                    Sort by:
                    <sui-dropdown class="inline" value="Name">
                        <sui-dropdown-menu>
                            <sui-dropdown-item @select="setSort({field: 'name', ascending: true})" value="Name">Name
                            </sui-dropdown-item>
                            <sui-dropdown-item @select="setSort({field: 'key', ascending: true})" value="Key">Key
                            </sui-dropdown-item>
                        </sui-dropdown-menu>
                    </sui-dropdown>
                </div>
                <div class="ui middle aligned divided selection list">
                    <div class="item" v-for="item in schemaSummariesToSelect" :key="item.key">
                        <div class="left floated content" v-if="!readonly">
                            <div class="ui basic icon mini button" @click="add(item)"><i class="plus blue icon"></i></div>
                        </div>
                        <div class="content">
                            <router-link class="header" :to="`../../schema/view/${item.key}`">{{item.key}}</router-link>
                            <div class="description">{{ item.name}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import {KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE} from '@/axon/knowledge/shared/data-schema/store';
    import _ from 'lodash';
    import {DataSchemaSummary} from '@/axon/knowledge/shared/data-schema/model';
    import dataSchemaBackendService from '@/axon/knowledge/shared/data-schema/backend.service';


    const namespace: string = KNOWLEDGE_DATA_SCHEMA_SELECTOR_NAMESPACE;

    @Component({
        components: {
        },
    })
    export default class BaseSchemasEdit extends Vue {
        @Prop(String) parentKey: string;
        @Prop(Array) value: string[];
        @Prop(Boolean) readonly: boolean;

        @Getter('loading', {namespace}) loading;
        @Action('InitFilter', {namespace}) initFilter: any;
        @Action('Find', {namespace}) find: any;
        @Mutation('ToggleSort', {namespace}) toggleDataSchemaSort: any;
        @Mutation('Sort', {namespace}) setSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
        @Getter('failure', {namespace}) failure;

        filter: string = '';

        baseSchemas: string[] = [];

        schemaSummaries: { [key: string]: DataSchemaSummary } = {};
        schemaSummariesToSelect: DataSchemaSummary[] = [];

        lazyFind = _.debounce(f => {
                this.find(f);
            },
            500);

        constructor() {
            super();
            this.initFilter();
        }

        created() {
            if (this.filterState) {
                this.filter = this.filterState;
            }
            this.onValueChanged(this.value);
            this.onSortStateChanged(this.sortState);
        }

        @Watch('value')
        onValueChanged(newVal: string[]) {
            // TODO
            this.baseSchemas = newVal;
            const keys: string[] = newVal.filter(e => !this.schemaSummaries[e]);
            dataSchemaBackendService.findByKeys(keys).then(res => {
                res.forEach(e => this.$set(this.schemaSummaries, e.key, e));
            });


            console.log('onBaseSchemasChanged');
            console.log(newVal);
            console.log(this.value);
        }

        @Watch('sortState')
        onSortStateChanged(newSortedState: any) {
            this.schemaSummariesToSelect = newSortedState.sortedEntities
                .filter(e => (this.baseSchemas.indexOf(e.key) === -1 ? true : false) && e.key !== this.parentKey);
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

        setSortBy(field: string) {
            this.setSort({field, ascending: true});
        }

        add(item) {
            this.baseSchemas.push(item.key);
            this.onSortStateChanged(this.sortState);
            this.$emit('input', this.baseSchemas);
            console.log(this.baseSchemas);
        }

        remove(key) {
            this.baseSchemas = this.baseSchemas.filter(k => k !== key);
            this.onSortStateChanged(this.sortState);
            this.$emit('input', this.baseSchemas);
            console.log(this.baseSchemas);
        }

        down(index: number) {
            const a = this.baseSchemas[index];
            this.$set(this.baseSchemas, index, this.baseSchemas[index + 1]);
            this.$set(this.baseSchemas, index + 1, a);
            this.$emit('input', this.baseSchemas);
        }

        up(index: number) {
            const a = this.baseSchemas[index];
            this.$set(this.baseSchemas, index, this.baseSchemas[index - 1]);
            this.$set(this.baseSchemas, index - 1, a);
            this.$emit('input', this.baseSchemas);
        }
    }
</script>

<style lang="scss">


</style>
