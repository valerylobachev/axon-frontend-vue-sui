<template>
    <div class="ui icon action input" style="width: 100%;">
        <input type="text" :placeholder="placeholder ? placeholder : $t('axon.shared.filter')"
               :value="filter"
               @input="setFilter($event.target.value)">
        <i class=" close link icon"
           style="right: 2.6em; width: 2em;"
           @click="clearFilter()"></i>
        <button class="ui icon button" @click="refresh()">
            <i class="search icon"></i>
        </button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import _ from 'lodash';

    @Component({})
    export default class SimpleLazyFilter extends Vue {
        @Prop(String) placeholder: string;
        @Prop(String) filter: string;
        @Prop({default: 500}) debounce: number;

        lazyFind = _.debounce(f => {
            this.find(f);
        }, this.debounce);


        setFilter(filter: string) {
            if (this.debounce && this.debounce !== 0) {
                this.lazyFind(filter);
            } else {
                this.find(filter);
            }
        }

        clearFilter() {
            this.find('');
        }

        refresh() {
            this.find(this.filter);
        }

        find(filter: string) {
            this.$emit('filter', filter);

        }
    }
</script>

<style lang="scss">
</style>
