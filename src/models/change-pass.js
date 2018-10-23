import { changePassword } from '../services/api';

export default {
  namespace: 'ChangePass',
  state: {
    oldPassword: '',
    newPassword: '',
    newsPassword: '',
  },

  effects: {
    *changePassword({ payload }, { call }) {
      const response = yield call(changePassword, payload);
      payload.callback(response);
    },
  },

  reducers: {},
};
