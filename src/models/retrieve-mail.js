import { retrievePassword, sendPassword } from '../services/api';

export default {
  namespace: 'RetrieveMail',
  state: {
    name: "",
    state: 0
  },

  effects: {
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
