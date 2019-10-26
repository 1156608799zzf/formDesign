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
        <!--富文本编辑器-->
        <template v-else-if="item.options.type === 'a-text-panel'">
            <div v-html="item.value"></div>
        </template>
        <!--分割线-->
        <template v-else-if="item.options.type === 'a-interval'">
            <div class="dividerTitle">{{ item.options.label }}</div>
            <Divider />
        </template>
        <!--基础控件显示-->
        <template v-else>
            <FormItem :label="item.options.label" :prop="item.options.key">
                <!--单行文本-->
                <template v-if="item.options.type === 'text'">
                    <Input
                        :disabled="readonly"
                        v-model="model[item.options.key]"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--多行文本-->
                <template v-if="item.options.type === 'textarea'">
                    <Input
                        :disabled="readonly"
                        v-model="model[item.options.key]"
                        type="textarea"
                        :autosize="{minRows: 4}"
                        :placeholder="item.options.tips"
                        :maxlength="item.options.maxLength"
                    />
                </template>
                <!--单选按钮-->
                <template v-if="item.options.type === 'radio'">
                    <RadioGroup v-model="model[item.options.key]">
                        <Radio
                            v-for="(opt, optIndex) in item.options.value.values"
                            :key="optIndex" :label="opt.v"
                            :disabled="readonly">{{opt.n }}
                        </Radio>
                    </RadioGroup>
                </template>
                <!--复选框-->
                <template v-if="item.options.type === 'checkbox'">
                    <CheckboxGroup :value="model[item.options.key]" @on-change="limitMaxLength">
                        <Checkbox v-for="(opt, optIndex) in item.options.value.values"
                                  :key="optIndex"
                                  :label="opt.v"
                                  :disabled="readonly">{{opt.n }}
                        </Checkbox>
                    </CheckboxGroup>
                </template>
                <!--单选下拉框-->
                <template v-if="item.options.type === 'radio-dropdown'">
                    <Select v-model="model[item.options.key]">
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
                    <Select v-model="model[item.options.key]" multiple>
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
                        v-model="model[item.options.key]"
                        :disabled="readonly"></Cascader>
                </template>
                <!--日期-->
                <template v-if="item.options.type === 'date'">
                    <DatePicker
                        type="date"
                        :placeholder="item.options.tips"
                        :disabled="readonly"
                        v-model="model[item.options.key]"></DatePicker>
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
                        v-model="model[item.options.key]"></Cascader>
                </template>
                <!--位置控件-->
                <template v-if="item.options.type === 'choose-area'">
                    <Cascader
                        filterable
                        :data="item.options.list"
                        v-model="model[item.options.key]"
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
                            <Table stripe :columns="tableColumns1" :data="leftTableData" class="table"
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
                departmentList: [],
                //人员穿梭框1
                tableColumns1: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "fullName"
                    },
                    {
                        title: "学号/工号",
                        key: "userId"
                    }
                ],
                //提供选择的人员列表
                personList: [],
                //人员穿梭框2
                tableColumns2: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "fullName"
                    },
                    {
                        title: "学号/工号",
                        key: "userId"
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
            'leftTableData': function () {
                let {rightTableData} = this;
                let personList = JSON.parse(JSON.stringify(this.personList));
                let leftData = JSON.parse(JSON.stringify(personList));
                personList.forEach((item, index) => {
                    if(rightTableData.length > 0) {
                        rightTableData.forEach(child => {
                            if(item.userId === child.userId) {
                                leftData.splice(index, 1);
                            }
                        })
                    }
                });
                return leftData;
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
                    let type = item.options.type;
                    //监听初始化富文本编辑器
                    if (type === 'rich-text') {
                        //rich-text_1570869651000_73737
                        let editor = new Editor(`.${item.options.id}`);
                        editor.customConfig.onchange = html => {
                            this.item.options.value = html;
                        };
                        editor.create();
                    }
                }
            });
        },
        methods: {
            //选择人员设置
            choosePerson() {
                this.modal.type = 'person';
                this.modal.show = true;
                //人员控件监听获取部门及员工
                this.$Spin.show();
                this.$axios.getApartmentList().then(res => {
                    let list = res.data;
                    this.departmentList = this.sortFileData(list, 0);
                    if(list.length > 0) {
                        this.$axios.getPersonList({
                            data: {
                                params: {
                                    orgId: res.data[0],
                                    pageSize: 10000
                                }
                            }
                        }).then(res => {
                            this.personList = res.data.records;
                            this.$Spin.hide();
                        })
                    } else {
                        this.$Spin.hide();
                    }
                });
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
                this.model[this.item.options.key] = val;
            },
            //排序
            sortFileData(data, parentId) {
                let convertData = [];
                data.forEach(item => {
                    if(item.orgPid == parentId) {
                        item['title'] = item.orgName;
                        convertData.push(item);
                        this.convertChild(data, item, item.orgId)
                    }
                });
                return convertData;
            },
            convertChild(arr, parentItem, parentId) {
                parentItem.children = parentItem.children ? parentItem.children : [];
                arr.forEach(item => {
                    if(item.orgPid === parentId) {
                        item['title'] = item.orgName;
                        parentItem.expand = true;
                        parentItem.children.push(item);
                        this.convertChild(arr, item, item.orgId)
                    }
                });
                return parentItem.children;
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
</style>
