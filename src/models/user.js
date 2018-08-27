export default {
  namespace: 'user',

  state: {
    user: {},
  },

  effects: {
    *user({ payload }, { call, put }) {
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
