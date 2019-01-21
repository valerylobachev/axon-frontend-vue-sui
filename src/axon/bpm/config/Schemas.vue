<template>
    <app-form>

        <h3 slot="header" class="header">{{ $t('axon.bpm.form.schemas.title') }}</h3>

        <template slot="toolbar">
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
        <div class="ui segment" v-if="!isEmpty">
            <schema-table :sortState="sortState" @toggleSort="toggleSchemaSort">
               <template slot-scope="slotProps">

                        <router-link class="ui tiny basic icon button" :to="`schema/create/${slotProps.schema.id}`">
                            <i class="copy outline green icon"></i>
                        </router-link>
                        <router-link class="ui tiny basic icon button" :to="`schema/edit/${slotProps.schema.id}`">
                            <i class="edit blue icon"></i>
                        </router-link>
                        <button class="ui tiny basic icon button"><i class="upload violet icon"></i>
                        </button>
                        <button class="ui tiny basic icon button"
                                @click="requestDelete(slotProps.schema.id, slotProps.schema.name)">
                            <i class="delete red icon"></i>
                        </button>

               </template>
            </schema-table>
        </div>
        <div class="ui placeholder segment" v-if="isEmpty">
            <div class="ui icon header">
                <i class="object group outline icon"></i>
                {{ $t('axon.bpm.form.schemas.notFound') }}
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
    </app-form>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter, Mutation} from 'vuex-class';
    import _ from 'lodash';
    import {SchemaSummary} from '@/axon/bpm/shared/schema/schema.model';
    import AppForm from '@/annette/layout/AppForm.vue';
    import ProcessDefList from '@/axon/bpm/config/ProcessDefList.vue';
    import SchemaTable from '@/axon/bpm/config/SchemaTable.vue';

    const namespace = 'bpmSchema';

    @Component({
        components: {
            AppForm,
            ProcessDefList,
            SchemaTable,
        },
    })
    export default class Schemas extends Vue {

        filter: string = '';
        modalContext = {
            open: false,
            id: '',
            name: '',
        };

        @Action('FindSchemas', {namespace}) find: any;
        @Mutation('ToggleSchemaSort', {namespace}) toggleSchemaSort: any;
        @Mutation('ClearFailure', {namespace}) clearFailure: any;
        @Getter('filter', {namespace}) filterState;
        @Getter('sortState', {namespace}) sortState;
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
            this.find(this.filterState);
        }

        get isEmpty() {
            if (this.sortState && this.sortState.sortedEntities) {
                return this.sortState.sortedEntities.length === 0;
            } else {
                return true;
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
</style>
