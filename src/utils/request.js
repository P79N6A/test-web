// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import fetch from 'dva/fetch';
import router from 'umi/router';
import { getUserInfo } from '@/utils/authority';
import { getUserWithCToken } from '@/utils/utils';
import user from '@/locales/user';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  const { dispatch } = window.g_app._store;
  if (response.status < 200 || response.status >= 500) {
    const errortext = codeMessage[response.status] || response.statusText;
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }
  if (response.status !== 401) return response;
  const { pathname } = window.location;
  const currentUser = JSON.parse(getUserInfo());
  const loginUser = getUserWithCToken(currentUser && currentUser.token);
  if (pathname.indexOf('office-map') > -1) {
    dispatch({
      type: 'login/autoLogin',
      payload: user.officeMapUser,
    });
  } else if (loginUser && currentUser && currentUser.autoLogin) {
    dispatch({
      type: 'login/autoLogin',
      payload: loginUser,
    });
  } else {
    dispatch({
      type: 'login/logout',
      payload: { tokenExpired: true, redirect: pathname.indexOf('spacex') > -1 ? '/spacex-user/login' : false },
    });
  }
  return response;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  const defaultOptions = {};
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...newOptions.headers,
  };
  newOptions.body = JSON.stringify(newOptions.body);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      const { dispatch } = window.g_app._store;
      const status = err.name;
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
      }
    });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function requestFile(url, options) {
  const defaultOptions = {};
  const newOptions = { ...defaultOptions, ...options };
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      const { dispatch } = window.g_app._store;
      const status = err.name;
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
      }
    });
}