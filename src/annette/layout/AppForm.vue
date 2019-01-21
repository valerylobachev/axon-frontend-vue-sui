<template>
    <div class="ui equal width left aligned padded grid stackable">
        <div class="row">
            <div class="sixteen wide column">
                <div class="ui segments" style="background-color: white">
                    <div class="ui segment">
                        <slot name="header"></slot>
                    </div>

                    <div class="ui segment">
                        <div class="ui stackable grid">
                            <div class="row">
                                <slot name="toolbar"></slot>
                            </div>
                        </div>
                    </div>

                    <slot></slot>
                </div>
            </div>
        </div>
    </div>


</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
    })
    export default class AppForm extends Vue {
    }
</script>

<style lang="scss">
</style>
