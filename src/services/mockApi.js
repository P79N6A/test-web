// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import G from '@/global';
import request from '@/utils/request';
import { getToken } from '@/utils/utils';
import {
  mockDemoStatus,
  mockServiceHour,
  mockYesterdayData,
  mockWorkStation,
  mockUsingHour,
  mockUsingRanking,
} from '@/utils/mock';

const { IXAM_URL, SUBSCRIPTION_KEY } = G;

/**
 * @method 查询传感器状态
 * @param {*} payload
 *  tags      Array       查询的传感器tag
 */
export async function getDeviceStatus(payload) {
  return request(`${IXAM_URL}/devices/status`, {
    method: 'POST',
    body: { ...payload, token: getToken() },
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Ocp-Apim-Trace': true,
    },
  });
}

/**
 * @method 查询传感器状态 海外演示生成的假数据
 * @param {*} payload
 *  tags      Array       查询的传感器tag
 */
export async function getDemoDeviceStatus(payload) {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockDemoStatus(payload);
      res({ data, status: 'success' });
    }, 2000);
  });
}

/**
 * @method 创建传感器tag
 * @param {*} payload
 *   tag        String     创建的传感器tag
 *   majorId    String     网关id
 *   type       Number     类型
 */
export async function createDevice(payload) {
  return request(`${IXAM_URL}/devices/devices`, {
    method: 'POST',
    body: { ...payload, token: getToken() },
  });
}

export async function getServiceHour() {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockServiceHour();
      res(data);
    }, 1000);
  });
}

export async function getYesterdayData() {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockYesterdayData();
      res(data);
    }, 1000);
  });
}

export async function getWorkStation() {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockWorkStation();
      res(data);
    }, 1000);
  });
}

export async function getUsingHour(payload) {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockUsingHour(payload);
      res(data);
    }, 500);
  });
}

export async function getUsingRanking(payload) {
  return new Promise(res => {
    setTimeout(() => {
      const data = mockUsingRanking(payload);
      res(data);
    }, 500);
  });
}