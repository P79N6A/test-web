import { getSvg, getDeskState } from '../services/api';

export default {
  namespace: 'spaceState',
  state: {
    svg: ''
  },

  effects: {
    // 获取 svg 图 url 以及 svg 唯一标识
    *getSvg(_, { call, put }) {
      const response = yield call(getSvg);
      if (response && response.status === 'success') {
        yield put({ type: 'saveSvg', payload: response.data });
      } else {
        message.error(response.message || 'error');
      };
    },
    *getDeskState({ payload }, { call, put }) {
      const response = yield call(getDeskState, payload);
      payload.callback(response.data);
      if (response && response.status === 'success') {

      } else {
        message.error(response.message || 'error');
      }
    }
  },

  reducers: {
    saveSvg(state, action) {
      return {
        ...state,
        svg: action.payload,
      };
    }
  },
};
