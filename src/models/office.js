import { message } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import { processData } from '@/utils/utils';
import G from '@/global';
import {
  getDeskCount,
  getYuseCount,
  getAvgDuration,
  getUseRate,
  getServiceDuration,
  getDeskUseRank,
} from '../services/api';

export default {
  namespace: 'office',
  state: {
    loading: false,
    global: {
      condition_type: 9,
      // 工位使用趋势参数
      use_rate: {
        type: 'duration',
        date_type: "LAST_7DAYS"
      },
      desk_avg_duration: {
        condition_types: 'HOURLY',
        date_type: 'LAST_DAY'
      },
      desk_use_rank_hot: {
        status_type: 'HOT',
        date_type: 'LAST_DAY',
      },
      desk_use_rank_free: {
        status_type: 'FREE',
        date_type: 'LAST_DAY',
      },
    },
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
    useRate: {
      useRateTend: [],
      useRateAverage: [],
      date: []
    },
    serviceDuration: {
      total_duration: 0, // 总时长 单位：分钟
      occupied_duration: 0, // 占用总时长
      vacant_duration: 0, // 空闲总时长
      offline_duration: 0, // 离线总时长
      average_duration: 0, // 平均时长
    },
    deskAvgDurationList: [],
    // 热门工位排行
    deskUseRankHotList: [],
    // 空闲工位排行
    deskUseRankFreeList: []
  },

  effects: {
    // 获取工位总数
    *getDeskCount({ payload }, { call, put }) {
      const response = yield call(getDeskCount, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveDeskCount', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取昨日使用数以及昨日未使用数
    *getYuseCount({ payload }, { call, put }) {
      const response = yield call(getYuseCount, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveYesterdayUseCount', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 工位使用趋势
    *getUseRate({ payload }, { call, put }) {
      const response = yield call(getUseRate, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        yield put({ type: 'saveUseRate', payload: { data: processData(response.data) } });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 服务时长统计
    *getServiceDuration({ payload }, { call, put }) {
      const response = yield call(getServiceDuration, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveServiceDuration', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取工位使用时长分布
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
          payload: { dataListCopy }
        });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device-use-error" }));
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
              dataList: dataListCopy.reverse(),
            },
          });
        } else {
          yield put({
            type: 'saveDeskUseRank_free',
            payload: {
              dataList: dataListCopy.reverse(),
            },
          });
        }
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device-use-error" }));
      }
    }
  },

  reducers: {
    // 保存参数的接口
    changeGlobalType(state, action) {
      return {
        ...state,
        global: {
          ...state.global,
          ...action.payload
        }
      };
    },
    // 保存工位总数
    saveDeskCount(state, { payload }) {
      return { ...state, daskTotalCount: payload };
    },
    // 保存昨日使用数以及昨日未使用数
    saveYesterdayUseCount(state, { payload }) {
      return { ...state, yesterdayUseCount: payload };
    },
    // 保存工位使用趋势数据
    saveUseRate(state, { payload }) {
      return { ...state, useRate: payload.data };
    },
    // 服务时长统计
    saveServiceDuration(state, { payload }) {
      return { ...state, serviceDuration: payload };
    },
    // 工位使用时长
    saveAvgDuration(state, { payload }) {
      return { ...state, deskAvgDurationList: payload };
    },
    // 热门工位排行
    saveDeskUseRank_hot(state, { payload }) {
      return { ...state, deskUseRankHotList: payload.dataList };
    },
    // 空闲工位排行
    saveDeskUseRank_free(state, { payload }) {
      return { ...state, deskUseRankFreeList: payload.dataList };
    },
  },
};
