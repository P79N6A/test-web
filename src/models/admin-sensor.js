import { adminSensorList, getGatewayStatus } from '@/services/api';
import { message } from 'antd';
import G from '@/global';
import { formatMessage, getLocale } from 'umi/locale';

export default {
  namespace: 'adminSensor',
  state: {
    adminSensorData: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    sensorData: {},
  },

  effects: {
    // 获取传感器列表
    *adminSensorList({ payload }, { call, put }) {
      const response = yield call(adminSensorList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 根据传感器ID获取虚拟网关状态
    *getGatewayStatus({ payload }, { call, put }) {
      const response = yield call(getGatewayStatus, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
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
        adminSensorData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.adminSensorData.limit,
        }
      };
    },
    saveData(state, action) {
      return {
        ...state,
        sensorData: action.payload,
      };
    },
  }
};
