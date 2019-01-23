// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { getSvg, getDeskState } from '@/services/api';
import { message } from 'antd';
import G from '@/global';
import { getLocale } from 'umi/locale';

export default {
  namespace: 'spaceState',
  state: {
    svg: '',
    data: '',
  },

  effects: {
    // 获取 svg 图 url 以及 svg 唯一标识
    *getSvg({ payload }, { call, put }) {
      const response = yield call(getSvg, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        yield put({ type: 'saveSvg', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      };
    },
    *getDeskState({ payload }, { call, put }) {
      const response = yield call(getDeskState, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
  },

  reducers: {
    saveSvg(state, action) {
      return {
        ...state,
        svg: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
