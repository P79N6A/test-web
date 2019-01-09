import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, getSidebarList } from '@/services/api';
import { setAuthority, setUserInfo, getUserInfo, setSidebar } from '@/utils/authority';
import { isJSON } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import { getLocale } from 'umi/locale';
import G from '@/global';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    sidebarList: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      payload.callback(response);
      // Login successfully
      if (response.status === 'success') {
        let user = {};
        if (isJSON(getUserInfo())) user = JSON.parse(getUserInfo());
        // 获取 session 中缓存的 user 信息，保存之前登录 user 中 autoLogin 属性。
        yield put({
          type: 'changeLoginStatus',
          payload: { data: { ...user, ...response.data }, status: response.status },
        });
        yield put({
          type: 'user/saveUser',
          payload: response.data,
        });
        reloadAuthorized();
        if (payload.redirect) {
          yield put(routerRedux.replace(payload.redirect));
        } else {
          yield put(routerRedux.replace('/home'));
        }
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *autoLogin({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.status === 'success') {
        yield put({
          type: 'user/saveUser',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *logout({ payload = {} }, { call, put }) {
      if (payload.tokenExpired) {
        yield put({ type: 'logoutWithoutToken', payload });
        return;
      }
      const response = yield call(logout);
      if (response.status === 'success') {
        yield put({ type: 'logoutWithoutToken' });
      }
    },
    *logoutWithoutToken({ payload }, { put }) {
      const authority = localStorage.getItem('antd-pro-authority') || 'user';
      let path = '/user/login';
      if (authority === 'admin') {
        path = '/admin_user/login';
      }
      if (payload && payload.redirect) {
        path = payload.redirect;
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          data: {
            status: false,
            currentAuthority: 'guest',
          },
        },
      });
      yield put({
        type: 'user/user',
        payload: {},
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: path,
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    // 获取侧边栏
    *getSidebarList(_, { call, put }) {
      const response = yield call(getSidebarList);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveSidebar',
          payload: response.data,
        });
        setSidebar(response.data);
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // 会话存储权限以及登录姓名等
      setAuthority(payload.data.currentAuthority || 'user');
      setUserInfo(payload.data);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    // 保存侧边栏列表
    saveSidebar(state, action) {
      return {
        ...state,
        sidebarList: action.payload,
      };
    },
  },
};
