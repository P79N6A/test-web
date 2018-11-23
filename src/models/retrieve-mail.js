import { message } from 'antd';
import { getName, retrievePassword, sendPassword } from '../services/api';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'RetrieveMail',
  state: {
    name: "",
    state: 0
  },

  effects: {
    *getName({ payload }, { call, put }) {
      const response = yield call(getName, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveId',
          payload: response.data,
        });
      } else {
        message.error("请刷新页面重试！");
      }
    },
    *retrievePassword({ payload }, { call }) {
      const response = yield call(retrievePassword, payload);
      payload.callback(response);
    },
    *sendPassword({ payload }, { call }) {
      const response = yield call(sendPassword, payload);
      payload.callback(response);
    },
  },

  reducers: {
    saveId(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  },
};
