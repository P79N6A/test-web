// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { message } from 'antd';
import { usersGroupList, addUsersGroup, getPersonnelList, changeRole, usersGroupUpdate } from '@/services/api';
import { formatMessage, getLocale } from 'umi/locale';
import G from '@/global';

export default {
  namespace: 'PersonGroup',
  state: {
    // 用户组列表
    groupList: [],
    // 用户列表
    data: {
      rows: [],
      offset: 0,
      current: 1,
      limit: 15,
    },
  },

  effects: {
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
    // 创建用户组
    *addUsersGroup({ payload }, { call }) {
      const response = yield call(addUsersGroup, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success('添加用户组成功');
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 获取用户列表
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
    // 改变用户角色
    *changeRole({ payload }, { call, put }) {
      const response = yield call(changeRole, payload);
      if (response && response.status === 'success') {
        message.success(formatMessage({ id: "person.role.change-role-success" }));
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
    // 删除用户组
    *usersGroupUpdate({ payload }, { call }) {
      const response = yield call(usersGroupUpdate, payload);
      payload.callback(response);
      if (response && response.status === 'success') {
        message.success('删除用户组成功');
      } else {
        message.error(G.errorLists[response.code][`message_${getLocale()}`] || 'error');
      }
    },
  },

  reducers: {
    // 保存用户组
    saveGroup(state, action) {
      return {
        ...state,
        groupList: action.payload,
      };
    },
    // 保存用户列表
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
  },
};
