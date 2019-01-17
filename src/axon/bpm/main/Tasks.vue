<template>
    <div class="ui equal width left aligned padded grid stackable">
        <div class="row">
            <div class="sixteen wide column">
                <div class="ui segments" style="background-color: white">
                    <div class="ui segment">
                        <h3>My Tasks</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class Tasks extends Vue {

    }
</script>

<style lang="scss">
</style>
