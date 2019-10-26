<template>
    <!--表单设计器子项-->
    <div class="virtualFormItem" v-if="item.options.id" :class="{active: isSelect ? select.options.id === item.options.id : false}" @click.stop="updateSelectItem">
        <!--tab标签页递归组件-->
        <template v-if="item.options.type === 'a-tab'">
            <Tabs :value="item.tabValue" class="tabComponent">
                <TabPane v-for="(tab, tabIndex) in item.options.child" :key="tabIndex" :label="tab.n" :name="tab.v">
                    <draggable
                        v-model="tab.list"
                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.itemMove'}"
                        class="dragComp"
                        @change="handleChange(arguments[0], tab.list)"
                    >
                        <VirtualFormItem v-for="(vItem, vIndex) in tab.list" :key="vIndex" :item="vItem" :select="select" :list="tab.list"></VirtualFormItem>
                    </draggable>
                </TabPane>
            </Tabs>
        </template>
        <!--栅格布局递归组件-->
        <template v-else-if="item.options.type === 'l-row-2' || item.options.type === 'l-row-3'">
            <Row>
                <Col v-for="(colItem, colIndex) in item.options.child" :key="colIndex" :span="colItem.col">
                    <draggable
                        v-model="colItem.list"
                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.itemMove'}"
                        class="dragComp grid"
                        @change="handleChange(arguments[0], colItem.list)"
                    >
                        <VirtualFormItem v-for="(vItem, vIndex) in colItem.list" :key="vIndex" :item="vItem" :select="select" :list="colItem.list"></VirtualFormItem>
                    </draggable>
                </Col>
            </Row>
        </template>
        <!--分割线-->
        <template v-else-if="item.options.type === 'a-interval'">
            <div class="dividerTitle">{{ item.options.label }}</div>
            <Divider />
        </template>
        <!--基础控件显示-->
        <template v-else>
            <FormItem :label="item.options.label">
                <!--单行文本-->
                <template v-if="item.options.type === 'text'">
                    <Input
                        v-model="item.options.value"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--多行文本-->
                <template v-if="item.options.type === 'textarea'">
                    <Input
                        v-model="item.options.value"
                        type="textarea"
                        :autosize="{minRows: 4}"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--单选按钮-->
                <template v-if="item.options.type === 'radio'">
                    <RadioGroup>
                        <Radio v-for="(opt, optIndex) in item.options.value.values" :key="optIndex" :label="opt.v">{{ opt.n }}</Radio>
                    </RadioGroup>
                </template>
                <!--复选框-->
                <template v-if="item.options.type === 'checkbox'">
                    <CheckboxGroup>
                        <Checkbox v-for="(opt, optIndex) in item.options.value.values" :key="optIndex" :label="opt.v">{{ opt.n }}</Checkbox>
                    </CheckboxGroup>
                </template>
                <!--单选下拉框-->
                <template v-if="item.options.type === 'radio-dropdown'">
                    <Select>
                        <Option v-for="(opt, optIndex) in item.options.value.values" :key="optIndex" :value="opt.v">{{ opt.n }}</Option>
                    </Select>
                </template>
                <!--多选下拉框-->
                <template v-if="item.options.type === 'checkbox-dropdown'">
                    <Select multiple>
                        <Option v-for="(opt, optIndex) in item.options.value.values" :key="optIndex" :value="opt.v">{{ opt.n }}</Option>
                    </Select>
                </template>
                <!--级联下拉框-->
                <template v-if="item.options.type === 'cascade'">
                    <Cascader :data="item.options.value.values"></Cascader>
                </template>
                <!--日期-->
                <template v-if="item.options.type === 'date'">
                    <DatePicker type="date" :placeholder="item.options.tips"></DatePicker>
                </template>
                <!--富文本编辑器-->
                <template v-if="item.options.type === 'rich-text'">
                    <div :id="item.options.id"></div>
                </template>
                <!--文件上传-->
                <template v-if="item.options.type === 'file-upload'">
                    <Upload :action="$axios.baseURL + $axios.uploadURL" :name="$axios.uploadName">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </template>
                <!--人员控件-->
                <template v-if="item.options.type === 'choose-user'">
                    <Button type="primary">选择人员</Button>
                </template>
                <!--部门控件-->
                <template v-if="item.options.type === 'choose-department'">
                    <Cascader :data="item.options.list"></Cascader>
                </template>
                <!--位置控件-->
                <template v-if="item.options.type === 'choose-area'">
                    <Cascader :data="item.options.list"></Cascader>
                </template>
                <!--子表控件-->
                <template v-if="item.options.type === 'a-sub-list'">
                    <div class="subListComp">
                        <draggable
                            v-model="item.options.extend.sublist"
                            v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.itemMove'}"
                            class="dragComp"
                            :class="{subList: item.inline}"
                            :style="{width: item.inline ? (item.options.extend.sublist.length * 200 + 200) + 'px' : 'auto'}"
                            @change="handleChange(arguments[0], item.options.extend.sublist)"
                        >
                            <VirtualFormItem v-for="(vItem, vIndex) in item.options.extend.sublist" :key="vIndex" :item="vItem" :select="select" :list="item.options.extend.sublist"></VirtualFormItem>
                        </draggable>
                    </div>
                </template>
                <!--文本面板-->
                <template v-else-if="item.options.type === 'a-text-panel'">
                    <div v-html="item.value"></div>
                </template>
            </FormItem>
        </template>
        <div class="itemMove itemActions" v-if="isSelect && item.options.id === select.options.id">
            <Icon type="md-move" />
        </div>
        <div class="itemDel itemActions" v-if="isSelect && item.options.id === select.options.id" @click.stop="delItem">
            <Icon type="md-trash" />
        </div>
    </div>
</template>

<script>
    import VirtualFormItem from './VirtualFormItem'
    import draggable from 'vuedraggable'
    import Editor from 'wangeditor'
    export default {
        name: "VirtualFormItem",
        props: ['item', 'select', 'list'],
        components: {
            VirtualFormItem,
            draggable,
        },
        data(){
            return {
                editor: ""
            }
        },
        computed: {
            isSelect(){
                let select = this.select;
                return Object.keys(select).length > 0 ? true : false;
            }
        },
        watch: {
            'item.options.tips'(){
                let item = this.item;
                if(item.options && item.options.type === 'rich-text') {
                    this.editor.txt.html(`<p>${item.options.tips}</p>`)
                }
            }
        },
        mounted(){
            this.$watch('item', (item) => {
                //监听初始化富文本编辑器
                if(item.options.type === 'rich-text' && !this.editor) {
                    //rich-text_1570869651000_73737
                    this.editor = new Editor(`#${item.options.id}`);
                    this.editor.create();
                }
            })
        },
        methods: {
            //更新选中项
            updateSelectItem(){
                this.$bus.$emit('updateSelectItem', this.item)
            },
            //拖拽改变
            handleChange(evt, list){
                this.$bus.$emit('dragChange', {
                    evt, list
                });
            },
            //删除子项
            delItem(){
                let {list, select} = this;
                list.forEach((item, index) => {
                    if(item.options.id === select.options.id) {
                        list.splice(index, 1);
                    }
                });
                //如果删除完之后没有子项，则属性栏不显示，否则显示最后一个
                if(list.length < 1) {
                    this.$bus.$emit('updateSelectItem', {});
                } else {
                    this.$bus.$emit('updateSelectItem', list[list.length - 1]);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .virtualFormItem {
        position: relative;
        border-bottom: 1px solid #ccc;
        min-height: 50px;
        z-index: 1;
        .ivu-form-item {
            margin-bottom: 0;
        }
        /*&:after {*/
        /*    content: "";*/
        /*    position: absolute;*/
        /*    left: 0;*/
        /*    width: 100%;*/
        /*    top: 0;*/
        /*    height: 100%;*/
        /*    z-index: 3;*/
        /*}*/
        .itemActions {
            position: absolute;
            color: #fff;
            background: #409EFF;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px;
            z-index: 10000;
            cursor: pointer;
            &.itemMove {
                left: 0;
                top: 0;
            }
            &.itemDel {
                right: 0;
                bottom: 0;
            }
        }
        &.active{
            /*outline: 2px solid #409EFF;*/
            border: 1px solid #409EFF;
            outline-offset: 0;
        }
        &:hover{
            background: #ecf5ff;
            outline: 1px solid #409EFF;
            outline-offset: 0;
            .widget-view-drag{
                display: block;
            }
        }
        .dragComp {
            position: relative;
            z-index: 4;
            min-height: 50px;
            height: 100%;
            &.grid {
                height: 100%;
                border-right: 1px solid #ccc;
                .ivu-form-item {
                    margin-bottom: 0;
                }
            }
        }
        .tabComponent {
            overflow: visible;
        }
        .subListComp {
            overflow: auto;
            .ivu-table-wrapper {
                max-width: calc(100% - 200px);
            }
            .dragComp {
                height: 100%;
                overflow-x: auto;
                &.subList {
                    display: flex;
                    .virtualFormItem {
                        flex: 0 0 auto;
                        width: 200px;
                    }
                }
                .virtualFormItem {

                }
            }
        }
    }
</style>
