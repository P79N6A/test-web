import { message } from 'antd';
import { getResourceList, addRemark, releaseDevice } from '../services/api';

export default {
  namespace: 'manaEquip',
  state: {
    data: {
      rows: [],
      offset: 1,
      limit: 15,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getResourceList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'equipSave',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'equipdel',
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
        const { errors } = response.message;
        if (!errors[0]) {
          return message.error('添加失败');
        }
        message.error(`${errors[0].field} ${errors[0].message}`);
      }
    },
    *release({ payload }, { call }) {
      const response = yield call(releaseDevice, payload);
      payload.callback();
      if (response && response.status === 'success') {
        message.success('解绑成功');
      } else {
        message.error('解绑失败' && (response && response.message));
      }
    },
  },

  reducers: {
    equipSave(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        data: {
          ...action.payload,
          offset: Number(offset),
          limit: state.data.limit,
        },
      };
    },
    equipdel(state) {
      return {
        ...state,
        data: {
          rows: [],
          offset: 1,
          limit: 15,
        },
      };
    },
  },
};
