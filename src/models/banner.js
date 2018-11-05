import { getNoticeList, getBannerList, getDefaultBannerList, addBanner, bannerPublish } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'Banner',
  state: {
    bannerAdd: {
      visible: false,
      bannerSrc: '',
      type: 0,
      bannerUrl: '',
      title: ''
    },
    noticeData: {
      row: [],
      offset: 0,
      current: 1,
      limit: 6,
    },
    bannerList: '',
    defaultBannerList: ''
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
        message.error(response.message);
      }
    },
    *getBanner(_, { call, put }) {
      const response = yield call(getBannerList);
      if (response && response.status === 'success') {
        yield put({ type: 'saveBannerList', payload: response.data });
      } else {
        message.error(response.message || 'error');
      }
    },
    *getDefaultBanner(_, { call, put }) {
      const response = yield call(getDefaultBannerList);
      if (response && response.status === 'success') {
        yield put({ type: 'saveDefaultBannerList', payload: response.data });
      } else {
        message.error(response.message || 'error');
      }
    },
    *addBanner({ payload }, { call }) {
      const response = yield call(addBanner, payload);
      payload.callback(response);
    },
    *bannerPublish(_, { call, put }) {
      const response = yield call(bannerPublish);
      if (response && response.status === 'success') {
        message.success('发布成功');
      } else {
        message.error(response.message || 'error');
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
        bannerList: action.payload
      }
    },
    saveDefaultBannerList(state, action) {
      return {
        ...state,
        defaultBannerList: action.payload
      }
    },
    // 控制弹窗内容
    changeVisible(state, { payload }) {
      return {
        ...state,
        bannerAdd: {
          ...state.bannerAdd,
          ...payload
        }
      }
    }

  }
};
