import { message } from 'antd';
import { getCustomerList, addCustomer, editCustomer, resetPassword, permissionsList, setPermissions } from '@/services/api';
import { getLocale, formatMessage } from 'umi/locale';
import G from '@/global';

export default {
  namespace: 'ManagementCustomer',
  state: {
    data: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    editValue: '',
    permissionList: [],
    companyId: '',
    addPermission: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCustomerList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *addCustomer({ payload }, { call }) {
      const response = yield call(addCustomer, payload);
      payload.callback(response);
    },
    *editCustomer({ payload }, { call }) {
      const response = yield call(editCustomer, payload);
      payload.callback(response);
    },
    *resetPassword({ payload }, { call }) {
      const response = yield call(resetPassword, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data);
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *permissionsList({ payload }, { call, put }) {
      const response = yield call(permissionsList, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        yield put({ type: 'savePermissionsList', payload: response.data });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      };
    },
    *setPermissions({ payload }, { call }) {
      const response = yield call(setPermissions, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: 'customer.permission.set-permission-success' }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      };
    },
  },

  reducers: {
    save(state, action) {
      const { offset } = action.payload;
      return {
        ...state,
        data: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.data.limit,
        },
      };
    },
    setEditValue(state, action) {
      return {
        ...state,
        editValue: action.payload,
      };
    },
    setcompanyId(state, { payload }) {
      return {
        ...state,
        companyId: payload,
      };
    },
    savePermissionsList(state, { payload }) {
      return {
        ...state,
        permissionList: payload,
      };
    },
    saveAddPermissions(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCompanyId(state, { payload }) {
      return {
        ...state,
        companyId: { ...payload },
      };
    },
  },
};
