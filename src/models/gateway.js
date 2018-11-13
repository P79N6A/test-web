import { gatewayList } from '@/services/api';
import { message } from 'antd';
import G from '@/global'

export default {
  namespace: 'Gateway',
  state: {
    gatewayData: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    customerList: [],
    positionList: []
  },

  effects: {
    *gatewayList({ payload }, { call, put }) {
      const response = yield call(gatewayList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(response.message || 'error');
      }
    }
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      let customerList = [], positionList = [];
      action.payload.rows.map((item, i) => {
        if (G._.findIndex(customerList, { value: item.companyId }) === -1) {
          customerList.push({ "text": item.companyName, "value": item.companyId })
        }
        if (G._.findIndex(positionList, { value: item.position }) === -1) {
          positionList.push({ "text": item.position, "value": item.position });
        }
      })
      return {
        ...state,
        gatewayData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.gatewayData.limit,
        },
        customerList,
        positionList
      };
    }
  }
};
