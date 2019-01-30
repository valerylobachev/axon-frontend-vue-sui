<template>
    <app-form>
        <template slot="header">
            <h3 v-if="action == 'create'">{{ $t('axon.bpm.form.bpmDiagramForm.createTitle') }}</h3>
            <h3 v-else-if="action == 'view'">{{ $t('axon.bpm.form.bpmDiagramForm.viewTitle') }}</h3>
            <h3 v-else-if="action == 'edit'">{{ $t('axon.bpm.form.bpmDiagramForm.editTitle') }}</h3>
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
                     v-if="(!bpmDiagram.name || bpmDiagram.name.trim().length == 0) && action !== 'view'">
                    {{ $t('axon.bpm.form.bpmDiagramForm.nameRequired') }}
                </div>
                <div class="ui red label" v-if="!bpmDiagram.xml || bpmDiagram.xml.trim().length == 0 && action !== 'view'">
                    {{ $t('axon.bpm.form.bpmDiagramForm.xmlRequired') }}
                </div>
            </div>
            <div class="six wide computer column eight wide tablet column">
                <div class="ui right floated header">
                    <router-link class="ui basic button"
                                 to="../../diagrams"
                                 :class="{ disabled: isDirty }">
                        {{ $t('axon.bpm.form.bpmDiagrams.title') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'view'"
                                 :to="`../../diagram/edit/${id}`">
                        {{ $t('axon.shared.edit') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'edit'"
                                 :to="`../../diagram/view/${id}`"
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
                    <sui-tab-pane :title="$t('axon.bpm.form.bpmDiagramForm.infoTab')">

                        <div class="field">
                            <!--[class.error]="!nameControl.valid && nameControl.touched"-->
                            <label>{{ $t('axon.bpm.md.bpmDiagram.name') }}</label>
                            <input type="text" name="name"
                                   v-model="bpmDiagram.name"
                                   :readOnly="action == 'view'">
                            <div class="ui error message"
                                 v-if="!(this.bpmDiagram.name && this.bpmDiagram.name.length > 0)">
                                {{ $t('axon.bpm.form.bpmDiagramForm.nameRequired') }}
                            </div>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.bpmDiagram.description') }}</label>
                            <textarea name="description"
                                      v-model="bpmDiagram.description"
                                      :readOnly="action == 'view'"></textarea>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.bpmDiagram.notation') }}</label>
                            <div class="ui blue label">{{ bpmDiagram.notation }}</div>
                        </div>
                        <div class="field" v-if="bpmDiagram.notation === 'BPMN'">
                            <label>{{ $t('axon.bpm.md.bpmDiagram.processDefinitions') }}</label>
                            <process-def-list :value="bpmDiagram.processDefinitions"></process-def-list>
                        </div>
                    </sui-tab-pane>
                    <sui-tab-pane :title="$t('axon.bpm.form.bpmDiagramForm.designerTab')">
                        <div class="reset-padding">
                            <bpmn-edit v-if="bpmDiagram.notation === 'BPMN' && (action === 'edit' || action === 'create')"
                                       v-model="bpmDiagram.xml"
                                       @processDefinitions="bpmDiagram.processDefinitions = $event"></bpmn-edit>
                            <bpmn-view v-if="bpmDiagram.notation === 'BPMN' "
                                       v-model="bpmDiagram.xml"></bpmn-view>
                            <dmn-view v-if="bpmDiagram.notation === 'DMN' "
                                      v-model="bpmDiagram.xml"></dmn-view>
                            <cmmn-view v-if="bpmDiagram.notation === 'CMMN' "
                                       v-model="bpmDiagram.xml"></cmmn-view>
                        </div>
                    </sui-tab-pane>

                    <sui-tab-pane :title="$t('axon.bpm.form.bpmDiagramForm.xmlTab')">
                        <div class="field">
                            <!--:class=" {error: !xmlControl.valid && xmlControl.touched} "-->
                            <textarea class="xml-edit" name="xml" :placeholder="$t('axon.bpm.md.bpmDiagram.xml')"
                                      v-model="bpmDiagram.xml"
                                      :readOnly="action == 'view'"></textarea>
                            <div class="ui error message"
                                 v-if="!(this.bpmDiagram.description && this.bpmDiagram.description.length > 0)">
                                {{ $t('axon.bpm.form.bpmDiagramForm.xmlRequired') }}
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
    import {NEW_BPMN_DIAGRAM, BpmDiagram} from '@/axon/bpm/shared/diagram/model';
    import {Action, Getter} from 'vuex-class';
    import BpmnEdit from '@/axon/bpm/config/bpmn/BpmnEdit.vue';
    import AppForm from '@/annette/layout/AppForm.vue';
    import BpmnView from '@/axon/bpm/config/bpmn/BpmnView.vue';
    import DmnView from '@/axon/bpm/config/bpmn/DmnView.vue';
    import CmmnView from '@/axon/bpm/config/bpmn/CmmnView.vue';

    const namespace = 'bpmDiagram';

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
    export default class BpmDiagramForm extends Vue {
        bpmDiagram: BpmDiagram = NEW_BPMN_DIAGRAM;

        action = 'view';
        id = '';

        @Getter('loading', {namespace}) loading;
        @Getter('failure', {namespace}) failure;
        @Getter('entity', {namespace}) entity;
        @Getter('saved', {namespace}) saved;
        @Action('Init', {namespace}) initBpmDiagram: any;
        @Action('Create', {namespace}) createBpmDiagram: any;
        @Action('Update', {namespace}) updateBpmDiagram: any;


        @Watch('entity')
        onEntityChange(val: BpmDiagram, oldVal: BpmDiagram) {
            this.bpmDiagram = {...val};
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            this.action = to.params.action;
            this.id = to.params.id;
            this.initBpmDiagram({mode: this.action, id: this.id});

        }

        save() {
            if (this.action === 'create') {
                this.createBpmDiagram(this.bpmDiagram);
            } else if (this.action === 'edit') {
                this.updateBpmDiagram(this.bpmDiagram);
            }
        }

        get isDirty() {
            if (this.entity && this.bpmDiagram) {
                return this.bpmDiagram.name !== this.entity.name ||
                    this.bpmDiagram.description !== this.entity.description ||
                    this.bpmDiagram.xml !== this.entity.xml;
            } else {
                return false;
            }
        }

        get isValid() {
            return this.bpmDiagram.name && this.bpmDiagram.name.length > 0 &&
                this.bpmDiagram.xml && this.bpmDiagram.xml.length > 0;
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
