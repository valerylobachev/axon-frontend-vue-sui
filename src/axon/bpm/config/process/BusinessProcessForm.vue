<template>
    <app-form>
        <template slot="header">
            <h3 v-if="action == 'create'">{{ $t('axon.bpm.form.businessProcessForm.createTitle') }}</h3>
            <h3 v-else-if="action == 'view'">{{ $t('axon.bpm.form.businessProcessForm.viewTitle') }}</h3>
            <h3 v-else-if="action == 'edit'">{{ $t('axon.bpm.form.businessProcessForm.editTitle') }}</h3>
        </template>

        <template slot="toolbar">
            <div class="ten wide computer column eight wide tablet column">
                <div class="ui green basic label" v-if="isDirty && action !== 'view' && !loading">
                    {{ $t('axon.shared.changed') }}
                </div>
                <div class="ui green basic label" v-if="saved && !isDirty && action !== 'view' && !loading">
                    {{ $t('axon.shared.saved') }}
                </div>
                <div class="ui red label"
                     v-if="(!businessProcess.key || businessProcess.key.trim().length == 0) && action !== 'view' && !loading">
                    {{ $t('axon.bpm.form.businessProcessForm.keyRequired') }}
                </div>
                <div class="ui red label"
                     v-if="(!businessProcess.name || businessProcess.name.trim().length == 0) && action !== 'view' && !loading">
                    {{ $t('axon.bpm.form.businessProcessForm.nameRequired') }}
                </div>
            </div>
            <div class="six wide computer column eight wide tablet column">
                <div class="ui right floated header">
                    <router-link class="ui basic button"
                                 to="../../business-processes"
                                 :class="{ disabled: isDirty }">
                        {{ $t('axon.bpm.form.businessProcessList.title') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'view'"
                                 :to="`../../business-process/edit/${id}`">
                        {{ $t('axon.shared.edit') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'edit'"
                                 :to="`../../business-process/view/${id}`"
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
            <div class="ui form">
                <!--:class="{ error: !formGroup.valid && formGroup.touched }"-->

                <sui-tab style="height: 100%" :menu="{ pointing: true, secondary: true }">
                    <!--:menu="{ pointing: true, secondary: true }"-->
                    <sui-tab-pane :title="$t('axon.bpm.form.businessProcessForm.infoTab')">
                        <div class="field">
                            <!--[class.error]="!nameControl.valid && nameControl.touched"-->
                            <label>{{ $t('axon.bpm.md.businessProcess.key') }}</label>
                            <input type="text" name="key"
                                   v-model="businessProcess.key"
                                   :readOnly="action !== 'create'">
                            <div class="ui error message"
                                 v-if="!(this.businessProcess.key && this.businessProcess.key.length > 0)">
                                {{ $t('axon.bpm.form.businessProcessForm.nameRequired') }}
                            </div>
                        </div>
                        <div class="field">
                            <!--[class.error]="!nameControl.valid && nameControl.touched"-->
                            <label>{{ $t('axon.bpm.md.businessProcess.name') }}</label>
                            <input type="text" name="name"
                                   v-model="businessProcess.name"
                                   :readOnly="action == 'view'">
                            <div class="ui error message"
                                 v-if="!(this.businessProcess.name && this.businessProcess.name.length > 0)">
                                {{ $t('axon.bpm.form.businessProcessForm.nameRequired') }}
                            </div>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.businessProcess.description') }}</label>
                            <textarea name="description"
                                      v-model="businessProcess.description"
                                      :readOnly="action == 'view'"></textarea>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.businessProcess.processReference') }}</label>
                            <process-reference-view
                                    key="processReferenceView"
                                    v-if="action === 'view'"
                                    :value="businessProcess.processReference"
                                    :detail="businessProcess.processReferenceDetail"></process-reference-view>
                            <process-reference-field
                                    name="processReferenceField"
                                    v-if="action !== 'view'"
                                    v-model="businessProcess.processReference"
                                    :detail="businessProcess.processReferenceDetail"
                                    @detailChanged="businessProcess.processReferenceDetail = $event">
                            </process-reference-field>
                        </div>
                        <div class="field">
                            <label>{{ $t('axon.bpm.md.businessProcess.dataSchemaKey') }}</label>
                            <data-schema-view
                                    key="dataSchemaView"
                                    v-if="action === 'view'"
                                    :value="businessProcess.dataSchemaKey"
                                    :detail="businessProcess.dataSchemaDetail"></data-schema-view>
                            <data-schema-field
                                    key="dataSchemaField"
                                    v-if="action !== 'view'"
                                    v-model="businessProcess.dataSchemaKey"
                                    :detail="businessProcess.dataSchemaDetail"
                                    @detailChanged="businessProcess.dataSchemaDetail = $event">
                            </data-schema-field>
                        </div>
                    </sui-tab-pane>
                    <sui-tab-pane :title="$t('axon.bpm.form.businessProcessForm.defaultsTab')">

                    </sui-tab-pane>


                </sui-tab>
            </div>
        </div>

    </app-form>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import {BusinessProcess, newBusinessProcess} from '@/axon/bpm/shared/process/model';
    import {BPM_BUSINESS_PROCESS_NAMESPACE} from '@/axon/bpm/shared/process/store';
    import DataSchemaField from '@/axon/knowledge/shared/components/DataSchemaField.vue';
    import ProcessReferenceField from '@/axon/bpm/shared/components/ProcessReferenceField.vue';
    import ProcessReferenceView from '@/axon/bpm/shared/components/ProcessReferenceView.vue';
    import DataSchemaView from '@/axon/knowledge/shared/components/DataSchemaView.vue';

    const namespace: string = BPM_BUSINESS_PROCESS_NAMESPACE;

    @Component({
        components: {
            ProcessReferenceField,
            ProcessReferenceView,
            DataSchemaField,
            DataSchemaView,
            AppForm,
        },
    })
    export default class BusinessProcessForm extends Vue {
        businessProcess: BusinessProcess = newBusinessProcess();

        action = 'view';
        id = '';

        @Getter('loading', {namespace}) loading;
        @Getter('failure', {namespace}) failure;
        @Getter('entity', {namespace}) entity;
        @Getter('saved', {namespace}) saved;
        @Action('Init', {namespace}) initBusinessProcess: any;
        @Action('Create', {namespace}) createBusinessProcess: any;
        @Action('Update', {namespace}) updateBusinessProcess: any;


        @Watch('entity')
        onEntityChange(val: BusinessProcess, oldVal: BusinessProcess) {
            this.businessProcess = {...val};
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            this.action = to.params.action;
            this.id = to.params.id;
            this.initBusinessProcess({mode: this.action, id: this.id});
        }

        save() {
            if (this.action === 'create') {
                this.createBusinessProcess(this.businessProcess);
            } else if (this.action === 'edit') {
                this.updateBusinessProcess(this.businessProcess);
            }
        }

        get isDirty() {
            if (this.entity && this.businessProcess) {
                return this.businessProcess.name !== this.entity.name ||
                    this.businessProcess.description !== this.entity.description;
            } else {
                return false;
            }
        }

        get isValid() {
            return this.businessProcess.name && this.businessProcess.name.length > 0;
        }
    }
</script>

<style lang="scss">

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
