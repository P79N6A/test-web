import { gatewayList, gatewayRemark, gatewayCommand, getCustomerList } from '@/services/api';
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
    // 配置弹窗
    configureVisible: false,
    // 要配置的网关列表
    configureList: [],
  },

  effects: {
    // 获取物理网关列表
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
    // 物理网关标记
    *gatewayRemark({ payload }, { call }) {
      const response = yield call(gatewayRemark, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "gateway.remark.success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 物理网关配置
    *gatewayCommand({ payload }, { call }) {
      const response = yield call(gatewayCommand, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "gateway.configure.success" }));
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
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        gatewayData: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.gatewayData.limit,
        },
      };
    },
    // 修改配置列表
    changeConfigureModel(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 保存客户列表
    saveCustomer(state, action) {
      const customerList = action.payload.rows.map((item, i) => ({ text: item.companyName, value: item.companyId }))
      return {
        ...state,
        customerList,
      };
    },
  },
};
