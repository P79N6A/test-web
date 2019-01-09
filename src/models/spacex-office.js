import { message } from 'antd';
import G from '@/global';
import { getLocale } from 'umi/locale';
import {
  getDeskCount,
  getYuseCount,
  getAvgDuration,
  getUseRate,
  getServiceDuration,
  getDeskUseRank,
} from '@/services/api';

const types = {
  WEEKLY: 'd',
  MONTHLY: 'D',
  YEARLY: 'M',
};

export default {
  namespace: 'spacexOffice',
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
      total_duration: 1000, // 总时长 单位：分钟
      occupied_duration: 300, // 占用总时长
      vacant_duration: 400, // 空闲总时长
      offline_duration: 300, // 离线总时长
    },
    homeRank: [],
    // 工位使用时长
    deskAvgDuration: {
      condition_type: 'HOURLY',
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [
        { x: '1月', y: 20 },
        { x: '2月', y: 40 },
        { x: '3月', y: 10 },
        { x: '4月', y: 90 },
      ],
    },
    // 热门工位排行
    deskUseRank_hot: {
      status_type: 'HOT',
      condition_type: 9,
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [
        {
          number: 'A21224',
          duration: 155,
        },
        {
          number: 'A21219',
          duration: 153,
        },
        {
          number: 'A21221',
          duration: 150,
        },
        {
          number: 'A21212',
          duration: 149,
        },
        {
          number: 'A21224',
          duration: 145,
        },
        {
          number: 'A21219',
          duration: 143,
        },
        {
          number: 'A21221',
          duration: 140,
        },
        {
          number: 'A21212',
          duration: 139,
        },
        {
          number: 'A21221',
          duration: 120,
        },
        {
          number: 'A21212',
          duration: 119,
        },
      ],
    },
    // 空闲工位排行
    deskUseRank_free: {
      status_type: 'FREE',
      condition_type: 9,
      date_type: 'LAST_DAY',
      date: '2018-09-03T00:00:00.000Z',
      dataList: [
        {
          number: 'A21224',
          duration: 155,
        },
        {
          number: 'A21219',
          duration: 153,
        },
        {
          number: 'A21221',
          duration: 150,
        },
        {
          number: 'A21212',
          duration: 149,
        },
        {
          number: 'A21224',
          duration: 145,
        },
        {
          number: 'A21219',
          duration: 143,
        },
        {
          number: 'A21221',
          duration: 140,
        },
        {
          number: 'A21212',
          duration: 139,
        },
        {
          number: 'A21221',
          duration: 120,
        },
        {
          number: 'A21212',
          duration: 119,
        },
      ],
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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *getYuseCount(_, { call, put }) {
      const response = yield call(getYuseCount);
      if (response && response.status === 'success') {
        yield put({ type: 'saveYesterdayUseCount', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *getUseRate({ payload }, { call, put }) {
      const response = yield call(getUseRate, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        const { data } = response;
        const { type, dataList } = data;
        const filter = [];
        for (let i = 0; i < dataList.length; i++) {
          const { time, offline_duration, vacant_duration, occupied_duration } = dataList[i];
          [1, 2, 3].forEach(value => {
            let status = '离线';
            let duration = offline_duration;
            if (value === 2) {
              status = '空闲';
              duration = vacant_duration;
            }
            if (value === 3) {
              status = '使用';
              duration = occupied_duration;
            }
            filter.push({
              status,
              date: parseInt(G.moment(time).format(types[type]), 10),
              value: duration,
              time: G.moment(time).format('MM月DD日'),
            });
          });
        }
        yield put({ type: 'saveUseRate', payload: { data: filter, type: payload.type } });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 服务时长统计
    *getServiceDuration(_, { call, put }) {
      const response = yield call(getServiceDuration);
      if (response && response.status === 'success') {
        yield put({ type: 'saveServiceDuration', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
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
