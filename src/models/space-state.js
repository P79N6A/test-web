import { getSvg, getDeskState } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'spaceState',
  state: {
    svg: '',
    data: ""
  },

  effects: {
    // 获取 svg 图 url 以及 svg 唯一标识
    *getSvg({ payload }, { call, put }) {
      const response = yield call(getSvg, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        yield put({ type: 'saveSvg', payload: response.data });
      } else {
        message.error(response.message || 'error');
      };
    },
    *getDeskState({ payload }, { call, put }) {
      const response = yield call(getDeskState, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
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
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    }
  },
};
