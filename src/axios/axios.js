import axios from "axios";
import that from "./../main";
import qs from "qs";

const baseURL = "http://form.vipgz2.idcfengye.com/api/";
//文件上传参数
const uploadURL = "uploadFile";
const uploadName = "info_file";

//请求拦截器
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
//返回拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.message && error.message.includes("timeout")) {
            that.GLOBAL.toastInfo("请求超时，请检查网络或稍候重试！", "error");
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

//过滤空值及转换
function filterEmptyData(params) {
    let value;
    if (params instanceof Object) {
        for (let i in params) {
            value = params[i];
            if (
                (value === null ||
                    value === "" ||
                    value === undefined ||
                    value === "undefined") &&
                value !== 0
            ) {
                delete params[i];
            }
            if (value instanceof Array && value.length > 0) {
                params[i] = value.join(",");
            }
        }
    }
    return params;
}

function ajax(options) {
    //是否需要加载
    let isLoading = options.data && options.data.loading ? options.data.loading : false;
    if (isLoading) {
        that.$Spin.show();
    }
    return new Promise((resolve, reject) => {
        axios({
            baseURL: baseURL,
            url: options.url,
            data: qs.stringify(
                filterEmptyData(
                    options.data && options.data.params
                        ? options.data.params
                        : ""
                )
            ),
            timeout: 10000,
            method: options.method ? options.method : "post"
        }).then(res => {
            let data = res.data;
            let code = data.code;
            //关闭加载
            if (isLoading) {
                that.$Spin.hide();
            }
            console.warn(data);
            if (res.status === 200 && code === 0) {
                resolve(data);
            } else {
                let message = data.message;
                that.GLOBAL.toastInfo(message, 'error');
                reject();
            }
        }).catch(err => {
            //关闭加载
            if (isLoading) {
                that.$Spin.hide();
            }
            reject(err);
        });
    });
}

//获取数据字典列表
function getFormDesigner() {
    return new Promise((resolve, reject) => {
        ajax({
            url: "general/dicts/form-designer",
            method: "get"
        }).then(res => {
            let data = res.data;
            that.$store.dispatch('formDesigner', data);
            resolve(res);
        })
    })
}

//获取自定义 sql 列表
function getSqlAllByUseForOfDictItemCode(options) {
    return new Promise((resolve, reject) => {
        ajax({
            url: "general/sqlManage/getSqlAllByUseForOfDictItemCode",
            params: options.params ? options.params : null,
            method: "get"
        }).then(res => {
            let data = res.data;
            that.$store.dispatch('sqlList', data);
            resolve(res);
        })
    })
}

//获取系统变量列表
function getSysVarList() {
    return new Promise((resolve, reject) => {
        ajax({
            url: "general/dicts/fixed/system-variable",
            method: "get"
        }).then(res => {
            let data = res.data;
            that.$store.dispatch('sysVarList', data);
            resolve(res);
        })
    });
}

//获取表字段列表
function getTableFiedls(params) {
    ajax({
        url: "general/business/table-data/1182945651466436609",
        method: "get"
    }).then(res => {
        let data = that.GLOBAL.formatFiedlsData(res.data);
        that.$store.dispatch('tableFields', data);
    })
}

export default {
    ajax,
    baseURL,
    uploadURL,
    uploadName,
    getFormDesigner,
    getSqlAllByUseForOfDictItemCode,
    getSysVarList,
    getTableFiedls,
};
