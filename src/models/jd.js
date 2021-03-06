// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { deviceTwins } from '@/services/api';
import { message } from 'antd';
import { getLocale } from 'umi/locale';

export default {
  namespace: 'Jd',
  state: {
    data: '',
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(deviceTwins);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
