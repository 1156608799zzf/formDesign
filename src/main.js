// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/iconfont/iconfont.css'
import './assets/css/common.scss'
import axios from './axios/axios'
import common from './assets/js/common'
import store from './store'
import _ from 'lodash'
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.GLOBAL = common;
Vue.prototype._ = _;

//事件总线
var eventBus = {
    install(Vue, options) {
        Vue.prototype.$bus = new Vue();
    }
};
Vue.use(iView);
Vue.use(eventBus);
/* eslint-disable no-new */
let that = new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
export default that
