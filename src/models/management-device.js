import { message } from 'antd';
import { getResourceList, addRemark, releaseDevice, removeDevice } from '../services/api';
import { formatMessage, getLocale } from 'umi/locale';
import G from '@/global';

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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *addRemark({ payload }, { call }) {
      const response = yield call(addRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data);
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *release({ payload }, { call }) {
      const response = yield call(releaseDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "device.untie.success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "device.remove.success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
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
