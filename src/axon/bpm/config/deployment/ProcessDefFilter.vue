<template>
    <div class="ui form form-row">
        <div class="form-input">
            <div class="fields">
                <div class="eight wide field">
                    <label>{{ $t('axon.bpm.md.processDef.key') }}</label>
                    <div class="ui fluid icon input">
                        <input type="text" v-model="localFilter.key">
                        <i class=" close link icon" @click="localFilter.key = ''"></i>
                    </div>
                </div>
                <div class="eight wide field">
                    <label>{{ $t('axon.bpm.md.processDef.name') }}</label>
                    <div class="ui fluid icon input">
                        <input type="text" v-model="localFilter.name">
                        <i class=" close link icon" @click="localFilter.name = ''"></i>
                    </div>
                </div>
            </div>
            <div class="ui toggle checkbox">
                <input type="checkbox" v-model="localFilter.latest">
                <label>{{ $t('axon.bpm.form.processDefList.latest') }}</label>
            </div>
        </div>
        <div class="form-buttons">
            <button class="ui fluid primary button" @click="find()">
                {{ $t('axon.shared.find') }}
            </button>
            <button class="ui fluid basic button" @click="clearFilter()">
                {{ $t('axon.shared.clear') }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {emptyProcessDefFilter, FindProcessDefOptions} from '@/axon/bpm/shared/deployment/model';

    @Component({
        components: {},
    })
    export default class ProcessDefFilter extends Vue {

        @Prop(Object) filter: FindProcessDefOptions;
        localFilter: FindProcessDefOptions = emptyProcessDefFilter();

        @Watch('filter', {immediate: true, deep: true})
        onFilterChanged(newVal: FindProcessDefOptions) {
            this.localFilter = newVal;
        }

        find() {
            this.$emit('filter', this.localFilter);
        }

        clearFilter() {
            this.$emit('filter', emptyProcessDefFilter());
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
