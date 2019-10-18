<template>
    <div>
        <draggable
            tag="ul" :list="list"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
            class="addOptionsDrag"
        >
            <li v-for="(item, index) in list" :key="index" class="addOptionsItem">
                <Icon type="md-menu" class="drag-item" size="24" />
                <Input v-model="item.n" style="width: 150px" />
                <Button size="small" icon="md-remove" type="primary" shape="circle" @click="handleDelOption(index)"></Button>
            </li>
        </draggable>
        <div style="margin-top: 10px;">
            <Button type="primary" @click="handleAddOption">添加选项</Button>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: "DragAddOption",
        props: ['selectItem'],
        components: {
            draggable
        },
        computed: {
            list: function(){
                let selectItem = this.selectItem;
                let list = [];
                if(selectItem.options.type === 'a-tab') {
                    list = selectItem.options.child;
                } else {
                    list = selectItem.options.value.values;
                }
                return list;
            }
        },
        methods: {
            //添加标签名、多选等选项
            handleAddOption(){
                let {options} = this.selectItem;
                let type = options.type;
                switch (type) {
                    case 'a-tab':
                        options.child.push({v: options.child.length + '', n: "标签" + (options.child.length + 1), list: []});
                        break;
                    default:
                        options.value.values.push({v: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999), n: ''});
                }
            },
            //删除标签名、多选等选项
            handleDelOption(index){
                let options = this.selectItem.options;
                if(options && options.list instanceof Array) {
                    options.list.splice(index, 1);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .addOptionsDrag {
        .addOptionsItem {
            margin-top: 10px;
            &:last-child {
                margin-bottom: 10px;
            }
        }
    }
</style>
