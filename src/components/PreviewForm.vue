<template>
    <div>
        <Form :label-width="120" :model="formModel" ref="pcForm" :rules="rules">
            <template v-for="item in formData">
                <PreviewItem :item="item" :formModel="formModel" :form-value="formValue"></PreviewItem>
            </template>
        </Form>
    </div>
</template>

<script>
    import PreviewItem from '../components/PreviewItem'
    import '../assets/js/form'
    export default {
        name: "PreviewForm",
        props: ['formData', 'formModel', 'ajaxData', 'formValue'],
        components: {
            PreviewItem
        },
        data(){
            return {
                //表单规则
                rules: {}
            }
        },
        watch: {
            formData(){
                //生成校验规则
                this.formatRules();
                //生成监听
                this.updateWatch();
            }
        },
        mounted(){
            this.parser = form.parser();
        },
        methods: {
            //计算校验规则
            formatRules(){
                let rules = {};
                let list = this.formData;
                // let expression = '$form.test - getOwnLeaveDay()';
                // let reg = /((\$form\.)|(\$flow\.)|(\$sys\.))+[a-zA-Z0-9\$]+/g;
                let parser = form.parser();
                list.forEach(item => {
                    let {required, inputRules,key: field} = item.options;
                    let fieldRulesArr = [];
                    //必填的规则
                    if(required) {
                        let {type} = required;
                        let expression = required.expression;
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
                            let {message, validateType } = rules;
                            let expression = rules.regularOrExpression;
                            switch (validateType) {
                                case 'local':
                                    if(eval(expression) instanceof RegExp) {
                                        fieldRulesArr.push({
                                            pattern: eval(expression),
                                            message: message,
                                            trigger: "blur"
                                        })
                                    }
                                    break;
                                case 'expression':
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
                                    });
                                    break;
                                case 'remote':
                                    const remoteFn = (rule, value, callback) => {
                                        this.$axios.ajax({
                                            url: expression,
                                            data: {
                                                params: {
                                                    v: value
                                                }
                                            }
                                        }).then(res => {
                                            if(res.data) {
                                                callback();
                                            } else {
                                                callback(new Error(message));
                                            }
                                        })
                                    };
                                    fieldRulesArr.push({
                                        validator: remoteFn,
                                        trigger: "blur"
                                    });
                                    break;
                            }
                        });
                    }
                    rules[field] = fieldRulesArr;
                });
                this.rules = rules;
            },
            //提交表单
            submitForm(){
                this.$refs['pcForm'].validate(valid => {
                    if(valid) {
                        let params = {
                            formModelId: "77adc137f8e1510f87ab9ded4619720e",
                            businessId: "1182945651466436609",
                            fields: JSON.stringify(this.enterAjaxData())
                        };
                        console.warn(JSON.stringify(this.enterAjaxData()));
                        this.$axios.ajax({
                            url: "form/insts/flow",
                            data: {
                                params: params,
                                loading: true
                            },
                            headers: {
                                'Content-Type': 'application/json;charse=UTF-8'
                            },
                            noStringifyData: true
                        }).then(res => {
                            if(res.code === 0) {
                                this.GLOBAL.toastInfo('提交成功', 'success');
                            }
                        })
                    }
                });
            },
            //将填写的数据归到提交接口数据格式中
            enterAjaxData(){
                //格式化子表数据传参
                function getSublistArr(list, formModelItem, fieldName){
                    let arr = [];
                    formModelItem.forEach(item => {
                        let exampleArr = JSON.parse(JSON.stringify(list[0]));
                        for(let n = 0; n < exampleArr.length; n++) {
                            for(let m in item) {
                                if(exampleArr[n].key === m) {
                                    exampleArr[n].db[fieldName] = item[m] instanceof Array ? item[m].join(";") : item[m];
                                }
                            }
                        }
                        arr.push(exampleArr);
                    });
                    return arr;
                }
                let ajaxData = this.ajaxData;
                let obj = [
                    {objName: "formModel", fieldName: "primary"},
                    {objName: "formValue", fieldName: "assist"},
                ];
                for(let o in obj) {
                    let formModel = JSON.parse(JSON.stringify(this[obj[o].objName]));
                    let fieldName = obj[o].fieldName;
                    ajaxData.forEach(item => {
                        for(let i in formModel) {
                            if(item.key === i) {
                                if(item.data) {
                                    item.data = getSublistArr(item.data, formModel[i], fieldName);
                                } else {
                                    item.db[fieldName] = formModel[i] instanceof Array ? formModel[i].join(";") : formModel[i];;
                                }
                                break;
                            }
                        }
                    });
                }
                this.ajaxData = ajaxData;
                return ajaxData;
            },
            //监听
            updateWatch(){
                let list = this.formData;
                let parser = form.parser();
                let watchArr = [],
                    watchColl = {};
                list.forEach(item => {
                    let field = item.options ? item.options.key : '';
                    let {watch} = item.options;
                    if(field && watch) {
                        watch.forEach(watchObj => {
                            watchObj.el = field;
                            watchArr.push(watchObj);
                        })
                    }
                });
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
                            this.formModel[item.el] = String(form.utils.runExpression(expression, {
                                $form: this.formModel
                            }, parser));
                        })
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
