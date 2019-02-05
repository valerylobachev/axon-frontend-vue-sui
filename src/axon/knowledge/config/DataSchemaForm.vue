<template>
    <app-form>
        <template slot="header">
            <h3 v-if="action == 'create'">
                {{ $t('axon.knowledge.form.dataSchemaForm.createTitle') }}
                <span v-if="dataSchema.key">{{dataSchema.key}}</span>
                <span v-if="dataSchema.name"> - {{dataSchema.name}}</span>
            </h3>
            <h3 v-else-if="action == 'view'">
                {{ $t('axon.knowledge.form.dataSchemaForm.viewTitle') }}
                <span v-if="dataSchema.key">{{dataSchema.key}}</span>
                <span v-if="dataSchema.name"> - {{dataSchema.name}}</span>
            </h3>
            <h3 v-else-if="action == 'edit'">
                {{ $t('axon.knowledge.form.dataSchemaForm.editTitle') }}
                <span v-if="dataSchema.key">{{dataSchema.key}}</span>
                <span v-if="dataSchema.name"> - {{dataSchema.name}}</span>
            </h3>
        </template>

        <template slot="toolbar">
            <div class="ten wide computer column eight wide tablet column">
                <div class="ui green basic label" v-if="isDirty && action !== 'view'">
                    {{ $t('axon.shared.changed') }}
                </div>
                <div class="ui green basic label" v-if="saved && !isDirty && action !== 'view' && !loading">
                    {{ $t('axon.shared.saved') }}
                </div>
                <div class="ui red label"
                     v-if="(!dataSchema.name || dataSchema.name.trim().length == 0) && action !== 'view' && !loading">
                    {{ $t('axon.knowledge.form.dataSchemaForm.nameRequired') }}
                </div>
                <div class="ui red label"
                     v-if="!dataSchema.key || dataSchema.key.trim().length == 0 && action !== 'view' && !loading">
                    {{ $t('axon.knowledge.form.dataSchemaForm.keyRequired') }}
                </div>
            </div>
            <div class="six wide computer column eight wide tablet column">
                <div class="ui right floated header">
                    <router-link class="ui basic button"
                                 to="../../schemas"
                                 :class="{ disabled: isDirty }">
                        {{ $t('axon.knowledge.form.dataSchemaList.title') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'view'"
                                 :to="`../../schema/edit/${key}`">
                        {{ $t('axon.shared.edit') }}
                    </router-link>
                    <router-link class="ui basic button"
                                 v-if="action == 'edit'"
                                 :to="`../../schema/view/${key}`"
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
                    <sui-tab-pane :title="$t('axon.knowledge.form.dataSchemaForm.infoTab')">

                        <div class="field">
                            <label>{{ $t('axon.knowledge.md.dataSchema.key') }}</label>
                            <input type="text" name="key"
                                   v-model="dataSchema.key"
                                   :readOnly="action !== 'create' ">
                            <div class="ui error message"
                                 v-if="!(this.dataSchema.key && this.dataSchema.key.length > 0)">
                                {{ $t('axon.knowledge.form.dataSchemaForm.keyRequired') }}
                            </div>
                        </div>

                        <div class="field">
                            <!--[class.error]="!nameControl.valid && nameControl.touched"-->
                            <label>{{ $t('axon.knowledge.md.dataSchema.name') }}</label>
                            <input type="text" name="name"
                                   v-model="dataSchema.name"
                                   :readOnly="action == 'view'">
                            <div class="ui error message"
                                 v-if="!(this.dataSchema.name && this.dataSchema.name.length > 0)">
                                {{ $t('axon.knowledge.form.dataSchemaForm.nameRequired') }}
                            </div>
                        </div>

                        <div class="field">
                            <label>{{ $t('axon.knowledge.md.dataSchema.description') }}</label>
                            <textarea name="description"
                                      v-model="dataSchema.description"
                                      :readOnly="action == 'view'"></textarea>
                        </div>
                    </sui-tab-pane>
                    <sui-tab-pane :title="$t('axon.knowledge.form.dataSchemaForm.baseSchemasTab')">
                        <base-schemas-edit v-model="dataSchema.baseSchemas"
                                           :readonly="action == 'view'"
                                           :parentKey="dataSchema.key"></base-schemas-edit>
                    </sui-tab-pane>

                    <sui-tab-pane :title="$t('axon.knowledge.form.dataSchemaForm.fieldsTab')">
                        <schema-fields-edit v-model="dataSchema.fields"
                                           :readonly="action == 'view'"></schema-fields-edit>

                    </sui-tab-pane>
                </sui-tab>
            </form>
        </div>

    </app-form>

</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import AppForm from '@/annette/layout/AppForm.vue';
    import {DataSchema, NEW_DATA_SCHEMA} from '@/axon/knowledge/shared/data-schema/model';
    import {KNOWLEDGE_DATA_SCHEMA_NAMESPACE} from '@/axon/knowledge/shared/data-schema/store';
    import BaseSchemasEdit from '@/axon/knowledge/config/BaseSchemasEdit.vue';
    import SchemaFieldsEdit from '@/axon/knowledge/config/SchemaFieldsEdit.vue';

    const namespace: string = KNOWLEDGE_DATA_SCHEMA_NAMESPACE;

    @Component({
        components: {
            AppForm,
            BaseSchemasEdit,
            SchemaFieldsEdit,
        },
    })
    export default class DataSchemaForm extends Vue {
        dataSchema: DataSchema = NEW_DATA_SCHEMA;

        action = 'view';
        key = '';

        @Getter('loading', {namespace}) loading;
        @Getter('failure', {namespace}) failure;
        @Getter('entity', {namespace}) entity;
        @Getter('saved', {namespace}) saved;
        @Action('Init', {namespace}) initDataSchema: any;
        @Action('Create', {namespace}) createDataSchema: any;
        @Action('Update', {namespace}) updateDataSchema: any;

        @Watch('entity')
        onEntityChange(val: DataSchema, oldVal: DataSchema) {
            this.dataSchema = {...val};
        }

        @Watch('$route', {immediate: true, deep: true})
        onRouteChange(to, from) {
            this.action = to.params.action;
            this.key = to.params.key;
            this.initDataSchema({mode: this.action, key: this.key});
        }

        save() {
            if (this.action === 'create') {
                this.createDataSchema(this.dataSchema);
            } else if (this.action === 'edit') {
                this.updateDataSchema(this.dataSchema);
            }
        }

        get isDirty() {
            if (this.entity && this.dataSchema) {
                return this.dataSchema.name !== this.entity.name ||
                    this.dataSchema.description !== this.entity.description ||
                    this.dataSchema.key !== this.entity.key;
            } else {
                return false;
            }
        }

        get isValid() {
            return this.dataSchema.name && this.dataSchema.name.length > 0 &&
                this.dataSchema.key && this.dataSchema.key.length > 0;
        }
    }
</script>

<style lang="scss">

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
