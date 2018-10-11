import { message } from 'antd';
import { getPersonnelList, addPerson, updatePerson, getqiniuToken } from '../services/api';

export default {
  namespace: 'manaPerson',
  state: {
    data: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    qiniuToken: ''
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPersonnelList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求失败');
      }
    },
    *addPerson({ payload }, { call }) {
      const response = yield call(addPerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.message || '添加成功');
      } else {
        message.error(response.message || '添加失败');
      }
    },
    *updatePerson({ payload }, { call }) {
      const response = yield call(updatePerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data || '修改成功');
      } else {
        message.error(response.message || '修改失败');
      }
    },
    *getqiniuToken({ payload }, { call }) {
      const response = yield call(getqiniuToken, payload);
      payload.callback(response);
    },
  },

  reducers: {
    save(state, action) {
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
    }
  },
};
