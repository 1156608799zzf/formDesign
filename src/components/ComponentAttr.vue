<template>
    <!--控件属性-->
    <div v-if="showAttr">
        <Form class="attrForm" label-position="top">
            <!--表单Key-->
            <FormItem v-if="hasObjectKey('key')" label="表单 Key">
                <Input v-model="itemOptions.key" :readonly="itemOptions.dbInfos && itemOptions.dbInfos[0].fieldName ? true : false"/>
            </FormItem>
            <!--关联字段-->
            <FormItem v-if="hasObjectKey('dbInfos')" label="关联字段">
                <Cascader :data="getTableFields" :value="itemOptions.dbInfos[0].cascadeValue" @on-change="((val, sel) => {this.filedChange(val, sel, 0)})"></Cascader>
            </FormItem>
            <!--辅助字段-->
            <FormItem v-if="itemOptions.dbInfos && itemOptions.dbInfos.length > 1 " label="辅助字段">
                <Cascader :data="getTableFields" :value="itemOptions.dbInfos[1].cascadeValue" @on-change="((val, sel) => {this.filedChange(val, sel, 1)})"></Cascader>
            </FormItem>
            <!--标签-->
            <FormItem v-if="hasObjectKey('label')" label="标签">
                <Input v-model="itemOptions.label" placeholder="请输入标签名"/>
            </FormItem>
            <!--提示语-->
            <FormItem v-if="hasObjectKey('tips')" label="提示语">
                <Input v-model="itemOptions.tips" :placeholder="itemOptions.tips"/>
            </FormItem>
            <!--最大长度-->
            <FormItem v-if="hasObjectKey('maxLength')" label="最大长度">
                <Input v-model="itemOptions.maxLength" placeholder="请输入最大长度" :number="true"/>
            </FormItem>
            <!--候选值-->
            <FormItem v-if="hasObjectKey('value') && itemOptions.type !== 'choose-area' && itemOptions.type !== 'choose-department'" label="候选值">
                <!--级联选择时，请求接口拿数据-->
                <Select v-if="selectItemType === 'cascade'" :value="itemOptions.value.type" @on-change="getCascadeData">
                    <Option value="none">无</Option>
                    <Option value="sql">自定义sql</Option>
                </Select>
                <!--选人、位置、部门-->
                <Select v-else-if="selectItemType === 'choose-area' || selectItemType === 'choose-department' || selectItemType === 'choose-user'" :value="itemOptions.value.type" @on-change="getSystemList">
                    <Option value="none">无</Option>
                    <Option value="sysVariate">系统变量</Option>
                </Select>
                <!--普通候选值-->
                <template v-else>
                    <Select :value="itemOptions.value.type" @on-change="((type) => {this.valueTypeChange(type, 'value')})">
                        <Option value="enum">枚举</Option>
                        <Option value="dict">数据字典</Option>
                        <Option value="sql">自定义sql</Option>
                    </Select>
                    <template v-if="itemOptions.value.type === 'enum'">
                        <DragAddOption :select-item="selectItem"></DragAddOption>
                    </template>
                </template>
                <template v-if="itemOptions.value.type === 'sql' || itemOptions.value.type === 'dict' || itemOptions.value.type === 'sysVariate'">
                    <Select v-model="itemOptions.value.refValues" style="margin: 10px 0;">
                        <Option v-for="(item, index) in selectItem.ajaxOptions" :key="index" :value="item.v">{{ item.n }}</Option>
                    </Select>
                </template>
            </FormItem>
            <!--日期专用-->
            <FormItem v-if="itemOptions.type === 'date'" label="日期配置">
                <Select v-model="selectItem.compType">
                    <Option value="date">yyyy-MM-dd</Option>
                    <Option value="daterange">range yyyy-MM-dd</Option>
                    <Option value="datetime">yyyy-MM-dd HH:mm:ss</Option>
                    <Option value="datetimerange">range yyyy-MM-dd HH:mm:ss</Option>
                    <Option value="year">yyyy</Option>
                    <Option value="month">yyyy-mm</Option>
                </Select>
                <Input v-model="itemOptions.extend.date.format" style="margin-top: 10px;"/>
            </FormItem>
            <!--人员控件专用-->
            <FormItem v-if="itemOptions.type === 'choose-user'" label="人员配置">
                <i-switch v-model="selectItem.singleSwitch"></i-switch>
            </FormItem>
            <!--初始化值-->
            <FormItem v-if="hasObjectKey('initValue')" label="初始化值">
                <Select :value="itemOptions.initValue.type" @on-change="((type) => {this.valueTypeChange(type, 'initValue')})">
                    <Option value="enum">枚举输入</Option>
                    <Option value="sql">自定义sql</Option>
                    <Option value="expression">运算表达式</Option>
                    <Option value="sysVariate">系统变量</Option>
                </Select>
                <template v-if="itemOptions.initValue.type === 'enum'">
                    <template v-if="itemOptions.type !== 'text' && itemOptions.type !== 'textarea' && itemOptions.type !== 'rich-text' && itemOptions.type !== 'choose-user' && itemOptions.type !== 'choose-department' && itemOptions.type !== 'choose-area'">
                        <Select :multiple="true" v-model="itemOptions.initValue.values" style="margin-top: 10px;">
                            <Option v-for="opt in itemOptions.value.values" :value="opt" :key="opt.v">{{ opt.n }}</Option>
                        </Select>
                    </template>
                    <template v-else>
                        <DragAddOption :select-item="selectItem" add-type="initValue"></DragAddOption>
                    </template>
                </template>
                <template v-if="itemOptions.initValue.type === 'sql' || itemOptions.initValue.type === 'sysVariate'">
                    <Select v-model="itemOptions.initValue.refValues" style="margin: 10px 0;">
                        <Option v-for="(item, index) in selectItem.ajaxOptions" :key="index" :value="item.v">{{ item.n }}</Option>
                    </Select>
                </template>
                <template v-if="itemOptions.initValue.type === 'expression'">
                    <Input type="textarea" v-model="itemOptions.initValue.refValues" style="margin-top: 10px;" />
                </template>
            </FormItem>
            <!--只读-->
            <FormItem v-if="hasObjectKey('readonly')" label="只读">
                <Select v-model="itemOptions.readonly.type"
                        @on-change="changeReadHideReq(arguments[0], 'readonly')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="itemOptions.readonly.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="itemOptions.readonly.type === 'write'">
                    <Input type="textarea" v-model="itemOptions.readonly.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--隐藏-->
            <FormItem v-if="hasObjectKey('hide')" label="隐藏">
                <Select v-model="itemOptions.hide.type" @on-change="changeReadHideReq(arguments[0], 'hide')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="itemOptions.hide.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="itemOptions.hide.type === 'write'">
                    <Input type="textarea" v-model="itemOptions.hide.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--必填-->
            <FormItem v-if="hasObjectKey('required')" label="必填">
                <Select v-model="itemOptions.required.type" @on-change="changeReadHideReq(arguments[0], 'hide')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="itemOptions.required.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="itemOptions.required.type === 'write'">
                    <Input type="textarea" v-model="itemOptions.required.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--验证规则-->
            <FormItem v-if="hasObjectKey('inputRules')" label="验证规则">
                <Collapse class="rulesCollapse">
                    <Panel class="itemMove" v-for="(item, index) in itemOptions.inputRules" :key="index"
                           :name="'panel' + index">
                        规则 {{ index + 1 }}
                        <Dropdown>
                            <Button type="primary" size="small">
                                操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native.stop="up(index, 'inputRules')">上移</DropdownItem>
                                <DropdownItem @click.native.stop="down(index, 'inputRules')">下移</DropdownItem>
                                <DropdownItem @click.native.stop="del(index, 'inputRules')">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <div slot="content">
                            <Form>
                                <FormItem label="验证类型">
                                    <Select v-model="item.validateType">
                                        <Option value="local">本地验证</Option>
                                        <Option value="remote">远程调用验证</Option>
                                        <Option value="expression">运算表达式验证</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="内置类型" v-if="item.validateType === 'local'">
                                    <Select :value="item.subType" @on-change="selectValidateType(arguments[0], index)">
                                        <Option value="email">邮箱</Option>
                                        <Option value="mobile">手机号码</Option>
                                        <Option value="telephone">固定电话</Option>
                                        <Option value="custom">自定义正则</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="表达式或者正则"
                                          v-if="(item.validateType === 'remote' || item.validateType === 'expression') || item.subType === 'custom'">
                                    <Input type="textarea" v-model="item.regularOrExpression"/>
                                </FormItem>
                                <FormItem label="错误信息">
                                    <Input placeholder="请输入错误信息" v-model="item.message"/>
                                </FormItem>
                            </Form>
                        </div>
                    </Panel>
                </Collapse>
                <Button type="primary" style="margin: 10px 0;" @click="add('inputRules')">添加规则</Button>
            </FormItem>
            <!--表达式监听-->
            <FormItem v-if="hasObjectKey('watch')" label="监听">
                <Collapse class="rulesCollapse">
                    <Panel class="itemMove" v-for="(item, index) in itemOptions.watch" :key="index"
                           :name="'panel' + index">
                        监听 {{ index + 1 }}

                        <Dropdown>
                            <Button type="primary" size="small">
                                操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native.stop="up(index, 'watch')">上移</DropdownItem>
                                <DropdownItem @click.native.stop="down(index, 'watch')">下移</DropdownItem>
                                <DropdownItem @click.native.stop="del(index, 'watch')">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <div slot="content">
                            <Form>
                                <FormItem label="表达式">
                                    <Input placeholder="请输入表达式" v-model="item.expression"/>
                                </FormItem>
                            </Form>
                        </div>
                    </Panel>
                </Collapse>
                <Button type="primary" style="margin: 10px 0;" @click="add('watch')">添加监听</Button>
            </FormItem>
            <!--tab标签页-->
            <FormItem v-if="itemOptions.type === 'a-tab'" label="标签页配置项">
                <DragAddOption :select-item="selectItem"></DragAddOption>
            </FormItem>
            <!--编辑富文本内容-->
            <FormItem v-if="itemOptions.type === 'a-text-panel'">
                <Button type="primary" @click="modal.show = true">编辑内容</Button>
            </FormItem>
            <!--子表内联开关-->
            <FormItem v-if="itemOptions.type === 'a-sub-list'" label="内联">
                <i-switch v-model="selectItem.inline" />
            </FormItem>
        </Form>
        <IviewModal :modal="modal">
            <div slot="content">
                <template v-if="itemOptions.type === 'a-text-panel'">
                    <div id="textCompEditor"></div>
                </template>
            </div>
        </IviewModal>
    </div>
</template>

<script>
    /*
    * 1、只读、隐藏、必填
    * 2、表达式
    *
    * */
    import DragAddOption from './DragAddOption'
    import draggable from 'vuedraggable'
    import IviewModal from '../components/IviewModal'
    import Editor from 'wangeditor'
    import {validateRules, watchExpr} from '../config/formComponents'
    import {mapGetters} from 'vuex'
    import '../assets/js/form'

    export default {
        name: "ComponentAttr",
        props: ['selectItem'],
        components: {
            DragAddOption,
            draggable,
            IviewModal,
            Editor,
        },
        data() {
            return {
                optionsValue: "",
                //弹窗配置
                modal: {
                    show: false,
                    title: "编辑面板"
                },
                parser: ""
            }
        },
        computed: {
            //判断是否选中了控件，选中则显示该控件所拥有的属性
            showAttr() {
                if(this.selectItem && Object.keys(this.selectItem).length > 0) {
                    return true
                }
                return false
            },
            ...mapGetters([
                'getFormDesigner',
                'getSqlList',
                'getSysVarList',
                'getTableFields'
            ]),
            selectItemType(){
                return this.itemOptions.type;
            },
            itemOptions(){
                console.warn(this.selectItem.options)
                return this.selectItem.options;
            }
        },
        watch: {
            'selectItem':{
                deep: true,
                handler: function(){
                    let selectItem = this.selectItem;
                    let itemOptions = this.itemOptions;
                    let primaryKey = "";
                    if(itemOptions && itemOptions.dbInfos) {
                        let itemDbField = itemOptions.dbInfos ? itemOptions.dbInfos[0].fieldName : '';
                        if(itemDbField) {
                            primaryKey = itemDbField;
                        } else {
                            primaryKey = itemOptions.key;
                        }
                        itemOptions.key = primaryKey;
                        this.$bus.$emit('updateSelectItem', selectItem);
                    }
                }
            },
            'modal.show'(){
                let selectItem = this.selectItem;
                if(itemOptions.type === 'a-text-panel') {
                    let editor = new Editor('#textCompEditor');
                    editor.customConfig.onchange = html => {
                        this.selectItem.value = html;
                    };
                    editor.create();
                }
            }
        },
        mounted() {
            this.$watch('selectItem', (item) => {
                //监听初始化富文本编辑器
                if (Object.keys(item).length > 0 && item.options.type === 'a-text-panel') {
                    let editor = new Editor('#' + item.options.id);
                    editor.customConfig.onchange = html => {
                        this.itemOptions.value = html;
                    };
                    editor.create();
                }
            });
        },
        methods: {
            //判断一个对象是否有key键
            hasObjectKey(key, obj) {
                let item = obj ? obj : this.selectItem;
                let options = item.options;
                if (options.hasOwnProperty(key)) {
                    return true;
                }
            },
            //获取级联数据
            getCascadeData(type) {
                let ajaxOptions;
                //自定义sql
                if (type === 'sql') {
                    this.$axios.getSqlAllByUseForOfDictItemCode({
                        data: {
                            params: {
                                code: "multiCascade"
                            },
                            loading: true
                        }
                    }).then(res => {
                        ajaxOptions = res.data;
                        this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                    })
                } else if(type === 'none') {
                    ajaxOptions = [];
                    this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                }
                this.itemOptions.value.type = type;
            },
            //获取位置、人员、部门数据
            getSystemList(type){
                let ajaxOptions;
                if (type === 'sysVariate') {
                    this.$axios.getSysVarList({
                        data: {
                            loading: true
                        }
                    }).then(res => {
                        ajaxOptions = res.data;
                        this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                    })
                } else {
                    ajaxOptions = [];
                    this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                }
                this.itemOptions.value.type = type;
            },
            //改变只读、隐藏、必填
            changeReadHideReq(value, type) {
                let expression = "";
                switch (value) {
                    case 'off':
                        expression = 'false';
                        break;
                    case 'on':
                        expression = 'true';
                        break;
                    default:
                        expression = "";
                }
                this.itemOptions[type].expression = expression;
            },
            //添加规则
            add(type) {
                if (type === 'inputRules') {
                    this.itemOptions.inputRules.push(JSON.parse(JSON.stringify(validateRules)));
                } else if (type === 'watch') {
                    this.itemOptions.watch.push(JSON.parse(JSON.stringify(watchExpr)));
                }
            },
            //上移数组元素(下标，键值)
            up(index, filedName) {
                let fieldArr = this.itemOptions[filedName];
                if (index === 0) {
                    return false;
                } else {
                    let flag = fieldArr[index];
                    this.$set(this.itemOptions[filedName], index, fieldArr[index - 1]);
                    this.$set(this.itemOptions[filedName], index - 1, flag);
                }
            },
            //下移数组元素(下标，键值)
            down(index, filedName) {
                let fieldArr = this.itemOptions[filedName];
                if (index === fieldArr.length - 1) {
                    return false;
                } else {
                    let flag = fieldArr[index];
                    this.$set(this.itemOptions[filedName], index, fieldArr[index + 1]);
                    this.$set(this.itemOptions[filedName], index + 1, flag);
                }
            },
            //删除
            del(index, filedName){
                let fieldArr = this.itemOptions[filedName];
                fieldArr.splice(index, 1);
                this.itemOptions[filedName] = fieldArr;

            },
            //内置验证规则
            selectValidateType(item, index){
                let selectItem = this.selectItem;
                let expr = "";
                switch (item) {
                    case 'email':
                        expr = "/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/";
                        break;
                    case 'mobile':
                        expr = "/^1(3|4|5|6|7|8|9)\\d{9}$/";
                        break;
                    case 'telephone':
                        expr = "/^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$/";
                        break;
                }
                itemOptions.inputRules[index]['subType'] = item;
                itemOptions.inputRules[index]['regularOrExpression'] = expr;
                this.$bus.$emit('updateSelectItem', selectItem)
            },
            //候选值类型变化
            valueTypeChange(type, field){
                let ajaxOptions;
                switch (type) {
                    case 'sql':
                        this.$axios.getSqlAllByUseForOfDictItemCode({
                            data: {
                                loading: true
                            }
                        }).then(res => {
                            ajaxOptions = res.data;
                            this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                        });
                        break;
                    case 'dict':
                        this.$axios.getFormDesigner({
                            data: {
                                loading: true
                            }
                        }).then(res => {
                            ajaxOptions = res.data;
                            this.$set(this.selectItem, 'ajaxOptions', ajaxOptions);
                        });
                        break;
                }
                this.itemOptions[field].type = type;
            },
            //字段改变时赋值必要传参数据
            filedChange(value, selectedData, index){
                let selectItem = this.selectItem;
                let itemOptions = this.itemOptions;
                itemOptions.dbInfos[index].tableId = value[0];
                itemOptions.dbInfos[index].fieldId = value[1];
                itemOptions.dbInfos[index].cascadeValue = value;
                if(selectedData.length > 0) {
                    let mainTableName = selectedData[0].label.match(/[^(][a-zA-Z0-9_]+(?=\))/g);
                    itemOptions.dbInfos[index].fieldName = mainTableName[0] + '__' + selectedData[1].colName;
                } else {
                    itemOptions.dbInfos[index].fieldName = "";
                }
                this.$bus.$emit('updateSelectItem', selectItem);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .attrForm {
        padding: 10px;
    }
</style>

