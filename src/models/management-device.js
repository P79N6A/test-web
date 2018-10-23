import { message } from 'antd';
import { getResourceList, addRemark, releaseDevice, removeDevice } from '../services/api';

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
        message.error(response.message || '暂无数据');
      }
    },
    *addRemark({ payload }, { call }) {
      const response = yield call(addRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data);
      } else {
        message.error(response.message || '操作失败');
      }
    },
    *release({ payload }, { call }) {
      const response = yield call(releaseDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success('解绑成功');
      } else {
        message.error(response.message || '解绑失败');
      }
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success('移除成功');
      } else {
        message.error(response.message || '移除失败');
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
