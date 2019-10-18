<template>
    <Modal
        v-model="modal.show"
        :title="modal.title ? modal.title : null"
        :width="1000"
    >
        <slot name="content"></slot>
        <slot name="footer"></slot>
    </Modal>
</template>

<script>
    export default {
        name: "IviewModal",
        props: ['modal'],
        methods: {
            emitEvent(eventName, params){
                this.$emit(eventName, params);
            }
        }
    }
</script>

<style scoped>

</style>
