// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { getDeviceStatus } from '@/services/api';

export default {
  namespace: 'spacex',

  state: {},

  effects: {
    *getDeviceStatus({ payload }, { call }) {
      const response = yield call(getDeviceStatus, payload.tags);
      payload.callback(response && response.data);
    },
  },

  reducers: {},
};
