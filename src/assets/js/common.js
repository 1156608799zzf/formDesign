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
        if(item.tableType === 'child') {
            label = item.entityName + '(' +item.relationType + ')';
        } else {
            label = item.entityName;
        }
        children.forEach((child, index) => {
            children[index]['value'] = child.colName;
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
export default {
    toastInfo,
    sortFileData,
    formatFiedlsData,
}
