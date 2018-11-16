import { message } from 'antd';
import { getCustomerList, addCustomer, editCustomer, resetPassword } from '../services/api';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'ManagementCustomer',
  state: {
    data: {
      rows: [],
      offset: 0,
      current: 1,
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
        message.error(response.message || formatMessage({ id: "customer.quest.error" }));
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
        message.success(response.data);
      } else {
        message.error(response.message || formatMessage({ id: "customer.reset.password.error" }));
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
          current: Number(offset) / 15 + 1,
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
