import { getNoticeList, getBannerList, getDefaultBannerList, addBanner, bannerPublish, delBanner, sortBanner } from '@/services/api';
import { message } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import G from '@/global';

export default {
  namespace: 'Banner',
  state: {
    bannerAdd: {
      visible: false,
      bannerSrc: '',
      type: 0,
      bannerUrl: '',
      title: '',
    },
    noticeData: {
      row: [],
      offset: 0,
      current: 1,
      limit: 6,
    },
    bannerList: '',
    defaultBannerList: '',
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
    *getBanner(_, { call, put }) {
      const response = yield call(getBannerList);
      if (response && response.status === 'success') {
        yield put({ type: 'saveBannerList', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *getDefaultBanner(_, { call, put }) {
      const response = yield call(getDefaultBannerList);
      if (response && response.status === 'success') {
        yield put({ type: 'saveDefaultBannerList', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *addBanner({ payload }, { call }) {
      const response = yield call(addBanner, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "customer.operate.add-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *bannerPublish({ payload }, { call }) {
      const response = yield call(bannerPublish, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "banner.send-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *delBanner({ payload }, { call }) {
      const response = yield call(delBanner, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "banner.delete-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *sortBanner({ payload }, { call }) {
      const response = yield call(sortBanner, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "banner.move-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        noticeData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 6 + 1,
          limit: state.noticeData.limit,
        },
      };
    },
    saveBannerList(state, action) {
      return {
        ...state,
        bannerList: action.payload,
      }
    },
    saveDefaultBannerList(state, action) {
      return {
        ...state,
        defaultBannerList: action.payload,
      }
    },
    // 控制弹窗内容
    changeVisible(state, { payload }) {
      return {
        ...state,
        bannerAdd: {
          ...state.bannerAdd,
          ...payload,
        },
      }
    },
  },
};
