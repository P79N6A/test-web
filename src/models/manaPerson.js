import { message } from 'antd';
import { getPersonnelList, addPerson, updatePerson } from '../services/api';

export default {
  namespace: 'manaPerson',
  state: {
    data: {
      rows: [],
      offset: 1,
      limit: 15,
    },
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
        message.success(response.data.data.msg);
      } else {
        const { errors } = response.message;
        if (!errors[0]) {
          return message.error('添加失败');
        }
        message.error(`${errors[0].field} ${errors[0].message}`);
      }
    },
    *updatePerson({ payload }, { call }) {
      const response = yield call(updatePerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(payload.isDel ? '删除成功' : '修改成功');
      } else {
        const { errors } = response.message;
        if (!errors[0]) {
          return message.error(payload.isDel ? '删除失败' : '修改失败');
        }
        message.error(`${errors[0].field} ${errors[0].message}`);
      }
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
          limit: state.data.limit,
        },
      };
    },
  },
};
