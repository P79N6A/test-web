import { message } from 'antd';
import { sendEmail } from '../services/api';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'RetrievePassword',
  state: {
    email: "",
    page: 0
  },

  effects: {
    *sendEmail({ payload }, { call }) {
      const response = yield call(sendEmail, payload);
      payload.callback(response);
    },
  },

  reducers: {
    emailSave(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  },
};