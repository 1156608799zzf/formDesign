<template>
    <div class="previewItem" v-show="!hide">
        <!--tab标签页递归组件-->
        <template v-if="item.options.type === 'a-tab'">
            <Tabs :value="item.tabValue" class="tabComponent">
                <TabPane v-for="(tab, tabIndex) in item.options.child" :key="tabIndex" :label="tab.n" :name="tab.v">
                    <PreviewItem
                        v-for="(vItem, vIndex) in tab.list"
                        :key="vIndex"
                        :item="vItem"
                        :model="model"></PreviewItem>
                </TabPane>
            </Tabs>
        </template>
        <!--栅格布局递归组件-->
        <template v-else-if="item.options.type === 'l-row-2' || item.options.type === 'l-row-3'">
            <Row>
                <Col v-for="(colItem, colIndex) in item.options.child" :key="colIndex" :span="colItem.col">
                    <PreviewItem
                        v-for="(vItem, vIndex) in colItem.list"
                        :key="vIndex"
                        :item="vItem"
                        :model="model"></PreviewItem>
                </Col>
            </Row>
        </template>
        <!--隐藏字段-->
        <template v-else-if="item.options.type === 'hide-field'">

        </template>
        <template v-else-if="item.options.type === 'a-text-panel'">
            <div v-html="item.value"></div>
        </template>
        <!--基础控件显示-->
        <template v-else>
            <FormItem :label="item.options.label" :prop="item.field">
                <!--单行文本-->
                <template v-if="item.options.type === 'text'">
                    <Input
                        :disabled="readonly"
                        v-model="model[item.field]"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--多行文本-->
                <template v-if="item.options.type === 'textarea'">
                    <Input
                        :disabled="readonly"
                        v-model="model[item.field]"
                        type="textarea"
                        :autosize="{minRows: 4}"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--单选按钮-->
                <template v-if="item.options.type === 'radio'">
                    <RadioGroup v-model="model[item.field]">
                        <Radio
                            v-for="(opt, optIndex) in item.options.value.values"
                            :key="optIndex" :label="opt.v"
                            :disabled="readonly">{{opt.n }}
                        </Radio>
                    </RadioGroup>
                </template>
                <!--复选框-->
                <template v-if="item.options.type === 'checkbox'">
                    <CheckboxGroup :value="model[item.field]" @on-change="limitMaxLength">
                        <Checkbox v-for="(opt, optIndex) in item.options.value.values"
                                  :key="optIndex"
                                  :label="opt.v"
                                  :disabled="readonly">{{opt.n }}
                        </Checkbox>
                    </CheckboxGroup>
                </template>
                <!--单选下拉框-->
                <template v-if="item.options.type === 'radio-dropdown'">
                    <Select v-model="model[item.field]">
                        <Option
                            v-for="(opt, optIndex) in item.options.value.values"
                            :key="optIndex"
                            :value="opt.v"
                            :disabled="readonly">{{opt.n }}
                        </Option>
                    </Select>
                </template>
                <!--多选下拉框-->
                <template v-if="item.options.type === 'checkbox-dropdown'">
                    <Select v-model="model[item.field]" multiple>
                        <Option
                            v-for="(opt, optIndex) in item.options.value.values"
                            :key="optIndex"
                            :value="opt.v"
                            :disabled="readonly">{{opt.n }}
                        </Option>
                    </Select>
                </template>
                <!--级联下拉框-->
                <template v-if="item.options.type === 'cascade'">
                    <Cascader
                        :data="item.options.value.values"
                        v-model="model[item.field]"
                        :disabled="readonly"></Cascader>
                </template>
                <!--日期-->
                <template v-if="item.options.type === 'date'">
                    <DatePicker
                        type="date"
                        :placeholder="item.options.tips"
                        :disabled="readonly"
                        v-model="model[item.field]"></DatePicker>
                </template>
                <!--富文本编辑器-->
                <template v-if="item.options.type === 'rich-text'">
                    <div :class="item.options.id"></div>
                </template>
                <!--文件上传-->
                <template v-if="item.options.type === 'file-upload'">
                    <Upload :action="$axios.baseURL + $axios.uploadURL" :name="$axios.uploadName">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                    </Upload>
                </template>
                <!--人员控件-->
                <template v-if="item.options.type === 'choose-user'">
                    <Button type="primary" @click="choosePerson">选择人员</Button>
                </template>
                <!--部门控件-->
                <template v-if="item.options.type === 'choose-department'">
                    <Cascader
                        filterable
                        :data="item.options.list"
                        :disabled="readonly"
                        v-model="model[item.field]"></Cascader>
                </template>
                <!--位置控件-->
                <template v-if="item.options.type === 'choose-area'">
                    <Cascader
                        filterable
                        :data="item.options.list"
                        v-model="model[item.field]"
                        :disabled="readonly"></Cascader>
                </template>
                <!--子表控件-->
                <template v-if="item.options.type === 'a-sub-list'">
                    <div class="subListComp">
                        <!--                        <PreviewItem v-for="(vItem, vIndex) in colItem.list" :key="vIndex" :item="vItem"></PreviewItem>-->
                    </div>
                </template>
            </FormItem>
        </template>
        <IviewModal :modal="modal">
            <!--选择人员控件内容-->
            <div slot="content">
                <template v-if="modal.type === 'person'">
                    <div class="personContent">
                        <div class="left">
                            <Tree :data="departmentList" class="personTree"></Tree>
                            <Table stripe :columns="tableColumns1" :data="tableData1" class="table"
                                   @on-select="addPersonList"></Table>
                        </div>
                        <div class="btnGroup">
                            <Button type="primary" @click="addPerson">选择&lt;</Button>
                            <Button @click="delPerson">&gt;删除</Button>
                        </div>
                        <Table stripe :columns="tableColumns2" :data="rightTableData" class="table"
                               @on-select="delPersonList"></Table>
                    </div>
                </template>
            </div>
        </IviewModal>
    </div>
</template>

<script>
    import PreviewItem from './PreviewItem'
    import Editor from 'wangeditor'
    import IviewModal from './IviewModal'
    import '../assets/js/form'

    export default {
        name: "PreviewItem",
        props: ['item', 'model'],
        components: {
            PreviewItem,
            IviewModal,
        },
        data() {
            return {
                modal: {
                    show: false,
                    title: "",
                    type: ""
                },
                //部门列表
                departmentList: [
                    {
                        title: "p1",
                        expand: true,
                        children: [
                            {
                                title: "测试"
                            }
                        ]
                    }
                ],
                //人员穿梭框1
                tableColumns1: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "name"
                    },
                    {
                        title: "学号/工号",
                        key: "id"
                    }
                ],
                //提供选择的人员列表
                personList: [
                    {
                        name: 1,
                        id: 2
                    }
                ],
                //人员穿梭框2
                tableColumns2: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "name"
                    },
                    {
                        title: "学号/工号",
                        key: "id"
                    }
                ],
                //已加入的人员列表
                rightTableData: [],
                //人员预选框
                addList: [],
                //删除人员预选框
                delList: [],
                //是否只读
                readonly: false,
                //是否隐藏
                hide: false
            }
        },
        computed: {
            'tableData1': function () {
                let {personList, rightTableData} = this;
                let tableData1 = [];
                for (let i = 0; i < personList.length; i++) {
                    if (rightTableData.length < 1) {
                        tableData1.push(personList[i]);
                    } else {
                        for (let n = 0; n < rightTableData.length; n++) {
                            if (personList[i].id !== rightTableData[n].id) {
                                tableData1.push(personList[i]);
                            }
                        }
                    }
                }
                return tableData1;
            },
        },
        watch: {
            //监听modal显示的标题内容
            'modal.show'() {
                let modal = this.modal;
                let type = modal.type;
                //选择人员控件
                if (type === 'person') {
                    modal.title = '选择人员';
                    modal.type = type;
                }
                this.modal = modal;
            },
            'item': {
                deep: true,
                immediate: true,
                handler: function () {
                    let {readonly, hide} = this.item.options;
                    if (readonly) {
                        //判断只读属性
                        this.formatReadonly();
                    }
                    if (hide) {
                        //判断隐藏属性
                        this.formatHide();
                    }
                }
            },
            'model': {
                deep: true,
                immediate: true,
                handler: function () {
                    let {readonly, hide} = this.item.options;
                    if (readonly) {
                        //判断只读属性
                        this.formatReadonly();
                    }
                    if (hide) {
                        //判断隐藏属性
                        this.formatHide();
                    }
                }
            }
        },
        mounted() {
            this.$watch('item', {
                immediate: true,
                handler: (item) => {
                    //监听初始化富文本编辑器
                    if (item.options.type === 'rich-text') {
                        //rich-text_1570869651000_73737
                        let editor = new Editor(`.${item.options.id}`);
                        editor.create();
                    }
                }
            })
        },
        methods: {
            //选择人员设置
            choosePerson() {
                this.modal.type = 'person';
                this.modal.show = true;
            },
            //添加人员
            addPerson() {
                this.rightTableData = this.rightTableData.concat(this.addList);
            },
            //删除人员
            delPerson() {
                let {rightTableData, delList} = this;
                for (let i = 0; i < delList.length; i++) {
                    for (let n = 0; n < rightTableData.length; n++) {
                        if (delList[i].id === rightTableData[n].id) {
                            rightTableData.splice(n, 1);
                        }
                    }
                }
                this.rightTableData = rightTableData;
            },
            //左边人员列表选中
            addPersonList(selection) {
                this.addList = selection;
            },
            //右边人员列表选中
            delPersonList(selection) {
                this.delList = selection;
            },
            //只读
            formatReadonly() {
                let item = this.item;
                let {type, expression} = item.options.readonly;
                let readonly = false;
                if (type !== 'off') {
                    if (type === 'on') {
                        readonly = true;
                    } else {
                        let parser = form.parser();
                        if (form.utils.runExpression(expression, {
                            $form: this.model
                        }, parser)) {
                            readonly = true;
                        }
                    }
                }
                this.readonly = readonly;
            },
            //隐藏
            formatHide() {
                let item = this.item;
                let {type, expression} = item.options.hide;
                let hide = false;
                if (type !== 'off') {
                    if (type === 'on') {
                        hide = true;
                    } else {
                        let parser = form.parser();
                        if (form.utils.runExpression(expression, {
                            $form: this.model
                        }, parser)) {
                            hide = true;
                        }
                    }
                }
                this.hide = hide;
            },
            //限制最大长度
            limitMaxLength(val){
                if(val.length >= this.item.options.maxLength) {
                    this.readonly = true;
                }
                this.model[this.item.field] = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personContent {
        display: flex;

        .table {
            flex: 0 0 auto;
            width: 300px;
        }

        .left {
            display: flex;
            flex: 1;
            overflow: hidden;

            .personTree {
                flex: 1;
                overflow: hidden;
            }

        }

        .btnGroup {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin: 0 15px;
        }
    }

    .previewItem {
    }
</style>
