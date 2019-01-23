// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import queryError from '@/services/error';

export default {
  namespace: 'error',

  state: {
    error: '',
    isloading: false,
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield call(queryError, payload.code);
      yield put({
        type: 'trigger',
        payload: payload.code,
      });
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload,
      };
    },
  },
};
