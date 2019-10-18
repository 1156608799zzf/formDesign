import Vue from 'vue'
import Vuex from 'vuex'
import ajaxData from './module/ajaxData'
Vue.use(Vuex);

const store = new Vuex.Store({
    namespaces: true,
    modules: {
        ajaxData
    }
});

export default store;
