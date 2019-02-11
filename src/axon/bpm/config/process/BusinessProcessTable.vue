<template>
    <table class="ui selectable fixed single line striped table">
        <thead>
        <tr>
            <th @click="toggleSort('name')">
                {{ $t('axon.bpm.md.businessProcess.name') }}
                <i class="sort up icon" v-if="isSortAscending('name')"></i>
                <i class="sort down icon" v-if="isSortDescending('name')"></i>
            </th>
            <th @click="toggleSort('description')">
                {{ $t('axon.bpm.md.businessProcess.description') }}
                <i class="sort up icon" v-if="isSortAscending('description') "></i>
                <i class="sort down icon" v-if="isSortDescending('description')"></i>
            </th>
            <th @click="toggleSort('processReference')">
                {{ $t('axon.bpm.md.businessProcess.processReference') }}
                <i class="sort up icon" v-if="isSortAscending('processReference')"></i>
                <i class="sort down icon" v-if="isSortDescending('processReference')"></i>
            </th>
            <th @click="toggleSort('dataSchemaKey')">
                {{ $t('axon.bpm.md.businessProcess.dataSchemaKey') }}
                <i class="sort up icon" v-if="isSortAscending('dataSchemaKey')"></i>
                <i class="sort down icon" v-if="isSortDescending('dataSchemaKey')"></i>
            </th>
            <th style="width: 12em;">{{ $t('axon.bpm.form.businessProcessList.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="businessProcess in sortState.sortedEntities">
            <td>
                <router-link :to="`business-process/view/${businessProcess.id}`">{{ businessProcess.name }}
                </router-link>
            </td>
            <td>{{ businessProcess.description }}</td>
            <td>
                <div v-if="!businessProcess.processReferenceDetail">
                    <div class="ui red image label">
                        ???
                        <div class="detail"> ???</div>
                    </div>
                </div>
                <div v-if="businessProcess.processReferenceDetail">
                    <router-link class="ui blue image label"
                       :to="{name: 'processDefs', query: {key: businessProcess.processReferenceDetail.key}}">
                        {{ businessProcess.processReferenceDetail.key }}
                        <div class="detail"> {{ businessProcess.processReferenceDetail.version }}</div>
                    </router-link>
                    <div>{{ businessProcess.processReferenceDetail.name }}</div>
                </div>
            </td>
            <td>
                <div v-if="!businessProcess.dataSchemaDetail">
                    <div class="ui red label">
                        ???
                    </div>
                </div>
                <div v-if="businessProcess.dataSchemaDetail">
                    <router-link class="ui teal label"
                       :to="`/knowledge-config/schema/view/${businessProcess.dataSchemaDetail.key}`">
                        {{ businessProcess.dataSchemaDetail.key }}
                    </router-link>
                    <div>{{ businessProcess.dataSchemaDetail.name }}</div>
                </div>
            </td>
            <td>
                <slot v-bind:businessProcess="businessProcess"></slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class BusinessProcessTable extends Vue {

        @Prop(Object) sortState;

        toggleSort(field: string) {
            this.$emit('toggleSort', field);
        }

        isSortAscending(field: string) {
            return this.sortState.sortField === field && this.sortState.sortAscending;
        }

        isSortDescending(field: string) {
            return this.sortState.sortField === field && !this.sortState.sortAscending;
        }

    }
</script>

<style lang="scss">
    .ui.table thead th {
        cursor: pointer;
    }
</style>
