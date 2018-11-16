import { message } from 'antd';
import { getPersonnelList, addPerson, updatePerson, getQiniuToken } from '../services/api';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'ManagementPerson',
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
        message.error(formatMessage({ id: "customer.quest.error" }));
      }
    },
    *addPerson({ payload }, { call }) {
      const response = yield call(addPerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.message || formatMessage({ id: "customer.add.success" }));
      } else {
        message.error(response.message || formatMessage({ id: "customer.add.fail" }));
      }
    },
    *updatePerson({ payload }, { call }) {
      const response = yield call(updatePerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data || formatMessage({ id: "customer.successfully.modified" }));
      } else {
        message.error(response.message || formatMessage({ id: "customer.fail.to.edit" }));
      }
    },
    *getQiniuToken({ payload }, { call }) {
      const response = yield call(getQiniuToken, payload);
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
