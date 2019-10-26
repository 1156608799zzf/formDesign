<template>
    <div class="previewForm">
        <Form :label-width="120" :model="formModel" ref="previewForm" :rules="rules">
            <PreviewItem v-for="(item, index) in list" :key="index" :item="item" :model="formModel"></PreviewItem>
            <FormItem class="text-center" :label-width="0">
                <Button type="primary" @click="submitForm">提交</Button>
<!--                <Button type="primary" @click="resetForm">重置表单信息</Button>-->
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import PreviewItem from '../components/PreviewItem'
    import '../assets/js/form'
    export default {
        name: "PreviewForm",
        props: ['widgetForm'],
        components: {
            PreviewItem
        },
        data(){
            return {
                list: this.widgetForm.list,
                formModel: {},
                rules: {},
                //监听
                parser: ""
            }
        },
        watch: {
            widgetForm: {
                deep: true,
                immediate: true,
                handler: function(){
                    let formList = this.widgetForm.list;
                    let model = {};
                    let watchArr = [];
                    formList.forEach(item => {
                        let field = item.options ? item.options.key : '';
                        if(field) {
                            let {type, watch} = item.options;
                            if(type === 'checkbox' || type === 'radio' || type === 'radio-dropdown' || type === 'checkbox-dropdown' || type === 'cascade' || type === 'file-upload' || type === 'choose-area' || type === 'icon-input' || type === 'choose-department' || type === 'choose-user') {
                                model[field] = [];
                            } else {
                                model[field] = "";
                            }
                            watch.forEach(watchObj => {
                                watchObj.el = field;
                                watchArr.push(watchObj);
                            })
                        }
                    });
                    this.watchArr = watchArr;
                    //更新表单规则
                    this.formatRules();
                    //更新监听
                    this.updateWatch();
                    this.formModel = model;
                }
            }
        },
        mounted(){
            this.parser = form.parser();
        },
        methods: {
            //提交表单验证
            submitForm(){
                this.$refs['previewForm'].validate(valid => {
                    console.warn(valid)
                    if(valid) {

                    }
                })
            },
            //重置表单信息
            resetForm(){
                this.$refs['previewForm'].resetFields();
            },
            //计算校验规则
            formatRules(){
                let rules = {};
                let list = this.list;
                // let expression = '$form.test - getOwnLeaveDay()';
                // let reg = /((\$form\.)|(\$flow\.)|(\$sys\.))+[a-zA-Z0-9\$]+/g;
                let parser = form.parser();
                list.forEach(item => {
                    let {required, inputRules,key: field} = item.options;
                    let fieldRulesArr = [];
                    //必填的规则
                    if(required) {
                        let {type, expression} = required;
                        if(type !== 'off') {
                            if(type === 'on') {
                                fieldRulesArr.push({
                                    required: true,
                                    message: "此项为必填项",
                                    trigger: "blur"
                                })
                            } else {
                                const exprFn = (rule, value, callback) => {
                                    if(form.utils.runExpression(expression, {
                                        $form: this.formModel
                                    }, parser)) {
                                        if(value === '') {
                                            callback(new Error('此项为必填项'));
                                        } else {
                                            callback()
                                        }
                                    }
                                };
                                fieldRulesArr.push({
                                    validator: exprFn,
                                    trigger: "blur"
                                })
                            }
                        }
                    }
                    //输入的验证规则
                    if(inputRules && inputRules.length > 0) {
                        inputRules.forEach(rules => {
                            let {regularOrExpression: expression, message, validateType } = rules;
                            if(validateType === 'local') {
                                if(eval(expression) instanceof RegExp) {
                                    fieldRulesArr.push({
                                        pattern: eval(expression),
                                        message: message,
                                        trigger: "blur"
                                    })
                                }
                            } else if(validateType === 'expression'){
                                const exprFn = (rule, value, callback) => {
                                    if(form.utils.runExpression(expression, {
                                        $form: this.formModel
                                    }, parser)) {
                                        callback(new Error(message));
                                    } else {
                                        callback();
                                    }
                                };
                                fieldRulesArr.push({
                                    validator: exprFn,
                                    trigger: "blur"
                                })
                            } else {

                            }
                        });
                    }
                    rules[field] = fieldRulesArr;
                });
                this.rules = rules;
            },
            //监听
            updateWatch(){
                let watchArr = this.watchArr;
                let watchColl = {};
                watchArr.forEach(item => {
                    let {expression, el} = item;
                    let varArr = form.parseExpressionField(expression);
                    varArr.forEach(modelVar => {
                        let str = modelVar.replace('$form.', '');
                        if(!watchColl[str]) {
                            watchColl[str] = [];
                        }
                        watchColl[str].push({
                            el,
                            expression
                        })
                    })
                });
                for(let i in watchColl) {
                    this.$watch('formModel.' + i, () => {
                        let arr = watchColl[i];
                        arr.forEach(item => {
                            let expression = item.expression;
                            this.formModel[item.el] = form.utils.runExpression(expression, {
                                $form: this.formModel
                            }, this.parser);
                        })
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
