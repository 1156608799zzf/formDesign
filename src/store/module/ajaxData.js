import {
    FORM_DESIGNER,
    SQL_LIST,
    SYS_VAR_LIST,
    TABLE_FIELDS,
} from '../mutation-types'


const state = {
    formDesigner: "",
    sqlList: "",
    sysVarList: "",
    tableFields: []
};


const getters = {
    getFormDesigner: state => state.formDesigner,
    getSqlList: state => state.sqlList,
    getSysVarList: state => state.sysVarList,
    getTableFields: state => state.tableFields,
};

const mutations = {
    [FORM_DESIGNER](state, info) {
        state.formDesigner = info;
    },
    [SQL_LIST](state, info) {
        state.sqlList = info;
    },
    [SYS_VAR_LIST](state, info) {
        state.sysVarList = info;
    },
    [TABLE_FIELDS](state, info) {
        state.tableFields = info;
    }
};

const actions = {
    formDesigner: ({commit}, info) => commit(FORM_DESIGNER, info),
    sqlList: ({commit}, info) => commit(SQL_LIST, info),
    sysVarList: ({commit}, info) => commit(SYS_VAR_LIST, info),
    tableFields: ({commit}, info) => commit(TABLE_FIELDS, info),
};
export default {
    state,
    getters,
    mutations,
    actions
}
