import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import G from '@/global';
import {
  getDeskCount,
  getYuseCount,
  getAvgDuration,
  getUseRate,
  getServiceDuration,
  getDeskUseRank,
} from '../services/api';

const types = {
  WEEKLY: 'd',
  MONTHLY: 'D',
  YEARLY: 'M',
};

export default {
  namespace: 'office',
  state: {
    loading: false,
    daskTotalCount: { total_count: 0, online_count: 0, offline_count: 0 },

    yesterdayUseCount: {
      useCount: 0, // 昨日只使用数
      unuseCount: 0, // 昨日未使用数
      peakCount: 0, // 昨日使用峰值
      peakTime: '2018-09-11T20:10:54+08:00', // 昨日使用峰值时间
      useWeekRate: 100, // 昨日使用数周同比
      useWeekState: 'up', // 昨日使用数周同比下降
      useDayRate: 100, // 昨日使用数日环比
      useDayState: 'up', // 昨日使用数日环比上升
      unuseWeekRate: 100, // 昨日未使用数周同比
      unuseWeekState: 'up', // 昨日未使用数周同比上升
      unuseDayRate: 100, // 昨日未使用数日环比
      unuseDayState: 'up', // 昨日未使用数日环比下降
    },
    resourceNum: { liveCount: 0, totalCount: 0 },
    useRate: {
      data: [],
      type: '',
    },
    serviceDuration: {
      total_duration: 0, // 总时长 单位：分钟
      occupied_duration: 0, // 占用总时长
      vacant_duration: 0, // 空闲总时长
      offline_duration: 0, // 离线总时长
    },
    homeRank: [],
    // 工位使用时长
    deskAvgDuration: {
      condition_type: 'HOURLY',
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [],
    },
    // 热门工位排行
    deskUseRank_hot: {
      status_type: 'HOT',
      condition_type: 9,
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [],
    },
    // 空闲工位排行
    deskUseRank_free: {
      status_type: 'FREE',
      condition_type: 9,
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [],
    },
  },

  effects: {
    *checkLoginStatus({ payload }, { call, put }) {
      const response = yield call(getDeskCount);
      payload.callback && payload.callback(response);
    },
    *getDeskCount(_, { call, put }) {
      const response = yield call(getDeskCount);
      if (response && response.status === 'success') {
        yield put({ type: 'saveDeskCount', payload: response.data });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device.total.error" }));
      }
    },
    *getYuseCount(_, { call, put }) {
      const response = yield call(getYuseCount);
      if (response && response.status === 'success') {
        yield put({ type: 'saveYesterdayUseCount', payload: response.data });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.yesterday.use.error" }));
      }
    },
    *getUseRate({ payload }, { call, put }) {
      const response = yield call(getUseRate, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        const { data } = response;
        const { type, dataList } = data;
        const filter = [];
        for (let i = 0; i < dataList.length; i += 1) {
          const { time, offline_duration, vacant_duration, occupied_duration } = dataList[i];
          [1, 2, 3].forEach(value => {
            let status = formatMessage({ id: "device.offline" });
            let duration = offline_duration;
            if (value === 2) {
              status = formatMessage({ id: "device.leisure" });
              duration = vacant_duration;
            }
            if (value === 3) {
              status = formatMessage({ id: "device.use" });
              duration = occupied_duration;
            }
            filter.push({
              status,
              date: parseInt(G.moment(time).format(types[type]), 10),
              value: duration,
              time: G.moment(time).format(`MM-DD`),
            });
          });
        }
        yield put({ type: 'saveUseRate', payload: { data: filter, type: payload.type } });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.station.usage.error" }));
      }
    },
    // 服务时长统计
    *getServiceDuration(_, { call, put }) {
      const response = yield call(getServiceDuration);
      if (response && response.status === 'success') {
        yield put({ type: 'saveServiceDuration', payload: response.data });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.server.time.error" }));
      }
    },
    // 工位使用时长
    *getAvgDuration({ payload }, { call, put }) {
      const response = yield call(getAvgDuration, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        const dataListCopy = [];
        response.data.dataList.forEach(value => {
          if (response.data.condition_type === 'HOURLY') {
            dataListCopy.push({
              x: `${value.week}:00`,
              y: Number((value.duration / 60).toFixed(2)),
            });
          } else {
            dataListCopy.push({
              x: G.moment(G.moment().day(value.week)._d).format('dddd'),
              y: Number((value.duration / 60).toFixed(2)),
            });
          }
        });
        yield put({
          type: 'saveAvgDuration',
          payload: {
            condition_type: response.data.condition_type,
            date_type: response.data.date_type,
            dataList: dataListCopy,
          },
        });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device.use.error" }));
      }
    },
    // 工位使用率排行
    *getDeskUseRank({ payload }, { call, put }) {
      const response = yield call(getDeskUseRank, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        const dataListCopy = [];
        response.data.dataList.forEach(value => {
          dataListCopy.push({
            x: value.number,
            y: Number((value.duration / 60).toFixed(2)),
          });
        });
        if (response.data.status_type === 'HOT') {
          yield put({
            type: 'saveDeskUseRank_hot',
            payload: {
              status_type: response.data.status_type,
              condition_type: response.data.condition_type,
              date_type: response.data.date_type,
              dataList: dataListCopy.reverse(),
            },
          });
        } else {
          yield put({
            type: 'saveDeskUseRank_free',
            payload: {
              status_type: response.data.status_type,
              condition_type: response.data.condition_type,
              date_type: response.data.date_type,
              dataList: dataListCopy.reverse(),
            },
          });
        }
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device.use.error" }));
      }
    },
  },

  reducers: {
    saveDeskCount(state, { payload }) {
      return { ...state, daskTotalCount: payload };
    },
    saveYesterdayUseCount(state, { payload }) {
      return { ...state, yesterdayUseCount: payload };
    },
    saveUseRate(state, { payload }) {
      return { ...state, useRate: payload };
    },
    // 服务时长统计
    saveServiceDuration(state, { payload }) {
      return { ...state, serviceDuration: payload };
    },
    // 工位使用时长
    saveAvgDuration(state, { payload }) {
      return { ...state, deskAvgDuration: payload };
    },
    // 热门工位排行
    saveDeskUseRank_hot(state, { payload }) {
      return { ...state, deskUseRank_hot: payload };
    },
    // 空闲工位排行
    saveDeskUseRank_free(state, { payload }) {
      return { ...state, deskUseRank_free: payload };
    },
  },
};
