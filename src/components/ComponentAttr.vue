<template>
    <!--控件属性-->
    <div v-if="showAttr">
        <Form class="attrForm" label-position="top">
            <!--表单Key-->
            <FormItem v-if="hasObjectKey('key')" label="表单 Key">
                <Input v-model="selectItem.options.key"/>
            </FormItem>
            <!--关联字段-->
            <FormItem v-if="hasObjectKey('dbInfos')" label="关联字段">
                <Cascader :data="getTableFields" v-model="selectItem.options.dbInfos[0].fieldId"></Cascader>
            </FormItem>
            <!--辅助字段-->
            <FormItem v-if="selectItem.options.dbInfos && selectItem.options.dbInfos.length > 1" label="辅助字段">
                <Select v-model="selectItem.options.dbInfos[1].fieldId">
                    <Option v-for="item of 5" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <!--标签-->
            <FormItem v-if="hasObjectKey('label')" label="标签">
                <Input v-model="selectItem.options.label" placeholder="请输入标签名"/>
            </FormItem>
            <!--提示语-->
            <FormItem v-if="hasObjectKey('tips')" label="提示语">
                <Input v-model="selectItem.options.tips" :placeholder="selectItem.options.tips"/>
            </FormItem>
            <!--最大长度-->
            <FormItem v-if="hasObjectKey('maxLength')" label="最大长度">
                <Input v-model="selectItem.options.maxLength" placeholder="请输入最大长度" :number="true"/>
            </FormItem>
            <!--候选值-->
            <FormItem v-if="hasObjectKey('value')" label="候选值">
                <!--级联选择时，请求接口拿数据-->
                <Select v-if="selectItem.options.type === 'cascade'" :value="selectItem.options.value.type" @on-change="getCascadeData">
                    <Option value="none">无</Option>
                    <Option value="sql">自定义sql</Option>
                </Select>
                <!--普通候选值-->
                <template v-else>
                    <Select v-model="selectItem.options.value.type">
                        <Option value="enum">枚举</Option>
                        <Option value="dict">数据字典</Option>
                        <Option value="sql">自定义sql</Option>
                    </Select>
                    <template v-if="selectItem.options.value.type === 'enum'">
                        <DragAddOption :select-item="selectItem"></DragAddOption>
                    </template>
                </template>
                <template v-if="selectItem.options.value.type === 'sql' || selectItem.options.value.type === 'dict'">
                    <Select v-model="selectItem.options.value.refValues" style="margin: 10px 0;">
                        <Option v-for="(item, index) in selectItem.options.value.values" :key="index" :value="item.v">{{ item.n }}</Option>
                    </Select>
                </template>
            </FormItem>
            <!--只读-->
            <FormItem v-if="hasObjectKey('readonly')" label="只读">
                <Select v-model="selectItem.options.readonly.type"
                        @on-change="changeReadHideReq(arguments[0], 'readonly')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="selectItem.options.readonly.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="selectItem.options.readonly.type === 'write'">
                    <Input type="textarea" v-model="selectItem.options.readonly.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--隐藏-->
            <FormItem v-if="hasObjectKey('hide')" label="隐藏">
                <Select v-model="selectItem.options.hide.type" @on-change="changeReadHideReq(arguments[0], 'hide')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="selectItem.options.hide.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="selectItem.options.hide.type === 'write'">
                    <Input type="textarea" v-model="selectItem.options.hide.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--必填-->
            <FormItem v-if="hasObjectKey('required')" label="必填">
                <Select v-model="selectItem.options.required.type" @on-change="changeReadHideReq(arguments[0], 'hide')">
                    <Option value="off">否</Option>
                    <Option value="on">是</Option>
                    <Option value="visual">可视化条件配置</Option>
                    <Option value="write">手动输入</Option>
                </Select>
                <template v-if="selectItem.options.required.type === 'visual'">
                    <Button type="primary" style="margin: 10px 0;">编辑条件</Button>
                </template>
                <template v-if="selectItem.options.required.type === 'write'">
                    <Input type="textarea" v-model="selectItem.options.required.expression" :autosize="{minRows: 2}"
                           placeholder="请输入表达式" style="margin: 10px 0;"/>
                </template>
            </FormItem>
            <!--验证规则-->
            <FormItem v-if="hasObjectKey('inputRules')" label="验证规则">
                <Collapse class="rulesCollapse">
                    <Panel class="itemMove" v-for="(item, index) in selectItem.options.inputRules" :key="index"
                           :name="'panel' + index">
                        规则 {{ index + 1 }}
                        <ButtonGroup>
                            <Button size="small" type="primary" @click.stop="up(index, 'inputRules')">上移</Button>
                            <Button size="small" type="primary" @click.stop="down(index, 'inputRules')">下移</Button>
                        </ButtonGroup>
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
                    <Panel class="itemMove" v-for="(item, index) in selectItem.options.watch" :key="index"
                           :name="'panel' + index">
                        监听 {{ index + 1 }}
                        <ButtonGroup>
                            <Button size="small" type="primary" @click.stop="up(index, 'watch')">上移</Button>
                            <Button size="small" type="primary" @click.stop="down(index, 'watch')">下移</Button>
                        </ButtonGroup>
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
            <FormItem v-if="selectItem.options.type === 'a-tab'" label="标签页配置项">
                <DragAddOption :select-item="selectItem"></DragAddOption>
            </FormItem>
            <!--编辑富文本内容-->
            <FormItem v-if="selectItem.options.type === 'a-text-panel'">
                <Button type="primary" @click="modal.show = true">编辑内容</Button>
            </FormItem>
        </Form>
        <IviewModal :modal="modal">
            <div slot="content">
                <template v-if="selectItem.options.type === 'a-text-panel'">
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
                }
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
            ])
        },
        watch: {
            'selectItem':{
                deep: true,
                handler: function(){
                    if(this.selectItem.options) {//设置预览时的表单字段
                        let obj = this.selectItem;
                        let primaryKey = "";
                        let itemDbFiled = obj.options.dbInfos ? obj.options.dbInfos[0].fieldId[obj.options.dbInfos[0].fieldId.length - 1] : '';
                        if(itemDbFiled) {
                            primaryKey = itemDbFiled;
                        } else {
                            primaryKey = obj.options.key;
                        }
                        obj.field = primaryKey;
                    }
                }
            },
            'modal.show'(){
                let selectItem = this.selectItem;
                if(selectItem.options.type === 'a-text-panel') {
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
                        this.selectItem.options.value = html;
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
            getCascadeData(params) {
                let selectItem = this.selectItem;
                //自定义sql
                if (params === 'sql') {
                    this.$axios.getSqlAllByUseForOfDictItemCode({
                        params: {
                            code: "multiCascade"
                        }
                    }).then(res => {
                        selectItem.options.value.values = res.data;
                    })
                } else if(params === 'none') {
                    selectItem.options.value.values = [];
                }
                selectItem.options.value.type = params;
                this.$bus.$emit('updateSelectItem', selectItem);
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
                this.selectItem.options[type].expression = expression;
            },
            //添加规则
            add(type) {
                if (type === 'inputRules') {
                    this.selectItem.options.inputRules.push(JSON.parse(JSON.stringify(validateRules)));
                } else if (type === 'watch') {
                    this.selectItem.options.watch.push(JSON.parse(JSON.stringify(watchExpr)));
                }
            },
            //上移数组元素(下标，键值)
            up(index, filedName) {
                let fieldArr = this.selectItem.options[filedName];
                if (index === 0) {
                    return false;
                } else {
                    let flag = fieldArr[index];
                    this.$set(this.selectItem.options[filedName], index, fieldArr[index - 1]);
                    this.$set(this.selectItem.options[filedName], index - 1, flag);
                }
            },
            //下移数组元素(下标，键值)
            down(index, filedName) {
                let fieldArr = this.selectItem.options[filedName];
                if (index === fieldArr.length - 1) {
                    return false;
                } else {
                    let flag = fieldArr[index];
                    this.$set(this.selectItem.options[filedName], index, fieldArr[index + 1]);
                    this.$set(this.selectItem.options[filedName], index + 1, flag);
                }
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
                selectItem.options.inputRules[index]['subType'] = item;
                selectItem.options.inputRules[index]['regularOrExpression'] = expr;
                this.$bus.$emit('updateSelectItem', selectItem)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .attrForm {
        padding: 10px;
    }
</style>

