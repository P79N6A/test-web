// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { sendEmail } from '@/services/api';

export default {
  namespace: 'RetrievePassword',
  state: {
    email: "",
    page: 0,
  },

  effects: {
    *sendEmail({ payload }, { call }) {
      const response = yield call(sendEmail, payload);
      payload.callback(response);
    },
  },

  reducers: {
    emailSave(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
