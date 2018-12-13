import { gatewayList, gatewayRemark, gatewayCommand } from '@/services/api';
import { message } from 'antd';
import G from '@/global';
import { formatMessage, getLocale } from 'umi/locale';

export default {
  namespace: 'Gateway',
  state: {
    gatewayData: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    // 客户列表
    customerList: [],
    // 位置列表
    positionList: [],
    // 配置弹窗
    configureVisible: false,
    // 要配置的网关列表
    configureList: [],
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
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *gatewayRemark({ payload }, { call }) {
      const response = yield call(gatewayRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "gateway.remark.success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *gatewayCommand({ payload }, { call }) {
      const response = yield call(gatewayCommand, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "gateway.configure.success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
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
    },
    // 修改配置列表
    changeConfigureModel(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        ...action.payload
      };
    }
  }
};
