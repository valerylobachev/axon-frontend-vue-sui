<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
            <tr>
                <th @click="toggleSort('key')">
                    {{ $t('axon.knowledge.md.dataSchema.key') }}
                    <i class="sort up icon" v-if="isSortAscending('key')"></i>
                    <i class="sort down icon" v-if="isSortDescending('key')"></i>
                </th>
                <th @click="toggleSort('name')">
                    {{ $t('axon.knowledge.md.dataSchema.name') }}
                    <i class="sort up icon" v-if="isSortAscending('name')"></i>
                    <i class="sort down icon" v-if="isSortDescending('name')"></i>
                </th>
                <th @click="toggleSort('description')">
                    {{ $t('axon.knowledge.md.dataSchema.description') }}
                    <i class="sort up icon" v-if="isSortAscending('description') "></i>
                    <i class="sort down icon" v-if="isSortDescending('description')"></i>
                </th>

                <th v-if="!selection" style="width: 9em;">{{ $t('axon.knowledge.form.dataSchemaList.actions') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr :class="{ selectable: selection }"
                v-for="dataSchema in sortState.sortedEntities"
                :key="dataSchema.key"
                @click.prevent="selectDataSchema(dataSchema)">
                <td>{{ dataSchema.key }}</td>
                <td>
                    <router-link :to="`/knowledge-config/schema/view/${dataSchema.key}`">{{ dataSchema.name }}</router-link>
                </td>
                <td>{{ dataSchema.description }}</td>

                <td v-if="!selection">
                    <slot v-bind:dataSchema="dataSchema"></slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class DataSchemaTable extends Vue {

    @Prop(Object) sortState;
    @Prop({ default: false }) selection;

    toggleSort(field: string) {
        this.$emit('toggleSort', field);
    }

    isSortAscending(field: string) {
        return this.sortState.sortField === field && this.sortState.sortAscending;
    }

    isSortDescending(field: string) {
        return this.sortState.sortField === field && !this.sortState.sortAscending;
    }

    selectDataSchema(dataSchema) {
        if (this.selection) {
            this.$emit('select', dataSchema)
        }
    }
}
</script>

<style lang="scss">
.ui.table thead th {
    cursor: pointer;
}

.selectable {
    cursor: pointer;
}
</style>
