<template>
    <div class="ui equal width left aligned padded grid stackable">
        <div class="row">
            <div class="sixteen wide column">
                <div class="ui segments">
                    <div class="ui segment">
                        <h3 class="header">{{ $t('axon.bpm.form.schemas.title') }}</h3>
                    </div>
                    <div class="ui segment">
                        <div class="ui stackable grid">
                            <div class="row">
                                <div class="ten wide column">
                                    <div class="ui icon action input" style="width: 100%;">
                                        <input type="text" :placeholder="$t('axon.bpm.form.schemas.filter')"
                                               v-model="filter"
                                               @input="setFilter($event.target.value)">
                                        <i class=" close link icon"
                                           style="right: 2.6em; width: 2em;"
                                           @click="clearFilter()"></i>
                                        <button class="ui icon button" @click="$event.stopPropagation(); refresh()">
                                            <i class="search icon"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="right floated three wide column">
                                    <div class="ui right floated primary buttons">
                                        <router-link class="ui primary button" to="schema/create/BPMN">
                                            {{ $t('axon.bpm.form.schemas.createBPMN')}}
                                        </router-link>
                                        <sui-dropdown class="ui floating dropdown icon button">
                                            <sui-dropdown-menu>
                                                <router-link class="item" to="schema/create/DMN">
                                                    {{ $t('axon.bpm.form.schemas.createDMN')}}
                                                </router-link>
                                                <router-link class="item" to="schema/create/CMMN">
                                                    {{ $t('axon.bpm.form.schemas.createCMMN')}}
                                                </router-link>
                                            </sui-dropdown-menu>
                                        </sui-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ui segment" v-if="failure">

                        <div class="ui negative message" >
                            <i class="close icon" @click="clearFailure"></i>
                            <div class="header">
                                {{ $t('axon.shared.error') }}
                            </div>
                            <p> {{ $t(failure.code, failure) }}</p>
                        </div>
                    </div>
                    <div class="ui segment" v-if="!isEmpty">
                        <table class="ui selectable fixed single line striped table">
                            <thead>
                            <tr>
                                <th @click="toggleSort('name')">
                                    {{ $t('axon.bpm.md.schema.name') }}
                                    <i class="sort up icon" v-if="isSortAscending('name')"></i>
                                    <i class="sort down icon" v-if="isSortDescending('name')"></i>
                                </th>
                                <th @click="toggleSort('description')">
                                    {{ $t('axon.bpm.md.schema.description') }}
                                    <i class="sort up icon" v-if="isSortAscending('description') "></i>
                                    <i class="sort down icon" v-if="isSortDescending('description')"></i>
                                </th>
                                <th @click="toggleSort('notation')">
                                    {{ $t('axon.bpm.md.schema.notation') }}
                                    <i class="sort up icon" v-if="isSortAscending('notation')"></i>
                                    <i class="sort down icon" v-if="isSortDescending('notation')"></i>
                                </th>
                                <th @click="toggleSort('processDefinitions')">
                                    {{ $t('axon.bpm.md.schema.processDefinitions') }}
                                    <i class="sort up icon" v-if="isSortAscending('processDefinitions')"></i>
                                    <i class="sort down icon" v-if="isSortDescending('processDefinitions')"></i>
                                </th>
                                <th>{{ $t('axon.bpm.form.schemas.actions') }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="schema in state.sortedEntities">
                                <td>
                                    <router-link :to="`schema/view/${schema.id}`">{{ schema.name }}</router-link>
                                </td>
                                <td>{{ schema.description }}</td>
                                <td>
                                    <div class="ui basic label">{{ schema.notation }}</div>
                                </td>
                                <td>
                                    <div class="ui small labels" v-if="schema.notation === 'BPMN'">
                                        <router-link class="ui label"
                                                     v-for="pd in processDefinitionsList(schema)"
                                                     to="TBD"
                                                     :key="pd">
                                            {{ pd }}
                                        </router-link>
                                    </div>
                                </td>
                                <td>

                                    <router-link class="ui tiny basic icon button" :to="`schema/create/${schema.id}`">
                                        <i class="copy outline green icon"></i>
                                    </router-link>
                                    <router-link class="ui tiny basic icon button" :to="`schema/update/${schema.id}`">
                                        <i class="edit blue icon"></i>
                                    </router-link>
                                    <button class="ui tiny basic icon button"><i class="upload violet icon"></i>
                                    </button>
                                    <button class="ui tiny basic icon button"
                                            @click="requestDelete(schema.id, schema.name)">
                                        <i class="delete red icon"></i>
                                    </button>

                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="ui placeholder segment" v-if="isEmpty">
                        <div class="ui icon header">
                            <i class="object group outline icon"></i>
                            {{ $t('axon.bpm.form.schemas.notFound') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <sui-modal v-model="modalContext.open" size="tiny">
            <sui-modal-header>{{ $t('axon.shared.delete')}}</sui-modal-header>
            <sui-modal-content image>
                <p>{{ $t('axon.bpm.md.schema.delete', {name: modalContext.name})}}?</p>
            </sui-modal-content>
            <sui-modal-actions>
                <button class="ui basic button" @click="modalContext.open = false">{{ $t('axon.shared.cancel')}}
                </button>
                <button class="ui red button" @click="performDelete" autofocus>{{
                    $t('axon.shared.delete')}}
                </button>
            </sui-modal-actions>
        </sui-modal>
    </div>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation, State} from 'vuex-class';
    import {SchemaState} from '@/axon/bpm/shared/schema/types';
    import _ from 'lodash';
    import {SchemaSummary} from '@/axon/bpm/shared/schema/schema.model';

    const namespace = 'bpmSchema';

    @Component({})
    export default class Schemas extends Vue {

        filter: string = '';
        modalContext = {
            open: false,
            id: '',
            name: '',
        };

        @State('bpmSchema') state: SchemaState;
        @Action('FindSchemas', {namespace}) find: any;
        @Mutation('ToggleSchemaSort', {namespace}) toggleSchemaSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('failure', {namespace}) failure;

        @Action('DeleteSchema', {namespace}) deleteSchema: any;

        lazyFind = _.debounce(f => {
                this.find(f);
            },
            500);

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
            this.find(this.state.filter);
        }

        get isEmpty() {
            if (this.state && this.state.sortedEntities) {
                return this.state.sortedEntities.length === 0;
            } else {
                return true;
            }
        }

        toggleSort(field: string) {
            console.log(`toggleSort: ${field}`);
            this.toggleSchemaSort(field);
        }

        isSortAscending(field: string) {
            return this.state.sortField === field && this.state.sortAscending;
        }

        isSortDescending(field: string) {
            return this.state.sortField === field && !this.state.sortAscending;
        }

        processDefinitionsList(schema: SchemaSummary) {
            if (schema && schema.processDefinitions && schema.processDefinitions.length > 0) {
                return schema.processDefinitions.split(' ');
            } else {
                return [];
            }
        }

        requestDelete(id: string, name: string) {
            this.modalContext = {
                open: true,
                id,
                name,
            };
        }

        performDelete() {
            this.deleteSchema(this.modalContext.id);
            this.modalContext = {
                open: false,
                id: null,
                name: null,
            };
        }
    }
</script>

<style lang="scss">
    .ui.table thead th {
        cursor: pointer;
    }
</style>
