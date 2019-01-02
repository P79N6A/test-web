import { message } from 'antd';
import { getPersonnelList, addPerson, updatePerson, getQiniuToken, usersBatchImport, changeRole, usersGroupList } from '@ß/services/api';
import { formatMessage, getLocale } from 'umi/locale';
import G from '@/global';

export default {
  namespace: 'ManagementPerson',
  state: {
    data: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
    qiniuToken: '',
    errorList: {},
    // 用户组列表
    groupList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPersonnelList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *addPerson({ payload }, { call }) {
      const response = yield call(addPerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.message || formatMessage({ id: "customer.operate.add-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *updatePerson({ payload }, { call }) {
      const response = yield call(updatePerson, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(response.data || formatMessage({ id: "customer.operate.successfully-modified" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    *getQiniuToken({ payload }, { call }) {
      const response = yield call(getQiniuToken, payload);
      payload.callback(response);
    },
    *usersBatchImport({ payload }, { call, put }) {
      const response = yield call(usersBatchImport, payload);
      payload.callback(response);
      yield put({
        type: 'saveError',
        payload: response.data,
      });
    },
    // 改变用户角色
    *changeRole({ payload }, { call, put }) {
      const response = yield call(changeRole, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "person.role.change-role-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取用户组列表
    *usersGroupList({ payload }, { call, put }) {
      const response = yield call(usersGroupList, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'saveGroup',
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
        data: {
          ...action.payload,
          offset: Number(offset),
          current: Number(offset) / 15 + 1,
          limit: state.data.limit,
        },
      };
    },
    saveError(state, action) {
      return {
        ...state,
        errorList: {
          ...action.payload,
        },
      };
    },
    // 保存用户组
    saveGroup(state, action) {
      return {
        ...state,
        groupList: action.payload,
      };
    },
  },
};
