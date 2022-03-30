/**
 * vuex状态管理
 */
import {createStore} from 'vuex';
import getters from './getters';
import user from './modules/user';
import theme from './modules/theme';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    theme
  },
  getters
});
