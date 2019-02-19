<template>
    <sui-modal v-model="open" size="tiny">
        <sui-modal-header v-if="caption && typeof caption === 'string'">{{ $t(caption)}}</sui-modal-header>
        <sui-modal-header v-else-if="caption && typeof caption === 'object'">{{$t(caption.code, caption)}}</sui-modal-header>
        <sui-modal-header v-else>{{ $t('axon.shared.delete')}}</sui-modal-header>
        <sui-modal-content image>
            <p v-if="message && typeof message === 'string'">{{ $t(message)}}</p>
            <p v-else-if="message && typeof message === 'object'">{{ $t(message.code, message)}}</p>
        </sui-modal-content>
        <sui-modal-actions>
            <button class="ui basic button" @click="cancel">{{ $t('axon.shared.cancel')}}
            </button>
            <button class="ui red button" @click="deleteEntity">{{ $t('axon.shared.delete')}}</button>
        </sui-modal-actions>
    </sui-modal>


</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class DeleteEntityModal extends Vue {
        caption: string | object = 'axon.shared.delete';
        message: string | object = '';

        open = false;
        resolve = null;
        reject = null;


        public show(caption: string | object, message: string | object) {
            this.caption = caption;
            this.message = message;
            this.open = true;
            return new Promise<any>((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;

            });
        }

        deleteEntity() {
            this.open = false;
            this.resolve(true);
        }

        cancel() {
            this.open = false;
            this.reject(false);
        }


    }
</script>

<style lang="scss">
</style>
