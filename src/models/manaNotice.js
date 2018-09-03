import { message } from 'antd';
import { getNoticeList, sendNotice, topNotice } from '../services/api';
import G from '../gobal';

export default {
  namespace: 'manaNotice',

  state: {
    data: {
      row: [],
      offset: 1,
      limit: 15,
    },
    copyValue: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getNoticeList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(response.err.message);
      }
    },

    // 发送通知
    *sendNotice({ payload }, { call }) {
      const response = yield call(sendNotice, payload);
      payload.callback(response);
    },

    // 置顶消息通知
    *topNotice({ payload }, { call }) {
      const response = yield call(topNotice, payload);
      if (response && response.status === 'success') {
        message.success('操作成功');
      } else {
        message.error(response.err.message);
      }
      payload.callback(response);
    },
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        data: {
          ...action.payload,
          offset: Number(offset),
          limit: state.data.limit,
        },
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
