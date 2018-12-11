import { message } from 'antd';
import { getDeviceStatus } from '@/services/api';

export default {
  namespace: 'spacex',

  state: {},

  effects: {
    *getDeviceStatus({ payload }, { call }) {
      const response = yield call(getDeviceStatus, payload.tags);
      payload.callback(response.data);
    },
  },

  reducers: {},
};
