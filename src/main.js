/** 主入口js */
import {createApp} from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './config/axios-config';
import setting from './config/setting';
import permission from './utils/permission';
import './styles/u-common.scss';
import './styles/index.less';
import EleAdminPro from 'ele-admin-pro';
import ModalUtil from 'ele-admin-pro/packages/modal-util';
import i18n from './lang';

const app = createApp(App);
app.config.productionTip = false;
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.use(permission);
app.use(EleAdminPro, {
    response: {
        statusName: 'code',
        statusCode: 0,
        msgName: 'msg',  // 信息的字段名称，支持嵌套
        dataName: 'data.records',  // 数据列表的字段名称，支持嵌套，例如：result.list
        countName: 'data.total'  // 数据总数的字段名称，支持嵌套
    },
    request: {
        pageName: 'page',  // 页码的参数名称
        limitName: 'limit',  // 每页数据量的参数名
        sortName: 'sort',  // 排序字段参数名称
        orderName: 'order'  // 排序方式的参数名称
    }
});
app.use(ModalUtil);
app.use(i18n);
app.config.globalProperties.$setting = setting;
app.config.globalProperties.$baseUrl = process.env.BASE_URL
app.mount('#app');
