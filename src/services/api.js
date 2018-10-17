import request from '@/utils/request';
import G from '@/global';
import { filterUrl, filterBody, getToken } from '@/utils/utils';

const { API_URL } = G;
// 登录
export async function login(params) {
  const username = params.userName;
  const password = params.password;
  // 执行api请求
  return request(`${API_URL}/users/login`, {
    method: 'POST',
    body: { username, password },
  });
}

// 登出
export async function logout() {
  return request(`${API_URL}/users/logout`, {
    method: 'POST',
    body: { token: getToken() },
  });
}

// 修改密码
export async function changePassword(payload) {
  return request(`${API_URL}/users/password`, {
    method: 'POST',
    body: { ...payload, token: getToken() },
  });
}

// 设备数
export async function getResourceNum() {
  return request(`${API_URL}/resources/count?token=${getToken()}`, {
    method: 'GET',
  });
}

// 用户数
export async function getUserNum() {
  return request(`${API_URL}/users/count?token=${getToken()}`, {
    method: 'GET',
  });
}

// 通知数
export async function getNotificationCount() {
  return request(`${API_URL}/notifications/count?token=${getToken()}`, {
    method: 'GET',
  });
}

// 通知数
export async function getStandNum() {
  return request(`${API_URL}/stats/standTotalTime?token=${getToken()}`, {
    method: 'GET',
  });
}

// 站立时间
export async function getHomeStand(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/stats/standTime?${url}`, {
    method: 'GET',
  });
}

// 站立排行榜
export async function getHomeRank(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/stats/standRank?${url}`, {
    method: 'GET',
  });
}

// 首页获取站立时间趋势数据
export async function getStandingData() {
  const salesData = [];
  for (let i = 0; i < 12; i += 1) {
    salesData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200,
    });
  }
  return {
    status: 'success',
    data: salesData,
  };
}

// 首页获取站立时间排行
export async function getTimeRanking() {
  const rankingListData = [];
  for (let i = 0; i < 7; i += 1) {
    rankingListData.push({
      title: `工专路 ${i} 号店`,
      hours: Math.floor(Math.random() * 10) * 2,
      minutes: Math.floor(Math.random() * 10) * 3,
    });
  }
  return {
    status: 'ok',
    data: rankingListData,
  };
}

// 首页获取收集的数据
export async function getHomeData() {
  return request(`${G.API_URL}/space/homeData`, {
    method: 'GET',
  });
}

// 获取人员数组
export async function getPersonnelList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/users/list`, {
    method: 'POST',
    body,
  });
}

// 添加人员
export async function addPerson(payload) {
  const url = `${G.API_URL}/users`;
  const body = filterBody({ ...payload, token: getToken() });
  return request(url, {
    method: 'PUT',
    body,
  });
}

// 修改或删除人员
export async function updatePerson(payload) {
  const url = `${G.API_URL}/users/update`;
  const body = filterBody({ ...payload, token: getToken() });
  return request(url, {
    method: 'POST',
    body,
  });
}

// 获取七牛云上传的 token
export async function getQiniuToken() {
  return request(`${API_URL}/users/qiniuToken?token=${getToken()}`, {
    method: 'GET',
  });
}

// 获取设备列表
export async function getResourceList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/resources/list`, { method: 'POST', body });
}

// 设备列表添加备注
export async function addRemark(payload) {
  const { id } = payload;
  const url = `${G.API_URL}/resources/${id}/remark`;
  return request(url, {
    method: 'POST',
    body: { remark: payload.remark, token: getToken() },
  });
}

// 解绑设备
export async function releaseDevice(payload) {
  const { id } = payload;
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/resources/${id}/release`, { method: 'POST', body });
}

// 移除设备
export async function removeDevice(payload) {
  const { id } = payload;
  return request(`${G.API_URL}/resources/${id}/remove`, { method: 'POST', body: { token: getToken() } });
}

// 获去通知列表
export async function getNoticeList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/notifications/list`, { method: 'POST', body });
}

// 获取已发送通知的状态
export async function getNoticeState(payload) {
  const { noticeId } = payload;
  const body = filterBody({ token: getToken() });
  return request(`${G.API_URL}/notifications/${noticeId}/userStatusList`, { method: 'POST', body });
}

// 发送通知
export async function sendNotice(payload) {
  const url = `${G.API_URL}/notifications`;
  return request(url, {
    method: 'PUT',
    body: { ...payload, token: getToken() },
  });
}

// 置顶通知
export async function topNotice(payload) {
  const { noticeId } = payload;
  const body = filterBody({ status: payload.status, token: getToken() });
  return request(`${G.API_URL}/notifications/${noticeId}/pinToTop`, { method: 'POST', body });
}

// 获取客户数组
export async function getCustomerList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/company/list`, {
    method: 'POST',
    body,
  });
}

// 添加客户
export async function addCustomer(payload) {
  const url = `${G.API_URL}/company/add`;
  const body = filterBody({ ...payload, token: getToken() });
  return request(url, {
    method: 'PUT',
    body,
  });
}
// 编辑客户
export async function editCustomer(payload) {
  const url = `${G.API_URL}/company/update`;
  const body = filterBody({ ...payload, token: getToken() });
  return request(url, {
    method: 'PUT',
    body,
  });
}
// 重置密码
export async function resetPassword(payload) {
  const { account } = payload;
  const body = filterBody({ token: getToken() });
  return request(`${G.API_URL}/company/${account}/resetPassword`, {
    method: 'POST',
    body,
  });
}
