import {
  getDeviceStatus,
  getDemoDeviceStatus,
  createDevice,
  getServiceHour,
  getYesterdayData,
  getWorkStation,
  getUsingHour,
  getUsingRanking,
} from '@/services/mockApi';

const data = [];
for (let i = 0; i < 30; i++) {
  data.push({ type: 'offline', time: i + 1, value: 1 });
  data.push({ type: 'vacant', time: i + 1, value: 0 });
  data.push({ type: 'occupied', time: i + 1, value: 0 });
}

export default {
  namespace: 'globalStatus',

  state: {
    serviceHour: {
      total: 0,
      occupied: 0,
      vacant: 0,
    },
    yesterdayData: {
      occupiedCount: 0,
      occupiedRise: 0,
      occupiedDecline: 0,
      vacantCount: 0,
      vacantRise: 0,
      vacantDecline: 0,
    },
    workStation: data,
    usingHour: [],
    usingRanking: [],
  },

  effects: {
    *getDeviceStatus({ payload }, { call }) {
      const response = yield call(getDeviceStatus, payload.tags);
      payload.callback(response && response.data);
    },
    *getDemoDeviceStatus({ payload }, { call }) {
      const response = yield call(getDemoDeviceStatus, payload.tags);
      payload.callback(response.data);
    },
    *getServiceHour(_, { call, put }) {
      const response = yield call(getServiceHour);
      if (response.status === 'success') {
        yield put({
          type: 'saveServiceHour',
          payload: response,
        });
      }
    },
    *getYesterdayData(_, { call, put }) {
      const response = yield call(getYesterdayData);
      if (response.status === 'success') {
        yield put({
          type: 'saveYesterdayData',
          payload: response,
        });
      }
    },
    *getWorkStation(_, { call, put }) {
      const response = yield call(getWorkStation);
      if (response.status === 'success') {
        yield put({
          type: 'saveWorkStation',
          payload: response,
        });
      }
    },
    *getUsingHour({ payload }, { call, put }) {
      const response = yield call(getUsingHour, payload);
      if (response.status === 'success') {
        yield put({
          type: 'saveUsingHour',
          payload: response,
        });
      }
    },
    *getUsingRanking({ payload }, { call, put }) {
      const response = yield call(getUsingRanking, payload);
      if (response.status === 'success') {
        yield put({
          type: 'saveUsingRanking',
          payload: response,
        });
      }
    },
    *createDevice({ payload }, { call }) {
      yield call(createDevice, payload);
    },
  },

  reducers: {
    saveServiceHour(state, { payload }) {
      return {
        ...state,
        serviceHour: payload.data,
      };
    },
    saveYesterdayData(state, { payload }) {
      return {
        ...state,
        yesterdayData: payload.data,
      };
    },
    saveWorkStation(state, { payload }) {
      return {
        ...state,
        workStation: payload.data,
      };
    },
    saveUsingHour(state, { payload }) {
      return {
        ...state,
        usingHour: payload.data,
      };
    },

    saveUsingRanking(state, { payload }) {
      return {
        ...state,
        usingRanking: payload.data,
      };
    },
  },
};
