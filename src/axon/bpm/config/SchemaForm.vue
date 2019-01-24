<template>
    <app-form>
        <template slot="header">
            <h3 v-if="action == 'create'">{{ $t('axon.bpm.form.schemaForm.createTitle') }}</h3>
            <h3 v-else-if="action == 'view'">{{ $t('axon.bpm.form.schemaForm.viewTitle') }}</h3>
            <h3 v-else-if="action == 'edit'">{{ $t('axon.bpm.form.schemaForm.editTitle') }}</h3>
        </template>

        <template slot="toolbar">
            <div class="ten wide computer column eight wide tablet column">
                <div class="ui green basic label" v-if="isDirty && action !== 'view'">
                    {{ $t('axon.shared.changed') }}
                </div>
                <div class="ui green basic label" v-if="saved && !isDirty && action !== 'view'">
                    {{ $t('axon.shared.saved') }}
                </div>
                <div class="ui red label"
                     v-if="schema.name.trim().length == 0 && action !== 'view'">
                    {{ $t('axon.bpm.form.schemaForm.nameRequired') }}
                </div>
                <div class="ui red label" v-if="schema.xml.trim().length == 0 && action !== 'view'">
                    {{ $t('axon.bpm.form.schemaForm.xmlRequired') }}
                </div>
            </div>
            <div class="six wide computer column eight wide tablet column">
                <div class="ui right floated header">
                    <router-link class="ui basic button"
                                 to="../../schemas"
                                 :class="{ disabled: isDirty }">
                        {{ $t('axon.bpm.form.schemas.title') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'view'"
                                 :to="`../../schema/edit/${id}`">
                        {{ $t('axon.shared.edit') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'edit'"
                                 :to="`../../schema/view/${id}`"
                                 :class="{ disabled: isDirty }">
                        {{ $t('axon.shared.view') }}
                    </router-link>
                    <button class="ui primary button"
                            v-if="action != 'view'"
                            :disabled="!isValid"
                            @click="save()">
                        {{ $t('axon.shared.save') }}
                    </button>
                </div>
            </div>
        </template>

        <div class="ui segment" style="padding: 0px;" :class="{ loading: loading }">
            <div class="ui negative message"
                 style="margin-left: 14px; margin-right: 14px; margin-top: 14px;"
                 v-if="failure">
                <p>{{ $t(failure.code, failure) }}</p>
            </div>
            <form class="ui form">
                <!--:class="{ error: !formGroup.valid && formGroup.touched }"-->

                <sui-tab style="height: 100%" :menu="{ pointing: true, secondary: true }">
                    <!--:menu="{ pointing: true, secondary: true }"-->
                    <sui-tab-pane :title="$t('axon.bpm.form.schemaForm.infoTab')">

                        <div class="field">
                            <!--[class.error]="!nameControl.valid && nameControl.touched"-->
                            <label>{{ $t('axon.bpm.md.schema.name') }}</label>
                            <input type="text" name="name"
                                   v-model="schema.name"
                                   :readOnly="action == 'view'">
                            <div class="ui error message"
                                 v-if="!(this.schema.name && this.schema.name.length > 0)">
                                {{ $t('axon.bpm.form.schemaForm.nameRequired') }}
                            </div>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.schema.description') }}</label>
                            <textarea name="description"
                                      v-model="schema.description"
                                      :readOnly="action == 'view'"></textarea>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.schema.notation') }}</label>
                            <div class="ui blue label">{{ schema.notation }}</div>
                        </div>
                        <div class="field" v-if="schema.notation === 'BPMN'">
                            <label>{{ $t('axon.bpm.md.schema.processDefinitions') }}</label>
                            <process-def-list :value="schema.processDefinitions"></process-def-list>
                        </div>
                    </sui-tab-pane>
                    <sui-tab-pane :title="$t('axon.bpm.form.schemaForm.designerTab')">
                        <div class="reset-padding">
                            <bpmn-edit v-if="schema.notation === 'BPMN' && action === 'edit'"
                                       v-model="schema.xml"
                                       @processDefinitions="schema.processDefinitions = $event"></bpmn-edit>
                            <bpmn-view v-if="schema.notation === 'BPMN' && action === 'view'"
                                       v-model="schema.xml"></bpmn-view>
                            <dmn-view v-if="schema.notation === 'DMN' && action === 'view'"
                                      v-model="schema.xml"></dmn-view>
                            <cmmn-view v-if="schema.notation === 'CMMN' && action === 'view'"
                                       v-model="schema.xml"></cmmn-view>
                        </div>
                    </sui-tab-pane>

                    <sui-tab-pane :title="$t('axon.bpm.form.schemaForm.xmlTab')">
                        <div class="field">
                            <!--:class=" {error: !xmlControl.valid && xmlControl.touched} "-->
                            <textarea class="xml-edit" name="xml" :placeholder="$t('axon.bpm.md.schema.xml')"
                                      v-model="schema.xml"
                                      :readOnly="action == 'view'"></textarea>
                            <div class="ui error message"
                                 v-if="!(this.schema.description && this.schema.description.length > 0)">
                                {{ $t('axon.bpm.form.schemaForm.xmlRequired') }}
                            </div>
                        </div>
                    </sui-tab-pane>
                </sui-tab>
            </form>
        </div>

    </app-form>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ProcessDefList from '@/axon/bpm/config/ProcessDefList.vue';
    import {NEW_BPMN_SCHEMA, Schema} from '@/axon/bpm/shared/schema/schema.model';
    import {Action, Getter} from 'vuex-class';
    import BpmnEdit from '@/axon/bpm/config/bpmn/BpmnEdit.vue';
    import AppForm from '@/annette/layout/AppForm.vue';
    import BpmnView from '@/axon/bpm/config/bpmn/BpmnView.vue';
    import DmnView from '@/axon/bpm/config/bpmn/DmnView.vue';
    import CmmnView from '@/axon/bpm/config/bpmn/CmmnView.vue';

    const namespace = 'bpmSchema';

    @Component({
        components: {
            AppForm,
            ProcessDefList,
            BpmnEdit,
            BpmnView,
            CmmnView,
            DmnView,
        },
    })
    export default class SchemaForm extends Vue {
        schema: Schema = NEW_BPMN_SCHEMA;

        action = 'view';
        id = '';

        @Getter('loading', {namespace}) loading;
        @Getter('failure', {namespace}) failure;
        @Getter('entity', {namespace}) entity;
        @Getter('saved', {namespace}) saved;
        @Action('InitSchema', {namespace}) initSchema: any;
        @Action('CreateSchema', {namespace}) createSchema: any;
        @Action('UpdateSchema', {namespace}) updateSchema: any;


        @Watch('entity')
        onEntityChange(val: Schema, oldVal: Schema) {
            this.schema = {...val};
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            const actKey = 'action';
            const idKey = 'id';
            this.action = to.params[actKey];
            this.id = to.params[idKey];
            this.initSchema({mode: this.action, id: this.id});

        }

        save() {
            if (this.action === 'create') {
                this.createSchema(this.schema);
            } else if (this.action === 'edit') {
                this.updateSchema(this.schema);
            }
        }

        get isDirty() {
            if (this.entity && this.schema) {
                return this.schema.name !== this.entity.name ||
                    this.schema.description !== this.entity.description ||
                    this.schema.xml !== this.entity.xml;
            } else {
                return false;
            }
        }

        get isValid() {
            return this.schema.name && this.schema.name.length > 0 &&
                this.schema.xml && this.schema.xml.length > 0;
        }
    }
</script>

<style lang="scss">

    bpmn-edit {
        height: 85vh;
        height: calc(100vh - 40px - 14px - 64px - 14px);
        width: 100%;
    }

    .ui.form .field .xml-edit {
        height: 85vh;
    }

    .ui.secondary.pointing.menu {
        margin-bottom: 0px;
    }

    .ui.tab.segment.attached {
        border-top: 0px;

    }

    .reset-padding {
        margin: -14px;
    }
</style>
