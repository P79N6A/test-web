import { message } from 'antd';
import { getResourceList, addRemark, releaseDevice, removeDevice } from '../services/api';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'ManagementDevice',
  state: {
    data: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getResourceList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'deviceSave',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'deviceDel',
          payload: '',
        });
        message.error(response.message || formatMessage({ id: "spaceUsage.none" }));
      }
    },
    *addRemark({ payload }, { call }) {
      const response = yield call(addRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data);
      } else {
        message.error(response.message || formatMessage({ id: "all.operate.fail" }));
      }
    },
    *release({ payload }, { call }) {
      const response = yield call(releaseDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "device.untie.success" }));
      } else {
        message.error(response.message || formatMessage({ id: "device.untie.fail" }));
      }
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "device.remove.success" }));
      } else {
        message.error(response.message || formatMessage({ id: "device.remove.fail" }));
      }
    }
  },

  reducers: {
    deviceSave(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        data: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.data.limit,
        },
      };
    },
    deviceDel(state) {
      return {
        ...state,
        data: {
          rows: [],
          offset: 0,
          current: 1,
          limit: 15,
        },
      };
    },
  },
};
