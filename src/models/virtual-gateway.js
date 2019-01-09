import { virtualGatewayList, getCustomerList, virtualGatewaySensorList } from '@/services/api';
import { message } from 'antd';
import G from '@/global';
import { getLocale } from 'umi/locale';

export default {
  namespace: 'virtualGateway',
  state: {
    virtualGatewayData: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    // 客户列表
    customerList: [],
    // 详情数据
    detail: {
      detailData: {},
      visible: false,
    },
    // 详情页面传感器列表
    gatewayList: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
  },

  effects: {
    // 获取物理网关列表
    *virtualGatewayList({ payload }, { call, put }) {
      const response = yield call(virtualGatewayList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取客户列表
    *customerList(_, { call, put }) {
      const response = yield call(getCustomerList);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveCustomer',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取物理网关列表
    *virtualGatewaySensorList({ payload }, { call, put }) {
      const response = yield call(virtualGatewaySensorList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveSensor',
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
        virtualGatewayData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.virtualGatewayData.limit,
        },
      };
    },
    // 保存客户列表
    saveCustomer(state, action) {
      const customerList = [];
      action.payload.forEach((item, i) => {
        customerList.push({ text: item.companyName, value: item.companyId })
      })
      return {
        ...state,
        customerList,
      };
    },
    // 修改详情数据
    changeDetailData(state, action) {
      return {
        ...state,
        detail: {
          ...action.payload,
        },
      };
    },
    saveSensor(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        gatewayList: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.gatewayList.limit,
        },
      };
    },
  },
};
