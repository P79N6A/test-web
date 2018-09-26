import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login } from '@/services/api';
import { setAuthority, setUserInfo, getUserInfo } from '@/utils/authority';
import { getPageQuery, isJSON } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

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
        yield put(routerRedux.replace('/'));
      } else if (typeof response.message === 'object') {
        message.error('登录失败！');
      } else {
        message.error(response.message || '登录失败！');
      }
    },
    *logout({ payload = {} }, { call, put }) {
      if (payload.tokenExpired) {
        message.error('登录信息过期');
        yield put({ type: 'logoutWithoutToken' });
        return;
      }
      const response = yield call(logout);
      if (response.status === 'success') {
        yield put({ type: 'logoutWithoutToken' });
      }
    },
    *logoutWithoutToken(_, { put }) {
      const authority = localStorage.getItem('antd-pro-authority') || 'user';
      let path = '/user/login';
      if (authority === 'admin') {
        path = '/admin_user/login';
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
