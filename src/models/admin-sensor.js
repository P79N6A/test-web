import { adminSensorList } from '@/services/api';
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
    }
  },

  effects: {
    // 获取物理网关列表
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
    }
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
    }
  }
};
