import that from './../../main'
//提醒框
function toastInfo(text, type) {
    that.$Message[type](text)
}
//递归排序树型结构
function sortFileData(data, parentId) {
    let convertData = [];
    data.forEach(item => {
        if(item.pid === parentId) {
            item['label'] = item.n;
            item['value'] = item.v;
            convertData.push(item);
            convertChild(data, item, item.id)
        }
    });
    return convertData;
}
function convertChild(arr, parentItem, parentId) {
    parentItem.children = parentItem.children ? parentItem.children : [];
    arr.forEach(item => {
        if(item.pid === parentId) {
            item['label'] = item.n;
            item['value'] = item.v;
            parentItem.children.push(item);
            convertChild(arr, item, item.id)
        }
    });
    return parentItem.children;
}
//格式化字段接口数据
function formatFiedlsData(data){
    let arr = [];
    let label = "";
    let children = [];
    data.forEach(item => {
        children = item.columns;
        if(item.relationType === 'one_to_many') {
            label = item.alias + '(' +item.entityName + ')多';
        } else {
            label = item.alias + '(' +item.entityName + ')';
        }
        children.forEach((child, index) => {
            children[index]['value'] = child.colId;
            children[index]['label'] = child.colCname;
        });
        arr.push({
            label: label,
            value: item.tableId,
            children: children
        })
    });
    return arr;
}

//去除标签
function delHtmlTag(str){
    return str.replace(/<\/?.+?>/g, "")
}
function HTMLDecode(text) {
    let temp = document.createElement("div");
    temp.innerHTML = text;
    let output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}
//获取组件的默认值类型
function getModelDb(type){
    let db = {};
    if(type === 'checkbox' || type === 'checkbox-dropdown' || type === 'cascade' || type === 'file-upload' || type === 'choose-area' || type === 'icon-input' || type === 'choose-department' || type === 'choose-user') {
        db.primary = [];
        db.assist = [];
    } else {
        db.primary = "";
        db.assist = "";
    }
    return db;
}

//树遍历赋值
function mapTree(params){
    function mapChildren(params){
        let {data, callback} = params;
        data.forEach(item => {
            callback(item);
            if(item.children && item.children.length > 0) {
                mapChildren({
                    callback: callback,
                    data: item.children
                });
            }
        })
    }
    mapChildren(params);
    return params.data;
}

function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            return true;
        } catch(e) {
            return false;
        }
    }
}
export default {
    toastInfo,
    sortFileData,
    formatFiedlsData,
    delHtmlTag,
    HTMLDecode,
    getModelDb,
    mapTree,
    isJSON_test,
}
