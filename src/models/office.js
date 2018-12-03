import { message } from 'antd';
import { formatMessage } from 'umi/locale';
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
    }


  },

  effects: {
    // 获取工位总数
    *getDeskCount({ payload }, { call, put }) {
      const response = yield call(getDeskCount, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveDeskCount', payload: response.data });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.device.total.error" }));
      }
    },
    // 获取昨日使用数以及昨日未使用数
    *getYuseCount({ payload }, { call, put }) {
      const response = yield call(getYuseCount, payload);
      if (response && response.status === 'success') {
        yield put({ type: 'saveYesterdayUseCount', payload: response.data });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.yesterday.use.error" }));
      }
    },
    // TODO: 工位使用趋势
    *getUseRate({ payload }, { call, put }) {
      const response = yield call(getUseRate, payload);
      payload.callback && payload.callback(response);
      if (response && response.status === 'success') {
        yield put({ type: 'saveUseRate', payload: { data: processData(response.data) } });
      } else {
        message.error((response && response.message) || formatMessage({ id: "spaceUsage.station.usage.error" }));
      }
    },
    // 服务时长统计
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
  },
};
