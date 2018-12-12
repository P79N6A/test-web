import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login } from '@/services/api';
import { setAuthority, setUserInfo, getUserInfo } from '@/utils/authority';
import { getPageQuery, isJSON } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
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
      } else if (typeof response.message === 'object') {
        message.error(formatMessage({ id: "login.error" }));
      } else {
        message.error(response.message || formatMessage({ id: "login.error" }));
      }
    },
    *autoLogin({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.status === 'success') {
        yield put({
          type: 'user/saveUser',
          payload: response.data,
        });
      } else if (typeof response.message === 'object') {
        message.error('登录失败！');
      } else {
        message.error(response.message || '登录失败！');
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
      if (payload.redirect) {
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
  },
};
