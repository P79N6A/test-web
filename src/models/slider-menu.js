import { getSliderMenu } from '../services/api';

export default {
  namespace: 'sliderMenu',
  state: {
    menuLists: '',
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getSliderMenu);
      if (response && response.status === 'success') {
        yield put({ type: 'saveMenu', payload: response.data });
      } else {
        message.error(response.message || 'error');
      }
    }
  },

  reducers: {
    saveMenu(state, action) {
      return {
        ...state,
        menuLists: action.payload,
      };
    },
  },
};
