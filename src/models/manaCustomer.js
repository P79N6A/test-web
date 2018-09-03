import { message } from 'antd';
import { getCustomerList, addCustomer, editCustomer, resetPassword } from '../services/api';

export default {
  namespace: 'manaCustomer',
  state: {
    data: {
      rows: [],
      offset: 1,
      limit: 15,
    },
    editValue: '',
    companyId: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCustomerList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error('请求失败');
      }
    },
    *addCustomer({ payload }, { call }) {
      const response = yield call(addCustomer, payload);
      payload.callback(response);
    },
    *editCustomer({ payload }, { call }) {
      const response = yield call(editCustomer, payload);
      payload.callback(response);
    },
    *resetPassword({ payload }, { call }) {
      const response = yield call(resetPassword, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data.msg);
      } else {
        const { errors } = response.message;
        if (!errors[0]) {
          return message.error('重置密码失败');
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
    setEditValue(state, action) {
      return {
        ...state,
        editValue: action.payload,
      };
    },
    setcompanyId(state, { payload }) {
      return {
        ...state,
        companyId: payload,
      };
    },
  },
};
