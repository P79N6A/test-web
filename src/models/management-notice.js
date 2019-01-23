// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { message } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import { getNoticeList, getNoticeState, sendNotice, topNotice } from '@/services/api';
import G from '@/global';

export default {
  namespace: 'ManagementNotice',

  state: {
    data: {
      row: [],
      offset: 0,
      current: 1,
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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取通知的状态
    *getNoticeStat({ payload }, { call, put }) {
      const response = yield call(getNoticeState, payload);
      payload.callback(response);
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
        message.success(response.message || formatMessage({ id: 'all.operate.success' }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
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
          current: Number(offset) / 15 + 1,
          limit: state.data.limit,
        },
      };
    },
    changeCurrent(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
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
