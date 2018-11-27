import { sensorList, sensorRemark } from '@/services/api';
import { message } from 'antd';
import G from '@/global';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'Sensor',
  state: {
    sensorData: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    // 状态列表
    stateList: []
  },

  effects: {
    *sensorList({ payload }, { call, put }) {
      const response = yield call(sensorList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(response.message || 'error');
      }
    },
    *sensorRemark({ payload }, { call }) {
      const response = yield call(sensorRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "gateway.remark.success" }));
      } else {
        message.error(response.message || formatMessage({ id: "gateway.remark.fail" }));
      }
    },
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      let stateList = [];
      action.payload.rows.map((item, i) => {
        if (G._.findIndex(stateList, { value: item.state }) === -1) {
          stateList.push({ "text": item.state, "value": item.state });
        }
      })
      return {
        ...state,
        sensorData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.sensorData.limit,
        },
        stateList
      };
    }
  }
};
