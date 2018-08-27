import { getNoticeList, sendNotice } from '../services/api';
import G from '../gobal';

export default {
  namespace: 'manaNotice',

  state: {
    noticeList: [],
    copyValue: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getNoticeList, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *sendNotice({ payload }, { call, put }) {
      const response = yield call(sendNotice, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'add',
          payload,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      if (state.noticeList.length > 0) {
        // 临时处理
        return state;
      }
      return {
        ...state,
        noticeList: action.payload,
      };
    },
    add(state, action) {
      // 临时添加
      const newList = state.noticeList;
      newList.unshift({
        ...action.payload,
        id: G.moment().unix(),
        noticeId: G.moment().unix(),
        createdAt: G.moment().format('MM/DD  hh:mm'),
        topping: false,
      });
      return {
        ...state,
        noticeList: newList,
      };
    },
    setCopyValue(state, action) {
      return {
        ...state,
        copyValue: action.payload,
      };
    },
  },
};
