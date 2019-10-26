/*
* 结构表
* {
*   name:组件名字
*   icon:组件的icon字体图标
*   //接口配置
*   options: {
*       key: 表单字段ID
*       tips: 占位符（提示语），即input框的placeholder
*       maxLength: 最大长度（文件则代表上传个数）
*       options: 候选值(Boolean)
*       value: 控件的model值,
*       readonly: 只读
*       readonlyString: 只读的表达式（如果有，根据readonly的值来判断，hide/required一样）
*   }
* }
*
* */

//接口的dbInfos字段规范
const dbInfos = [
    {
        valueType: "primary",
        tableId: "",
        fieldId: "",
        fieldName: "",
        cascadeValue: []
    },
    {
        valueType: "assist",
        fieldId: "",
        tableId: "",
        fieldName: "",
        cascadeValue: []
    }
];
//接口中value字段规范
const value = {
    type: "",
    values: [],
    refValues: ""
};
//接口中initValue字段规范
const initValue = {
    type: "",
    values: [],
    refValues: ""
};
//验证规则接口规范（用于添加规则时使用）
const validateRules = {
    validateType: "",
    subType: "",
    regularOrExpression: "",
    message: ""
};
//监听规则接口规范（用于添加监听表达式）
const watchExpr = {
    expression: ""
};
//只读、隐藏、必填接口规范
const readHideReq = {
    type: 'off',
    value: "",
    expression: 'false'
};
//表单设计器定义核心配置
const formComponents = [
    {
        name: "单行文本",
        icon: "icon-input",
        options: {
            id: "",
            key: null,
            label: "单行文本",
            type: "text",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: [dbInfos[0]],
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "多行文本",
        icon: "icon-input",
        options: {
            key: null,
            label: "多行文本",
            type: "textarea",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: [dbInfos[0]],
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "单选按钮",
        icon: "icon-input",
        options: {
            key: null,
            label: "单选按钮",
            type: "radio",
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            value: value,
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "复选框",
        icon: "icon-input",
        options: {
            key: null,
            label: "复选框",
            type: "checkbox",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            value: value,
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "单选下拉框",
        icon: "icon-input",
        options: {
            key: null,
            label: "单选下拉框",
            type: "radio-dropdown",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            value: value,
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "多选下拉框",
        icon: "icon-input",
        options: {
            key: null,
            label: "多选下拉框",
            type: "checkbox-dropdown",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            value: value,
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "级联下拉框",
        icon: "icon-input",
        options: {
            key: null,
            label: "级联下拉框",
            type: "cascade",
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            value: value,
            watch: []
        }
    },
    {
        name: "日期",
        icon: "icon-input",
        compType: "date",
        options: {
            type: "date",
            label: "日期",
            key: null,
            tips: "",
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: [dbInfos[0]],
            watch: [],
            extend: {
                date: {
                    format: ""
                }
            }
        }
    },
    {
        name: "富文本面板",
        icon: "icon-input",
        options: {
            type: "rich-text",
            label: "富文本面板",
            key: null,
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: [dbInfos[0]],
            watch: [],
            initValue: initValue
        }
    },
    {
        name: "文件上传",
        icon: "icon-input",
        options: {
            type: "file-upload",
            label: "文件上传",
            key: null,
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            dbInfos: [dbInfos[0]],
            watch: [],
        }
    },
    {
        name: "人员控件",
        icon: "icon-input",
        singleSwitch: false,
        options: {
            type: "choose-user",
            label: "人员控件",
            key: null,
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            watch: [],
            initValue: initValue,
            // value: value,
        }
    },
    {
        name: "部门控件",
        icon: "icon-input",
        options: {
            type: "choose-department",
            label: "部门控件",
            key: null,
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            watch: [],
            initValue: initValue,
            value: value,
        }
    },
    {
        name: "位置控件",
        icon: "icon-input",
        options: {
            type: "choose-area",
            label: "位置控件",
            key: null,
            tips: "",
            maxLength: null,
            readonly: readHideReq,
            hide: readHideReq,
            required: readHideReq,
            inputRules: [],
            dbInfos: dbInfos,
            initValue: initValue,
            watch: [],
            value: value
        }
    },
    {
        name: "子表控件",
        icon: "icon-input",
        inline: false,
        options: {
            type: "a-sub-list",
            label: "子表控件",
            readonly: readHideReq,
            hide: readHideReq,
            extend: {
                sublist: []
            }
        }
    },
    {
        name: "文本面板",
        icon: "icon-input",
        value: "",
        options: {
            type: "a-text-panel",
            label: "",

        }
    },
    {
        name: "隐藏字段",
        icon: "icon-input",
        options: {
            type: "hide-field",
            label: "隐藏字段",
            key: null,
            dbInfos: [dbInfos[0]],
            maxLength: null
        }
    },
    {
        name: "标签页",
        icon: "icon-input",
        tabValue: "",
        options: {
            type: "a-tab",
            child: [
                {v: "0", n: "标签1", list: []},
            ]
        }
    },
    {
        name: "标题分割线",
        icon: "icon-input",
        options: {
            type: "a-interval",
            label: "",
            initValue: initValue
        }
    },
    {
        name: "两列栅格",
        icon: "icon-input",
        options: {
            type: "l-row-2",
            child: [
                {key: "0", col: 12, list: []},
                {key: "1", col: 12, list: []},
            ]
        }
    },
    {
        name: "三列栅格",
        icon: "icon-input",
        options: {
            type: "l-row-3",
            child: [
                {key: "0", col: 8, list: []},
                {key: "1", col: 8, list: []},
                {key: "2", col: 8, list: []},
            ]
        }
    },
];


export {
    formComponents,
    validateRules,
    watchExpr,
}
