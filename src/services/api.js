import request from '@/utils/request';
import G from '@/global';
import { filterUrl, filterBody, getToken, filterEdit } from '@/utils/utils';

const { API_URL, IXAM_URL, SUBSCRIPTION_KEY } = G;
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

// TODO: 获取人员数组
export async function getPersonnelList(payload) {
  return {
    "status": "success",
    "data": {
      "count": 5,
      "rows": [
        {
          "uid": "99f89bbb-8042-4a3b-afc5-5f277e34d3af",
          "name": "haoshuo",
          "phone": "18811467730",
          "position": null,
          "email": "18811467730@163.com",
          "isDel": false,
          "remark": "hdiuwcdbxnadsdxnhdiuwcdbxnadsdxnhdiuwcdbxnadsdxnhdiuwcdbxnadsdxn",
          "status": 2,
          "role": "default",
        },
        {
          "uid": "90f89bbb-8042-4a3b-afc5-5f277e34d3af",
          "name": "haoshuo",
          "phone": "18811467730",
          "position": null,
          "email": "18811467730@163.com",
          "isDel": false,
          "remark": null,
          "status": 2,
          "role": "manager_space",
        },
      ],
      "offset": 0,
      "limit": 15,
    },
  }
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
  const body = filterEdit({ ...payload, token: getToken() });
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

// 上传文件
export async function usersBatchImport(payload) {
  return {
    status: 'fail',
    data: {
      totalLine: 100,
      successLine: 56,
      dataList: [
        { "errorId": 0, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 1, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 2, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 3, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 4, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 5, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 6, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 7, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 8, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 9, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 10, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 11, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 12, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 13, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 14, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 15, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 16, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
        { "errorId": 17, "row": 1, "title": "邮箱", "content": "123@163.com", "message": "邮箱已存在" },
      ],
    },
  }
  const url = `${G.API_URL}/users/batch/import`;
  const body = filterEdit({ ...payload, token: getToken() });
  return request(url, {
    method: 'POST',
    body,
  });
}

// 修改角色
export async function changeRole(payload) {
  return {
    status: 'success',
  }
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/users/configuration/role`, {
    method: 'POST',
    body,
  });
}

// 获取设备列表
export async function getResourceList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/resources/list`, {
    method: 'POST',
    body,
  });
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

// 获取通知列表
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
  const body = filterEdit({ ...payload, token: getToken() });
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

// TODO: 获取权限列表
export async function permissionsList(payload) {
  return {
    "status": "success",
    "data": [
      {
        "menu_id": "ac0010",
        "menu_name": "首页",
        "choose": true,
        "child": [
          {
            "menu_id": "ac0011",
            "menu_name": "首页",
            "choose": true,
          },
        ],
      },
      {
        "menu_id": "ac0020",
        "menu_name": "DShow",
        "choose": false,
        "child": [
          {
            "menu_id": "ac0021",
            "menu_name": "通知管理",
            "choose": false,
          },
          {
            "menu_id": "ac0022",
            "menu_name": "Banner管理",
            "choose": false,
          },
        ],
      },
      {
        "menu_id": "ac0030",
        "menu_name": "数据",
        "choose": true,
        "child": [
          {
            "menu_id": "ac0031",
            "menu_name": "空间实时状态",
            "choose": true,
          },
          {
            "menu_id": "ac0032",
            "menu_name": "空间使用情况",
            "choose": false,
          },
          {
            "menu_id": "ac0033",
            "menu_name": "升降记录分析",
            "choose": false,
          },
        ],
      },
      {
        "menu_id": "ac0040",
        "menu_name": "管理",
        "choose": false,
        "child": [
          {
            "menu_id": "ac0041",
            "menu_name": "用户管理",
            "choose": false,
          },
          {
            "menu_id": "ac0042",
            "menu_name": "设备管理",
            "choose": true,
          },
        ],
      },
    ],
  }
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${G.API_URL}/permissions/list?${url}`, {
    method: 'GET',
  });
}

// TODO: 设置权限列表
export async function setPermissions(payload) {
  return {
    status: 'success',
  }
  const body = filterBody({ token: getToken(), ...payload });
  return request(`${G.API_URL}/permissions/list`, {
    method: 'POST',
    body,
  });
}

// 获取对应的 svg 图
export async function getSvg() {
  return request(`${API_URL}/users/svg?token=${getToken()}`, {
    method: 'GET',
  });
}

// 获取 svg 图里面所有桌子的状态
export async function getDeskState(payload) {
  const url = filterUrl({ token: getToken() });
  return request(`${API_URL}/desk/status?${url}`, {
    method: 'GET',
  });
}

// TODO: 工位总数
export async function getDeskCount(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/count?${url}`, {
    method: 'GET',
  });
}

// TODO: 昨日使用个数以及昨日未使用数
export async function getYuseCount(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/yesterday_count?${url}`, {
    method: 'GET',
  });
}

// 工位使用时长分布
export async function getAvgDuration(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/duration?${url}`, {
    method: 'GET',
  });
}

// TODO: 工位使用趋势
export async function getUseRate(payload) {
  return {
    "status": "success",
    "data": {
      "type": payload.type,
      "date_type": "LAST_7DAYS",
      "dataList": [
        {
          "time": "2018-11-25T07:38:14.619Z",
          "occupied_duration": 89,
          "vacant_duration": 180,
          "offline_duration": 21,
          "daily_average_duration": 56,
        },
        {
          "time": "2018-11-26T07:38:14.619Z",
          "occupied_duration": 89,
          "vacant_duration": 180,
          "offline_duration": 21,
          "daily_average_duration": 56,
        },
        {
          "time": "2018-11-27T07:38:14.619Z",
          "occupied_duration": 89,
          "vacant_duration": 180,
          "offline_duration": 21,
          "daily_average_duration": 56,
        },
        {
          "time": "2018-11-27T07:38:14.619Z",
          "occupied_duration": 43,
          "vacant_duration": 31,
          "offline_duration": 56,
          "daily_average_duration": 1,
        },
        {
          "time": "2018-11-28T07:38:14.619Z",
          "occupied_duration": 343,
          "vacant_duration": 333,
          "offline_duration": 133,
          "daily_average_duration": 13,
        },
        {
          "time": "2018-11-29T07:38:14.619Z",
          "occupied_duration": 340,
          "vacant_duration": 300,
          "offline_duration": 100,
          "daily_average_duration": 10,
        },
        {
          "time": "2018-11-30T07:38:14.619Z",
          "occupied_duration": 400,
          "vacant_duration": 300,
          "offline_duration": 300,
          "daily_average_duration": 20,
        },
      ],
    },
  }
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/use_rate?${url}`, {
    method: 'GET',
  });
}

// TODO: 服务时长统计
export async function getServiceDuration(payload) {
  return {
    "status": "success",
    "data": {
      "total_duration": 1754952,
      "occupied_duration": 161070,
      "vacant_duration": 1593882,
      "offline_duration": 1123662,
      "average_duration": 6,
    },
  }
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/service_duration?${url}`, {
    method: 'GET',
  });
}

// 工位使用率排行
export async function getDeskUseRank(payload) {
  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/desk/rate_usage_rank?${url}`, {
    method: 'GET',
  });
}

// 获取 banner 列表
export async function getBannerList() {
  return request(`${API_URL}/banner/list?token=${getToken()}`, {
    method: 'GET',
  });
}

// 获取系统默认列表
export async function getDefaultBannerList() {
  return request(`${API_URL}/banner/defaultBannerPictureList?token=${getToken()}`, {
    method: 'GET',
  });
}

// 添加 Banner
export async function addBanner(payload) {
  const url = `${G.API_URL}/banner/add`;
  const body = filterEdit({ ...payload, token: getToken() });
  return request(url, {
    method: 'PUT',
    body,
  });
}

// 发布 Banner
export async function bannerPublish() {
  return request(`${API_URL}/banner/publish`, {
    method: 'POST',
    body: { token: getToken() },
  });
}

// 删除 Banner
export async function delBanner(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/banner/delete`, {
    method: 'POST',
    body,
  });
}

// 排序 Banner
export async function sortBanner(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/banner/edit`, {
    method: 'POST',
    body,
  });
}

// 获取网关列表
export async function gatewayList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/gateway/list`, {
    method: 'POST',
    body,
  });
}

// 网关添加备注
export async function gatewayRemark(payload) {
  const { id } = payload;
  const url = `${G.API_URL}/gateway/${id}`;
  return request(url, {
    method: 'POST',
    body: { remark: payload.remark, token: getToken() },
  });
}

// 配置网关
export async function gatewayCommand(payload) {
  const { id } = payload;
  const url = `${G.API_URL}/gateway/runScripts/${id}`;
  return request(url, {
    method: 'POST',
    body: { command: payload.command, token: getToken() },
  });
}

// TODO: 找回密码发送邮箱给后台
export async function sendEmail(payload) {
  const body = filterBody({ ...payload });
  return request(`${G.API_URL}/send/email`, {
    method: 'POST',
    body,
  });
}

// TODO: 进入邮箱点击找回密码
export async function retrievePassword(payload) {
  const body = filterBody({ ...payload });
  return request(`${G.API_URL}/retrieve/password`, {
    method: 'POST',
    body,
  });
}

// TODO: 发送新密码
export async function sendPassword(payload) {
  const body = filterBody({ ...payload });
  return request(`${G.API_URL}/send/password`, {
    method: 'POST',
    body,
  });
}

// 获取传感器列表
export async function sensorList(payload) {
  const body = filterBody({ ...payload, token: getToken() });
  return request(`${G.API_URL}/device/list`, {
    method: 'POST',
    body,
  });
}

// 传感器添加备注
export async function sensorRemark(payload) {
  const { id } = payload;
  const url = `${G.API_URL}/device/${id}`;
  return request(url, {
    method: 'POST',
    body: { remark: payload.remark, token: getToken() },
  });
}

/**
 * @method 查询传感器状态
 * @param {*} payload
 *  tags      Array       查询的传感器tag
 */
export async function getDeviceStatus(payload) {
  return request(`${IXAM_URL}/base/devices/status`, {
    method: 'POST',
    body: { ...payload, token: getToken() },
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Ocp-Apim-Trace': true,
    },
  });
}
