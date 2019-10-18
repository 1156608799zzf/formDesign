<template>
    <div class="virtualFormPage">
        <div v-if="data.list.length == 0" class="form-empty">从左侧拖拽来添加字段</div>
        <Form class="form" :label-width="120">
            <draggable
                class="virtualForm"
                :list="data.list"
                v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.itemMove'}"
                @change='change'
                >
                <template v-for="item in data.list">
                    <VirtualFormItem :item="item" :select="select" :list="data.list"></VirtualFormItem>
                </template>
            </draggable>
        </Form>

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import VirtualFormItem from '../components/VirtualFormItem'
    export default {
        name: "VirtualForm",
        props: ['data', 'select'],
        components: {
            draggable,
            VirtualFormItem,
        },
        data(){
            return {
            }
        },
        watch: {
        },
        mounted(){
        },
        methods: {
            change(evt){
                this.$bus.$emit('dragChange', {
                    evt,
                    list: this.data.list
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .virtualFormPage {
        position: relative;
        width: 100%;
        height: 100%;
        .form, .virtualForm {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .form-empty{
            position: absolute;
            text-align: center;
            width: 300px;
            font-size: 20px;
            top: 200px;
            left: 50%;
            margin-left: -150px;
            color: #ccc;
        }
    }
</style>
