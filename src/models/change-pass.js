// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { changePassword } from '@/services/api';

export default {
  namespace: 'ChangePass',
  state: {
    oldPassword: '',
    newPassword: '',
    newsPassword: '',
  },

  effects: {
    *changePassword({ payload }, { call }) {
      const response = yield call(changePassword, payload);
      payload.callback(response);
    },
  },

  reducers: {},
};
