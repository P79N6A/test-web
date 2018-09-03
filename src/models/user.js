export default {
  namespace: 'user',

  state: {
    user: {
      token: '',
      name: 'Guest',
      avatar: '',
    },
  },

  effects: {
    *user({ payload }, { put }) {
      yield put({
        type: 'saveUser',
        payload,
      });
    },
  },

  reducers: {
    saveUser(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
  },
};
