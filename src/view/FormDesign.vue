<template>
    <div style="height: 100%">
        <Layout class="formDesign">
            <Header class="header">
                <img src="../assets/images/logo.png">
            </Header>
            <Layout class="layout-container">
                <Sider hide-trigger class="layout-aside panel">
                    <div class="panel-title">
                        <span>表单控件</span>
                    </div>
                    <div class="panel-container">
                        <draggable
                            class="aside-draggable"
                            tag="ul"
                            :list="formComponents"
                            @start='drag=true'
                            @end='drag=false'
                            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                        >
                            <li v-for="(item, index) in formComponents" :key="index">
                                <i class="icon iconfont" :class="item.icon"></i>
                                <span>{{ item.name }}</span>
                            </li>
                        </draggable>
                    </div>
                </Sider>
                <Content class="layout-content panel">
                    <Layout>
                        <Content>
                            <div class="panel-title">
                                <span>表单设计</span>
                                <ButtonGroup class="btnGroup">
                                    <Button class="btn" type="text" @click="showModal('preview')">
                                        <Icon type="ios-eye" size="24"/>
                                        预览
                                    </Button>
                                    <Button class="btn" type="text" @click="saveForm">
                                        <Icon type="ios-bookmark" size="20"/>
                                        保存
                                    </Button>
                                    <Button class="btn" type="text">
                                        <Icon type="ios-send" size="26"/>
                                        发布
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <div class="panel-container">
                                <VirtualForm :data="widgetForm" :select="widgetFormSelect"></VirtualForm>
                            </div>
                        </Content>
                        <Sider class="layout-aside panel">
                            <div class="panel-title">
                                <span>控件属性</span>
                            </div>
                            <div class="panel-container">
                                <ComponentAttr :select-item="widgetFormSelect"></ComponentAttr>
                            </div>
                        </Sider>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
        <IviewModal :modal="modal">
            <div slot="content">
                <template v-if="modal.type === 'preview'">
                    <PreviewForm :widgetForm="widgetForm"></PreviewForm>
                </template>
            </div>
        </IviewModal>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import {formComponents} from '../config/formComponents'
    import VirtualForm from '../components/VirtualForm'
    import ComponentAttr from '../components/ComponentAttr'
    import IviewModal from '../components/IviewModal'
    import PreviewForm from '../components/PreviewForm'
    export default {
        name: "FormRegister",
        components: {
            draggable,
            VirtualForm,
            ComponentAttr,
            IviewModal,
            PreviewForm,
        },
        data() {
            return {
                //是否正在拖拽
                drag: false,
                //表单控件
                formComponents,
                //虚拟表单
                widgetForm: {
                    list: []
                },
                //选中的子项
                widgetFormSelect: {},
                //预约弹窗
                modal: {
                    show: false,
                    title: "预览表单",
                    type: ""
                }

            }
        },
        mounted() {
            //监听更新选中表单项
            this.$bus.$off('updateSelectItem');
            this.$bus.$on('updateSelectItem', item => {
                this.widgetFormSelect = item;
            });
            //监听拖拽添加
            this.$bus.$off('dragChange');
            this.$bus.$on('dragChange', params => {
                let {evt, list} = params;
                if(evt.added) {
                    let {newIndex: index, element} = evt.added;
                    let obj = JSON.parse(JSON.stringify(element));
                    obj.options.id = obj.options.type + '_' + Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
                    this.$set(list, index, obj);
                    this.widgetFormSelect = obj;
                }
            });
            //获取表单JSON
            this.getFormData();
            //获取表单字段表
            this.$axios.getTableFiedls();
        },
        methods: {
            //预览表单
            showModal(type) {
                let modal = {
                    title : "",
                    show: true,
                    type: type
                };
                if (type === 'preview') {
                    // let list = this.widgetForm.list;
                    // for(let i = 0; i < list.length; i++) {
                    //     if(!list[i].field) {
                    //         this.GLOBAL.toastInfo('请先填写key值后再预览', 'warning');
                    //         return false;
                    //     }
                    // }
                    modal.title = '预览表单'
                }
                this.modal = modal;
                console.warn(JSON.stringify(this.widgetForm.list))
            },
            //保存表单
            saveForm() {
                this.$axios.ajax({
                    url: "form/models/data/uitest",
                    data: {
                        params: {
                            data: JSON.stringify(this.widgetForm.list),
                            version: this.widgetForm.version
                        },
                        loading: true
                    },
                    method: "put"
                }).then(res => {
                    if(res.code === 0) {
                        this.GLOBAL.toastInfo('保存成功', 'success');
                    }
                })
            },
            //获取表单的JSON数据
            getFormData(){
                this.$axios.ajax({
                    url: "form/models/form-key/uitest",
                    method: "put"
                }).then(res => {
                    let widgetForm = this.widgetForm;
                    let data = res.data;
                    let list = JSON.parse(data.data);
                    if(list.length > 0) {
                        this.widgetFormSelect = list[0];
                    }
                    widgetForm.list = list;
                    widgetForm.version = data.version;
                    this.widgetForm = widgetForm;
                })
            }
        }
    }
</script>

<style lang="scss">
    .formDesign {
        height: 100%;
        .panel {
            .panel-title {
                display: flex;
                justify-content: space-between;
                background-color: rgba(248, 248, 249, 1);
                min-height: 44px;
                line-height: 44px;
                padding: 0 15px;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;
                border: 1px solid rgba(220, 222, 226, 1);

                span {
                    font-weight: bold;
                }

                .btnGroup {
                    display: flex;

                    .btn {
                        color: #169BD5;
                        cursor: pointer;
                    }
                }
            }

            .panel-container {
                position: relative;
                height: calc(100% - 46px);
                background: #fff;
                border-left: 1px solid rgba(220, 222, 226, 1);
                border-right: 1px solid rgba(220, 222, 226, 1);
                border-bottom: 1px solid rgba(220, 222, 226, 1);
                overflow-x: hidden;
                overflow-y: auto;
            }
        }

        .header {
            display: flex;
            width: 100%;
            height: 60px;
            background-color: rgba(0, 33, 64, 1);
            padding: 0;
        }

        .layout-container {
            background-color: transparent;
            padding: 20px;

            .layout-aside {
                width: auto !important;
                min-width: 250px !important;
                background: #fff;
                margin-right: 20px;

                .aside-draggable {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: -1px;

                    li {
                        width: 50%;
                        line-height: 40px;
                        padding-left: 15px;
                        cursor: pointer;
                        list-style: none;
                        border-right: 1px solid rgba(220, 222, 226, 1);
                        border-bottom: 1px solid rgba(220, 222, 226, 1);

                        &:nth-of-type(2n) {
                            border-right: 0;
                        }

                        &:hover {
                            background: rgba(220, 222, 226, 1);
                        }
                    }
                }
            }

            .layout-content {
                & > .ivu-layout {
                    height: 100%;

                    .ivu-layout-content {
                        display: flex;
                        flex-direction: column;

                        .panel-container {
                            flex: 1;
                        }
                    }

                    .layout-aside {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
</style>
