import { message } from 'antd';
import {
  getResourceNum,
  getUserNum,
  getNotificationCount,
  getStandNum,
  getHomeStand,
  getHomeRank,
} from '../services/api';
import { getTimeByType } from '../utils/utils.js';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'home',

  state: {
    loading: false,
    resourceNum: { liveCount: 0, totalCount: 0 },
    userNum: { liveCount: 0, totalCount: 0 },
    notificationNum: { total: 0, unreadTotal: 0, viewTotal: 0 },
    standNum: { duration: 0, count: 0, rate: 0 },
    homeStand: [],
    homeRank: [],
  },

  effects: {
    *getResourceNum(_, { call, put }) {
      const response = yield call(getResourceNum);
      if (response && response.status === 'success') {
        yield put({ type: 'saveResourceNum', payload: response.data });
      } else {
        message.error(response.message || formatMessage({ id: "home.device.error" }));
      }
    },
    *getUserNum(_, { call, put }) {
      const response = yield call(getUserNum);
      if (response && response.status === 'success') {
        yield put({ type: 'saveUserNum', payload: response.data });
      } else {
        message.error(response.message || formatMessage({ id: "home.user.error" }));
      }
    },
    *getNotificationCount(_, { call, put }) {
      const response = yield call(getNotificationCount);
      if (response && response.status === 'success') {
        yield put({ type: 'saveNotificationNum', payload: response.data });
      } else {
        message.error(response.message || formatMessage({ id: "home.notice.error" }));
      }
    },
    *getStandNum(_, { call, put }) {
      const response = yield call(getStandNum);
      if (response && response.status === 'success') {
        yield put({ type: 'saveStandNum', payload: response.data });
      } else {
        message.error(response.message || formatMessage({ id: "home.stand.error" }));
      }
    },
    *getHomeStand({ payload }, { call, put }) {
      const response = yield call(getHomeStand, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveHomeStand', payload: response.data });
      } else {
        message.error(response.message || formatMessage({ id: "home.stand.error" }));
      }
    },
    *getHomeRank({ payload }, { call, put }) {
      const response = yield call(getHomeRank, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveHomeRank', payload: response.data.rank });
      } else {
        message.error(response.message || formatMessage({ id: "home.stand.rate.error" }));
        yield put({ type: 'saveHomeRank', payload: [] });
      }
    },
  },

  reducers: {
    saveResourceNum(state, { payload }) {
      return { ...state, resourceNum: payload };
    },
    saveUserNum(state, { payload }) {
      return { ...state, userNum: payload };
    },
    saveNotificationNum(state, { payload }) {
      return { ...state, notificationNum: payload[0] };
    },
    saveStandNum(state, { payload }) {
      return { ...state, standNum: payload };
    },
    saveHomeStand(state, { payload }) {
      const homeStand = payload.datalist.map(item => {
        const x = getTimeByType(item.datetime || item.index, payload.type);
        const y = Number((item.duration / 60).toFixed(2));
        return { x, y };
      });
      return { ...state, homeStand };
    },
    saveHomeStand2(state, { payload }) {
      return { ...state, homeStand: payload };
    },
    saveHomeRank(state, { payload }) {
      return { ...state, homeRank: payload };
    },
  },
};
