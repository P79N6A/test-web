import request from '@/utils/request';
import G from '@/global';
import { filterUrl, filterBody, getToken, filterEdit } from '@/utils/utils';

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

// 获取侧边栏
export async function getSliderMenu() {
  // 假数据
  const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
  if (userInfo.currentAuthority === 'user') {
    return {
      status: 'success', data: [
        {
          "name": "home",
          "icon": "home",
          "path": "/home",
          "locale": "menu.home",
        },
        {
          "name": "dshow",
          "icon": "profile",
          "path": "/dshow",
          "locale": "menu.dshow",
          "children": [
            {
              "path": "/management/notice",
              "name": "notice",
              "locale": "menu.management.notice"
            },
            {
              "path": "/management/banner",
              "name": "banner",
              "locale": "menu.management.banner"
            },
          ]
        },
        {
          "name": "statistics",
          "icon": "pie-chart",
          "path": "/statistics",
          "locale": "menu.statistics",
          "children": [
            {
              "path": "/statistics/spaceState",
              "name": "spaceState",
              "locale": "menu.statistics.spaceState"
            },
            {
              "path": "/statistics/spaceUsage",
              "name": "spaceUsage",
              "locale": "menu.statistics.spaceUsage"
            },
          ]
        },
        {
          "name": "management",
          "icon": "table",
          "path": "/management",
          "locale": "menu.management",
          "children": [
            {
              "path": "/management/person",
              "name": "person",
              "locale": "menu.management.person"
            },
            {
              "path": "/management/device",
              "name": "device",
              "locale": "menu.management.device"
            },
          ]
        }
      ]
    }
  } else {
    return {
      status: 'success', data: [
        {
          "name": "home",
          "icon": "home",
          "path": "/home",
          "locale": "menu.home",
        },
        {
          "name": "management",
          "icon": "table",
          "path": "/management",
          "locale": "menu.management",
          "children": [
            {
              "path": "/management/customer",
              "name": "customer",
              "locale": "menu.management.customer"
            },
            {
              "path": "/management/device",
              "name": "device",
              "locale": "menu.management.device"
            },
          ]
        }
      ]
    }
  }

  return request(`${API_URL}/sidebar/list?token=${getToken()}`, {
    method: 'GET',
  });
}

// TODO: 获取对应的 svg 图
export async function getSvg() {
  return {
    status: 'success',
    data: {
      "svgUrl": "/static/svg/test.svg",
      "svgId": "backgroundsvg",
    }
  }
  return request(`${API_URL}/space/svg?token=${getToken()}`, {
    method: 'GET',
  });
}

// TODO: 获取 svg 图里面所有桌子的状态
export async function getDeskState(payload) {
  return {
    "status": "success",
    "data": [
      {
        "id": "340b84d1-b8e2-4ae8-a355-1b420f741c9f",
        "htmlId": "A21205",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:47.000Z",
        "updatedAt": "2018-09-11T08:56:00.000Z",
        "devices": [
          {
            "id": "00be7a7ba2514271861d5843e3443bda",
            "number": "A21205",
            "deviceTwin": {
              "deviceId": "00be7a7ba2514271861d5843e3443bda",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:33Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "33248a06-25f8-4b6b-ba2d-f43892c6a39c",
        "htmlId": "A21222",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:51.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "013027c4bd61440886d8a294ffe6db6b",
            "number": "A21222",
            "deviceTwin": {
              "deviceId": "013027c4bd61440886d8a294ffe6db6b",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:58Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "9518e60f-234f-4018-b2b1-fdbd97b09fb5",
        "htmlId": "A21231",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "0b19cdad50414b91b4c803810f59f88e",
            "number": "A21231",
            "deviceTwin": {
              "deviceId": "0b19cdad50414b91b4c803810f59f88e",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:24:29Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "6aba9f0b-f20e-46e0-bfc9-445ae2d6155e",
        "htmlId": "A21287",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:05.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "0b1bc45e53d540ef8f62c43ca508afed",
            "number": "A21287",
            "deviceTwin": {
              "deviceId": "0b1bc45e53d540ef8f62c43ca508afed",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:40Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "aaebde72-7571-489f-8cd6-44d12e8f035f",
        "htmlId": "A21251",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "0b6c1adddd1e4afe9f5ba741a4588272",
            "number": "A21251",
            "deviceTwin": {
              "deviceId": "0b6c1adddd1e4afe9f5ba741a4588272",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:52Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "f97b101f-2410-4ee2-afad-ca4f348e106a",
        "htmlId": "A21317",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:11.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "117a9199931444b39df56a398dde7ede",
            "number": "A21317",
            "deviceTwin": {
              "deviceId": "117a9199931444b39df56a398dde7ede",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:01Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "e24937b0-6516-4d95-b5fb-3027c3f296b9",
        "htmlId": "A21247",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:56.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "147cd5c301704ab1991766821e05f37a",
            "number": "A21247",
            "deviceTwin": {
              "deviceId": "147cd5c301704ab1991766821e05f37a",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:26:03Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "9c5cb20b-5b80-43b4-a143-e78a8d027331",
        "htmlId": "A21285",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:05.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "14eec8d42c83470687bb82da6b171894",
            "number": "A21285",
            "deviceTwin": {
              "deviceId": "14eec8d42c83470687bb82da6b171894",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:51Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "1c92920f-7243-43ad-87e6-6b002030ec85",
        "htmlId": "A21252",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "1881306179e24f90a651b2fd71106f29",
            "number": "A21252",
            "deviceTwin": {
              "deviceId": "1881306179e24f90a651b2fd71106f29",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:23Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "403a2832-19f5-40d2-a1a6-4baa971635c5",
        "htmlId": "A21221",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:51.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "1c4efc84be1144faafd749d92a7ec905",
            "number": "A21221",
            "deviceTwin": {
              "deviceId": "1c4efc84be1144faafd749d92a7ec905",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-19T23:33:57Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "58869b91-cdc4-4e0f-92cf-b1cde2895624",
        "htmlId": "A21268",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "1d30d7999bc14cf3809e0a7ce07db218",
            "number": "A21268",
            "deviceTwin": {
              "deviceId": "1d30d7999bc14cf3809e0a7ce07db218",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:25Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "9122757b-36ff-49cc-a679-75995556ad84",
        "htmlId": "A21209",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:48.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "1e780f42b7dc43c4adbe1a3ba05e2b3c",
            "number": "A21209",
            "deviceTwin": {
              "deviceId": "1e780f42b7dc43c4adbe1a3ba05e2b3c",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:55Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "fcf56e66-911e-46ee-8dda-8fb2132ce73d",
        "htmlId": "A21270",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "22d051d872cf4c59813529a9ede81c46",
            "number": "A21270",
            "deviceTwin": {
              "deviceId": "22d051d872cf4c59813529a9ede81c46",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:31Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "13662d83-75a1-4673-8aad-0a16ec335fdb",
        "htmlId": "A21266",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:01.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "245447de89844e0e8c6bd47eebbf9eef",
            "number": "A21266",
            "deviceTwin": {
              "deviceId": "245447de89844e0e8c6bd47eebbf9eef",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-22T04:25:43Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "4a9604f3-a777-4364-957c-32c22326632d",
        "htmlId": "A21259",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:58.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "2e2d86d5dab64397ba23474e2a06dfe4",
            "number": "A21259",
            "deviceTwin": {
              "deviceId": "2e2d86d5dab64397ba23474e2a06dfe4",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:51Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "771707f7-8235-4240-b7b5-0e8e8f34ab55",
        "htmlId": "A21299",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:07.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "32c18ca9bc9a462ab4348b825a42fab3",
            "number": "A21299",
            "deviceTwin": {
              "deviceId": "32c18ca9bc9a462ab4348b825a42fab3",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-22T08:16:56Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "5b86914d-c6e5-471a-b434-616d067af57c",
        "htmlId": "A21238",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:54.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "35dda47beb684f31b197dd1244c83d3e",
            "number": "A21238",
            "deviceTwin": {
              "deviceId": "35dda47beb684f31b197dd1244c83d3e",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:12Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "cc2c64a9-9e54-4f56-8931-9640b9be0e21",
        "htmlId": "A21235",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:54.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "3627cd1f794f4279a4f9cf21d79f299d",
            "number": "A21235",
            "deviceTwin": {
              "deviceId": "3627cd1f794f4279a4f9cf21d79f299d",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:41Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "91bd47a4-13d3-4985-8757-119697583ca5",
        "htmlId": "A21293",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "3a04b207c45d4558b1850c93ae317820",
            "number": "A21293",
            "deviceTwin": {
              "deviceId": "3a04b207c45d4558b1850c93ae317820",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:41Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "08b23c97-1d18-431b-9f62-c26c7cab077d",
        "htmlId": "A21290",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "3afc7c0ba5324bdbbebb3d6cf9c0c280",
            "number": "A21290",
            "deviceTwin": {
              "deviceId": "3afc7c0ba5324bdbbebb3d6cf9c0c280",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:19Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "422cfc80-4be9-4622-9352-048b00c10fc5",
        "htmlId": "A21215",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:50.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "3b6f1eff3b6e465abe6ed69acf72e53b",
            "number": "A21215",
            "deviceTwin": {
              "deviceId": "3b6f1eff3b6e465abe6ed69acf72e53b",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-19T23:34:49Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "95b72d51-742d-4302-8db3-6366ff788874",
        "htmlId": "A21242",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:55.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "3d55281a1eec42a38079d32fbfc53f88",
            "number": "A21242",
            "deviceTwin": {
              "deviceId": "3d55281a1eec42a38079d32fbfc53f88",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-09-30T09:45:02Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "c0d6bd85-f583-4678-af7a-2a7f69e4490d",
        "htmlId": "A21225",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:52.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "3e747fd7cc944e79b48b71f31765d63d",
            "number": "A21225",
            "deviceTwin": {
              "deviceId": "3e747fd7cc944e79b48b71f31765d63d",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:59Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "3cd724a4-a55c-41d1-a524-46d7236c52b7",
        "htmlId": "A21206",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:47.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "3fa0cda7a82140678b751c82c72fef67",
            "number": "A21206",
            "deviceTwin": {
              "deviceId": "3fa0cda7a82140678b751c82c72fef67",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:53Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "617bfe15-f3b0-44a2-adb1-d3024ac303ab",
        "htmlId": "A21289",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "41a92e825c4a44e9b7790cfb101216c1",
            "number": "A21289",
            "deviceTwin": {
              "deviceId": "41a92e825c4a44e9b7790cfb101216c1",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-17T11:41:15Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "e5cc6c53-105d-48b4-806d-c66f84b1fbf2",
        "htmlId": "A21272",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "42a6be76e75d4061b95f3c49d984a704",
            "number": "A21272",
            "deviceTwin": {
              "deviceId": "42a6be76e75d4061b95f3c49d984a704",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-25T03:48:33Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "f99f6911-1245-479e-af78-87dd611bda55",
        "htmlId": "A21308",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:09.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "4413268a5b034c9fb6b56328beb82fb7",
            "number": "A21308",
            "deviceTwin": {
              "deviceId": "4413268a5b034c9fb6b56328beb82fb7",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-10T12:24:45Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "72541b69-dca1-44bb-bae3-42e6e6bc32d0",
        "htmlId": "A21207",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:47.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "4633aba06d23460ab160a1d89e5fb107",
            "number": "A21207",
            "deviceTwin": {
              "deviceId": "4633aba06d23460ab160a1d89e5fb107",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-10T02:29:16Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "a02dc19c-f462-40cd-b7e5-65fad1622187",
        "htmlId": "A21320",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:12.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "46c7bc61ba2c495da3b2a0d1b0d8b726",
            "number": "A21320",
            "deviceTwin": {
              "deviceId": "46c7bc61ba2c495da3b2a0d1b0d8b726",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:24:09Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "5eb73554-efba-4ebc-b628-27ce5ee1bb83",
        "htmlId": "A21263",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:59.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "49795147a51b40b1a06aacfdaa707bf0",
            "number": "A21263",
            "deviceTwin": {
              "deviceId": "49795147a51b40b1a06aacfdaa707bf0",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-25T11:42:21Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "3762b2f0-2377-4efe-a5bb-279c5f2ea17a",
        "htmlId": "A21216",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:50.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "4c3cc00896b14b62b8c78ac19ebc4ddf",
            "number": "A21216",
            "deviceTwin": {
              "deviceId": "4c3cc00896b14b62b8c78ac19ebc4ddf",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:14Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "eaf68463-f532-407f-bcd4-a4edf5a13175",
        "htmlId": "A21230",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "4c4eabf66b1f4d6aa611eb63328de787",
            "number": "A21230",
            "deviceTwin": {
              "deviceId": "4c4eabf66b1f4d6aa611eb63328de787",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:27:18Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "25323dc3-9b3d-4ebe-820f-8380e1cce652",
        "htmlId": "A21279",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "4c71dd21d022419fa66321473380dd27",
            "number": "A21279",
            "deviceTwin": {
              "deviceId": "4c71dd21d022419fa66321473380dd27",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-30T06:50:54Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "ed8889bc-4211-4be0-9f0b-a9c620ac106b",
        "htmlId": "A21248",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "4ca9e4c33ef847749cca8fdf96b64d3b",
            "number": "A21248",
            "deviceTwin": {
              "deviceId": "4ca9e4c33ef847749cca8fdf96b64d3b",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-23T03:50:35Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "6e744579-be60-4fcd-9efb-53f141bcd7f5",
        "htmlId": "A21250",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "51aa70ad0c894033979ca2fcc04c17b4",
            "number": "A21250",
            "deviceTwin": {
              "deviceId": "51aa70ad0c894033979ca2fcc04c17b4",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-22T01:22:42Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "744da37a-1332-473a-aabe-289284bfa497",
        "htmlId": "A21281",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "52148f151e3b474f9ec6006ef27d08e3",
            "number": "A21281",
            "deviceTwin": {
              "deviceId": "52148f151e3b474f9ec6006ef27d08e3",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:10Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "686ca838-d345-4b3a-bada-2d9f5369bbb7",
        "htmlId": "A21237",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:54.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "5358775372584dd69e2117f126017746",
            "number": "A21237",
            "deviceTwin": {
              "deviceId": "5358775372584dd69e2117f126017746",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:42Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "96f661ae-4f01-44f9-8351-b6906061e20b",
        "htmlId": "A21301",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:08.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "55649169037c4b28bae9f2183b430f64",
            "number": "A21301",
            "deviceTwin": {
              "deviceId": "55649169037c4b28bae9f2183b430f64",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:27:30Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "2871554c-8750-4105-b89d-98743b3aa03c",
        "htmlId": "A21253",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "59a3610bb8e44d97843fe480a3851d53",
            "number": "A21253",
            "deviceTwin": {
              "deviceId": "59a3610bb8e44d97843fe480a3851d53",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:49Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0511cd08-6679-4fe8-9e97-8ed53b8f7235",
        "htmlId": "A21297",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:07.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "5a2e5f13d3004bba9e7d3448cc2c23d5",
            "number": "A21297",
            "deviceTwin": {
              "deviceId": "5a2e5f13d3004bba9e7d3448cc2c23d5",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:11Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "af3f934b-a94f-4b9c-8be2-8c191910ad3f",
        "htmlId": "A21224",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:52.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "5e81a1844732460bbca7eea79231c16e",
            "number": "A21224",
            "deviceTwin": {
              "deviceId": "5e81a1844732460bbca7eea79231c16e",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:20Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "b3602361-c3e4-45ce-bb7f-0f07965d2c10",
        "htmlId": "A21311",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:10.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "64784214bc874e1683d333986e5fc474",
            "number": "A21311",
            "deviceTwin": {
              "deviceId": "64784214bc874e1683d333986e5fc474",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:11Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "e4ec4e6e-e474-46bd-8583-801ffa5538c4",
        "htmlId": "A21232",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "65fecdfc8dfa4b0aa723fde5c11b5671",
            "number": "A21232",
            "deviceTwin": {
              "deviceId": "65fecdfc8dfa4b0aa723fde5c11b5671",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-09-26T09:30:06Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "524d0c26-fc8d-4af2-9a07-22499fa40ed1",
        "htmlId": "A21291",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "678837f4b47046bfb8da82657b0c85ea",
            "number": "A21291",
            "deviceTwin": {
              "deviceId": "678837f4b47046bfb8da82657b0c85ea",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-24T08:00:20Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "e12e579a-6895-4d3e-a07f-cf9c34e9e66a",
        "htmlId": "A21274",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:03.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "68864748f02d4601817b1379ab748a15",
            "number": "A21274",
            "deviceTwin": {
              "deviceId": "68864748f02d4601817b1379ab748a15",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:53Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "5908a582-b1ed-42d1-8e4d-a0b4bfba01c4",
        "htmlId": "A21292",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "6d3a21d555974d6eacedb5841454937f",
            "number": "A21292",
            "deviceTwin": {
              "deviceId": "6d3a21d555974d6eacedb5841454937f",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:23:56Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0ca44b85-fe34-4e28-9b48-fd10a966ff0c",
        "htmlId": "A21286",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:05.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "6de50d3c79044aaa95cb5c0185388c17",
            "number": "A21286",
            "deviceTwin": {
              "deviceId": "6de50d3c79044aaa95cb5c0185388c17",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:16Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "1388db96-0162-4062-8188-8afae7fe56c1",
        "htmlId": "A21217",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:50.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "7009b01a375b4ee78843838f96130163",
            "number": "A21217",
            "deviceTwin": {
              "deviceId": "7009b01a375b4ee78843838f96130163",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:29Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "8138093b-6a85-479f-8a56-67e0bacaff70",
        "htmlId": "A21323",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:13.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "7039abbb62ee440a91a3f77ceec20920",
            "number": "A21323",
            "deviceTwin": {
              "deviceId": "7039abbb62ee440a91a3f77ceec20920",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-26T05:35:37Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "65022ab8-810c-41f9-b137-34dcb93de294",
        "htmlId": "A21256",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:58.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "729607566cda4dee873623a4d05bfaf4",
            "number": "A21256",
            "deviceTwin": {
              "deviceId": "729607566cda4dee873623a4d05bfaf4",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:52Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "02aadff0-ea5e-4abf-a36c-e38ad5d5337f",
        "htmlId": "A21254",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "73a91d2f0df04e108d6b5e71a7fdd363",
            "number": "A21254",
            "deviceTwin": {
              "deviceId": "73a91d2f0df04e108d6b5e71a7fdd363",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:59Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0bbf5644-e9d6-4514-800c-d460e95e677a",
        "htmlId": "A21244",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:56.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "7627a47841c04d5180880bdbdcbc4240",
            "number": "A21244",
            "deviceTwin": {
              "deviceId": "7627a47841c04d5180880bdbdcbc4240",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:01Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "9e65084b-761b-4f44-b77a-d25215427eee",
        "htmlId": "A21249",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:57.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "784cd2fbf761430e9bfca9fd7384e152",
            "number": "A21249",
            "deviceTwin": {
              "deviceId": "784cd2fbf761430e9bfca9fd7384e152",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:23Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "4429aa10-2dcc-4fde-a44e-708b37954e81",
        "htmlId": "A21303",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:08.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "79a366bd3f5a4e2a8ffe29d1a07a14af",
            "number": "A21303",
            "deviceTwin": {
              "deviceId": "79a366bd3f5a4e2a8ffe29d1a07a14af",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:18Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "cd426baf-2665-40b2-b42c-4868570cd719",
        "htmlId": "A21255",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:58.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "7a3fa2dd16a44549b0fbcad3eff5f216",
            "number": "A21255",
            "deviceTwin": {
              "deviceId": "7a3fa2dd16a44549b0fbcad3eff5f216",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-30T05:34:46Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "a01a589c-4839-4735-91a2-f09c377fcbad",
        "htmlId": "A21257",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:58.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "7b3ffffa4b9a4e99b8a8d2e9db970358",
            "number": "A21257",
            "deviceTwin": {
              "deviceId": "7b3ffffa4b9a4e99b8a8d2e9db970358",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:08Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "11273385-dd02-4807-9935-47c290f77543",
        "htmlId": "A21218",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:50.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "7d78e405af7741d6ba3b40d4c405efad",
            "number": "A21218",
            "deviceTwin": {
              "deviceId": "7d78e405af7741d6ba3b40d4c405efad",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:06Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "459f952d-c6c6-4ebe-86c7-840a62fb8ff8",
        "htmlId": "A21277",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:03.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "7fce39a3e68c4cc0a7ea9b85b5cde725",
            "number": "A21277",
            "deviceTwin": {
              "deviceId": "7fce39a3e68c4cc0a7ea9b85b5cde725",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:23:54Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "31ae5e88-3f3e-46de-98c8-427d0055ef4c",
        "htmlId": "A21282",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "7fd41f3809914c85bb94a2fa04c170ae",
            "number": "A21282",
            "deviceTwin": {
              "deviceId": "7fd41f3809914c85bb94a2fa04c170ae",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:26Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "e519d2c9-2c33-49b0-928b-7f7b95cc2b6a",
        "htmlId": "A21210",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:49.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "80344cc14d674c4aa692d37a393acb53",
            "number": "A21210",
            "deviceTwin": {
              "deviceId": "80344cc14d674c4aa692d37a393acb53",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:24:48Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "68a401aa-d24a-4913-9159-91a37ccf9e35",
        "htmlId": "A21304",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:08.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "817b7d1293aa45f0baf7478a1e519124",
            "number": "A21304",
            "deviceTwin": {
              "deviceId": "817b7d1293aa45f0baf7478a1e519124",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:23:26Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "8bb6dd7a-50e0-4c1f-8160-9aba6f79d960",
        "htmlId": "A21245",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:56.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "85d76738c2a84e5b92afd4af50ec7af3",
            "number": "A21245",
            "deviceTwin": {
              "deviceId": "85d76738c2a84e5b92afd4af50ec7af3",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:54Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "918b4a0f-03d4-4020-b98a-9c36d34bf373",
        "htmlId": "A21300",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:08.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "88e993eba37f481a8debeb99cb59d22b",
            "number": "A21300",
            "deviceTwin": {
              "deviceId": "88e993eba37f481a8debeb99cb59d22b",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:25Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "83050289-66a3-434c-a061-2d86e96196e1",
        "htmlId": "A21219",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:51.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "896757e305ec499e8d081ff989eb23a4",
            "number": "A21219",
            "deviceTwin": {
              "deviceId": "896757e305ec499e8d081ff989eb23a4",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-29T08:58:36Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "cabc95f3-62e1-4319-a5c5-56bc21a60a0f",
        "htmlId": "A21280",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "8c2c8a5492f043b1a6e2433f737dfff9",
            "number": "A21280",
            "deviceTwin": {
              "deviceId": "8c2c8a5492f043b1a6e2433f737dfff9",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:49Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "1d3f77ee-5a0e-45a0-8a3b-f993eef1dad8",
        "htmlId": "A21208",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:47.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "8d1ba1effb314b7ba580c388f29a9728",
            "number": "A21208",
            "deviceTwin": {
              "deviceId": "8d1ba1effb314b7ba580c388f29a9728",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:44Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "9fe70fd7-e611-4abc-bc5e-0f70190a53b6",
        "htmlId": "A21295",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:07.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "91bc5f2f43a64c599a552d856d9d5591",
            "number": "A21295",
            "deviceTwin": {
              "deviceId": "91bc5f2f43a64c599a552d856d9d5591",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T01:05:38Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "8a3e526a-a4de-4adf-8a5f-2b500ef4d888",
        "htmlId": "A21258",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:58.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "95988db05105445ea6eedd5db1736777",
            "number": "A21258",
            "deviceTwin": {
              "deviceId": "95988db05105445ea6eedd5db1736777",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-29T08:47:39Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "afcbdf77-6bf7-4f8f-9461-33cc92d721f8",
        "htmlId": "A21246",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:56.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "96f5d0fc33854f00b0e942d1f594f411",
            "number": "A21246",
            "deviceTwin": {
              "deviceId": "96f5d0fc33854f00b0e942d1f594f411",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-10T06:29:29Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "32e7716f-eade-4275-89ca-7989eed3e609",
        "htmlId": "A21265",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:00.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "972dc9d7c26142d1b917a99ea835e935",
            "number": "A21265",
            "deviceTwin": {
              "deviceId": "972dc9d7c26142d1b917a99ea835e935",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:23:25Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "40d9df7d-334a-47ec-a94e-1450103999a2",
        "htmlId": "A21234",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:54.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "98d6bab560914830a2353d1f819d92e1",
            "number": "A21234",
            "deviceTwin": {
              "deviceId": "98d6bab560914830a2353d1f819d92e1",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:56Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "1aaf796c-a59e-47ef-b274-44b8170dd011",
        "htmlId": "A21283",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "9ae11a808de849a0b118e5ed0361b82d",
            "number": "A21283",
            "deviceTwin": {
              "deviceId": "9ae11a808de849a0b118e5ed0361b82d",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:52Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "84289397-4a27-4e27-826f-9c92a97f15bd",
        "htmlId": "A21309",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:09.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "9caf3331b1404e8bb0a8e449ceb2722c",
            "number": "A21309",
            "deviceTwin": {
              "deviceId": "9caf3331b1404e8bb0a8e449ceb2722c",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-30T01:00:32Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "b3da32a4-c59e-4761-a7f1-6dc920a4aae5",
        "htmlId": "A21314",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:10.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "9caf374517c643e0ab78ebae3508dd06",
            "number": "A21314",
            "deviceTwin": {
              "deviceId": "9caf374517c643e0ab78ebae3508dd06",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-10T01:47:09Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "b6e3b8af-94a9-4994-8f7c-3ccd81ddf676",
        "htmlId": "A21302",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:08.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "9d84d90f510a4cfa9c693d53d4e6cc71",
            "number": "A21302",
            "deviceTwin": {
              "deviceId": "9d84d90f510a4cfa9c693d53d4e6cc71",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:09Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "2781c18d-2683-4c26-be1a-6497cd89109c",
        "htmlId": "A21229",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "a268a382c6154c36b76c0ba47f5e497d",
            "number": "A21229",
            "deviceTwin": {
              "deviceId": "a268a382c6154c36b76c0ba47f5e497d",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:05Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "688508d6-6415-4dd3-abe0-942ce4bf65d7",
        "htmlId": "A21226",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:52.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "a2ddf84b9d5049e1b364c896443468e2",
            "number": "A21226",
            "deviceTwin": {
              "deviceId": "a2ddf84b9d5049e1b364c896443468e2",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:50Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "a6868451-6f49-4734-a0a5-3be55636a2c6",
        "htmlId": "A21269",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "a2f03e426d4c4633843529db2646e27a",
            "number": "A21269",
            "deviceTwin": {
              "deviceId": "a2f03e426d4c4633843529db2646e27a",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:25Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "78ab88e4-c839-4cf8-aa54-c6f1719ae6cc",
        "htmlId": "A21306",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:09.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "a340ab4d7b6644eebb96c9e7b9546237",
            "number": "A21306",
            "deviceTwin": {
              "deviceId": "a340ab4d7b6644eebb96c9e7b9546237",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-29T08:49:57Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "60899878-a36e-4107-8423-576fcd460052",
        "htmlId": "A21239",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:55.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "a662ebd7a353476d9b1ff762ac5b72db",
            "number": "A21239",
            "deviceTwin": {
              "deviceId": "a662ebd7a353476d9b1ff762ac5b72db",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-22T06:21:43Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "fa7c2b91-71a7-4a67-96e6-5f6545b91d83",
        "htmlId": "A21264",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:00.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "aa047ef929d84ebb82c453bf03703b16",
            "number": "A21264",
            "deviceTwin": {
              "deviceId": "aa047ef929d84ebb82c453bf03703b16",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:05Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "1b2798e1-c60c-411a-a4e4-1b88767435b1",
        "htmlId": "A21213",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:49.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "ad17f2f53cdf48bd9f16027523992a0f",
            "number": "A21213",
            "deviceTwin": {
              "deviceId": "ad17f2f53cdf48bd9f16027523992a0f",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-18T00:27:05Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "ae2afbc5-22d9-4732-b9e0-5f84802183eb",
        "htmlId": "A21211",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:49.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "adb21ece788a48f1a74899466cd156a3",
            "number": "A21211",
            "deviceTwin": {
              "deviceId": "adb21ece788a48f1a74899466cd156a3",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:26:16Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "a0c920c1-471d-494d-8989-c6cee4389bb1",
        "htmlId": "A21261",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:59.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "b110ce9c6b7a46859cdcee2f04a7606e",
            "number": "A21261",
            "deviceTwin": {
              "deviceId": "b110ce9c6b7a46859cdcee2f04a7606e",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:07Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "f5e88999-e47e-4787-925d-e8476f56e264",
        "htmlId": "A21319",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:12.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "b2caa1cb45c84b408975f36c8d98bd26",
            "number": "A21319",
            "deviceTwin": {
              "deviceId": "b2caa1cb45c84b408975f36c8d98bd26",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-10T01:13:17Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "fe04df34-b3fd-4ef3-9984-66a23ae6e537",
        "htmlId": "A21243",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:56.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "b620f11d8543474aaefb84c2b28d73fc",
            "number": "A21243",
            "deviceTwin": {
              "deviceId": "b620f11d8543474aaefb84c2b28d73fc",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:27:35Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0404ed96-3856-44b9-b4d9-67afaf0ec424",
        "htmlId": "A21318",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:11.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "b79ca0fc6881475dad65bb8413dbe809",
            "number": "A21318",
            "deviceTwin": {
              "deviceId": "b79ca0fc6881475dad65bb8413dbe809",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-24T07:23:43Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "df84ec65-71ea-4eb1-a8be-0701a21ac475",
        "htmlId": "A21260",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:59.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "b7da540b28b04f3aabf3f62fef19d915",
            "number": "A21260",
            "deviceTwin": {
              "deviceId": "b7da540b28b04f3aabf3f62fef19d915",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-29T04:50:13Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "7bbaec63-3b55-4a7e-bc64-6f0ad5a0aea4",
        "htmlId": "A21227",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:52.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "b9fb71bcc7bb4473a7588cfd76daf9eb",
            "number": "A21227",
            "deviceTwin": {
              "deviceId": "b9fb71bcc7bb4473a7588cfd76daf9eb",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-29T09:38:56Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "fd27c6f4-7f2b-4f3a-bb37-a41e16b0caf4",
        "htmlId": "A21267",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:01.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "bb055c338557410eab7da425ad40070e",
            "number": "A21267",
            "deviceTwin": {
              "deviceId": "bb055c338557410eab7da425ad40070e",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:38Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0e722d67-d756-4c71-bcd7-e288da7e2929",
        "htmlId": "A21228",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "bc42bdc13f8147eebb14653cf4671018",
            "number": "A21228",
            "deviceTwin": {
              "deviceId": "bc42bdc13f8147eebb14653cf4671018",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:36Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "567582fe-21a1-4ff7-a20f-4b83b74b968c",
        "htmlId": "A21275",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:03.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "bf4a6d3f034f4d98856211f5c5b0b994",
            "number": "A21275",
            "deviceTwin": {
              "deviceId": "bf4a6d3f034f4d98856211f5c5b0b994",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:46Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "8d70c002-2307-46d4-8d62-acef29e3270e",
        "htmlId": "A21276",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:03.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "c094856523e34885b6279bb6c24a797a",
            "number": "A21276",
            "deviceTwin": {
              "deviceId": "c094856523e34885b6279bb6c24a797a",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:33Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "0e251849-769e-4ddc-8d39-61500861fe44",
        "htmlId": "A21315",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:11.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "c17b3de3169f4996809ca97069f2ff48",
            "number": "A21315",
            "deviceTwin": {
              "deviceId": "c17b3de3169f4996809ca97069f2ff48",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-10T01:19:03Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "cf5e87fe-10cd-44a4-bd78-d818023dd51c",
        "htmlId": "A21214",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:50.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "c3cbb85812354a90bc22608ecf447885",
            "number": "A21214",
            "deviceTwin": {
              "deviceId": "c3cbb85812354a90bc22608ecf447885",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:23:22Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "2a1e480a-f84e-46b7-b269-31e19058adf0",
        "htmlId": "A21284",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:04.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "cc0401d555494aa4907d430f60f0b3a0",
            "number": "A21284",
            "deviceTwin": {
              "deviceId": "cc0401d555494aa4907d430f60f0b3a0",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:29Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "33a110f7-d7a0-4d57-aed2-36bfb91b2018",
        "htmlId": "A21307",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:09.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "cce4365630ad456e8242b5e020d48220",
            "number": "A21307",
            "deviceTwin": {
              "deviceId": "cce4365630ad456e8242b5e020d48220",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:20Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "f2f6efdd-fabd-4b7d-afa3-48e235e25fd1",
        "htmlId": "A21321",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:13.000Z",
        "updatedAt": "2018-09-11T10:00:42.000Z",
        "devices": [
          {
            "id": "cd0e5db5022f4e9abcba586211261c87",
            "number": "A21321",
            "deviceTwin": {
              "deviceId": "cd0e5db5022f4e9abcba586211261c87",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:30Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "3a1da35d-606e-44f8-a5d1-beeffe81bcda",
        "htmlId": "A21273",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "cf17e402cf9e45f09291e8ad9679a704",
            "number": "A21273",
            "deviceTwin": {
              "deviceId": "cf17e402cf9e45f09291e8ad9679a704",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:27:59Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "fd622151-a9e5-4b3c-8cf0-6208d787eadc",
        "htmlId": "A21310",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:10.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "d14944a209f54ff5a733de68f50df6a1",
            "number": "A21310",
            "deviceTwin": {
              "deviceId": "d14944a209f54ff5a733de68f50df6a1",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:25:08Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "49eef74a-571c-421a-b700-31d09666d763",
        "htmlId": "A21271",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:02.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "d2463cf4342b4b2fa7fb5fdec12dc189",
            "number": "A21271",
            "deviceTwin": {
              "deviceId": "d2463cf4342b4b2fa7fb5fdec12dc189",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-29T04:16:40Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "45b13b72-9fd4-4e28-9acc-54f8c45ef8f6",
        "htmlId": "A21233",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:53.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "d7fc10bf48cd4dfd9669b52be319d1df",
            "number": "A21233",
            "deviceTwin": {
              "deviceId": "d7fc10bf48cd4dfd9669b52be319d1df",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:02Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "463911dc-2379-418e-8369-4e482e021174",
        "htmlId": "A21316",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:11.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "d8899c4f23b945b6a77677621c9544fb",
            "number": "A21316",
            "deviceTwin": {
              "deviceId": "d8899c4f23b945b6a77677621c9544fb",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:25:21Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "ffcd407f-60cb-417c-b6d2-ef2adcb9d975",
        "htmlId": "A21223",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:52.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "db81b1f65349459988d99ce32c891f71",
            "number": "A21223",
            "deviceTwin": {
              "deviceId": "db81b1f65349459988d99ce32c891f71",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:13Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "55a5cf3f-2545-4555-affa-a74b66d99944",
        "htmlId": "A21240",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:55.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "dc215fe827b54d6c89af1f18b401f157",
            "number": "A21240",
            "deviceTwin": {
              "deviceId": "dc215fe827b54d6c89af1f18b401f157",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-19T17:21:29Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "84d1e6d3-1026-4c70-8035-d87338166674",
        "htmlId": "A21294",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:06.000Z",
        "updatedAt": "2018-09-11T10:00:40.000Z",
        "devices": [
          {
            "id": "dc3ff1886e8c4929b7d136c77f59686a",
            "number": "A21294",
            "deviceTwin": {
              "deviceId": "dc3ff1886e8c4929b7d136c77f59686a",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:24:32Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "3d31420f-4e87-41b4-8163-30ea702e6970",
        "htmlId": "A21322",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:13.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "dcccaca9d2804688a9dbd011a52c46a8",
            "number": "A21322",
            "deviceTwin": {
              "deviceId": "dcccaca9d2804688a9dbd011a52c46a8",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-09-30T10:19:41Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "393e037f-b87a-4dcb-bf0c-3c3c66b29357",
        "htmlId": "A21241",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:55.000Z",
        "updatedAt": "2018-09-11T10:00:39.000Z",
        "devices": [
          {
            "id": "de2e3f3c27394603a13c966706c420a1",
            "number": "A21241",
            "deviceTwin": {
              "deviceId": "de2e3f3c27394603a13c966706c420a1",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:26:17Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "df7e7e29-adc3-4347-a175-9a979545316d",
        "htmlId": "A21313",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:10.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "e41ee5b52d4c4bf5809385c7e3f3aa9c",
            "number": "A21313",
            "deviceTwin": {
              "deviceId": "e41ee5b52d4c4bf5809385c7e3f3aa9c",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-10T10:49:38Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "3f6472ee-29a5-4121-b8be-7cea4be927f7",
        "htmlId": "A21278",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:03.000Z",
        "updatedAt": "2018-09-11T10:00:38.000Z",
        "devices": [
          {
            "id": "e5f117cefbd748d3ad3c753a70161a67",
            "number": "A21278",
            "deviceTwin": {
              "deviceId": "e5f117cefbd748d3ad3c753a70161a67",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-31T02:26:46Z",
              "status": "online"
            }
          }
        ]
      },
      {
        "id": "a523e71b-667d-4fd6-8709-cce64179c30d",
        "htmlId": "A21212",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:49.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "ea3cb154997649478ea1394e4655436e",
            "number": "A21212",
            "deviceTwin": {
              "deviceId": "ea3cb154997649478ea1394e4655436e",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-22T01:53:28Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "035f5f49-2d1f-4ce3-a277-7185b53484a8",
        "htmlId": "A21220",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:51.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "ec1bbfd8a1064580bb896f0e5978d491",
            "number": "A21220",
            "deviceTwin": {
              "deviceId": "ec1bbfd8a1064580bb896f0e5978d491",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-22T01:58:52Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "1cbe480b-07ef-439c-8043-8c7961174496",
        "htmlId": "A21296",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:07.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "ef8e56bfe0d34128b7d0148845f70157",
            "number": "A21296",
            "deviceTwin": {
              "deviceId": "ef8e56bfe0d34128b7d0148845f70157",
              "locked": "off",
              "humansensor": "1",
              "height": "",
              "lastTime": "2018-10-23T04:17:12Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "519568b0-fc56-4015-9bd8-84b8e08c2c1e",
        "htmlId": "A21312",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:20:10.000Z",
        "updatedAt": "2018-09-11T10:00:43.000Z",
        "devices": [
          {
            "id": "f065b03d9b604206b579c52e729a5b6a",
            "number": "A21312",
            "deviceTwin": {
              "deviceId": "f065b03d9b604206b579c52e729a5b6a",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-08T00:59:42Z",
              "status": "offline"
            }
          }
        ]
      },
      {
        "id": "5eaf28b4-f4e8-4c69-b54d-c5af2f3fe88d",
        "htmlId": "A21236",
        "type": null,
        "companyId": "16",
        "isDel": false,
        "createdAt": "2018-06-22T02:19:54.000Z",
        "updatedAt": "2018-09-11T10:00:41.000Z",
        "devices": [
          {
            "id": "f9f653ed73684ae4a3e9eeae7f165ac5",
            "number": "A21236",
            "deviceTwin": {
              "deviceId": "f9f653ed73684ae4a3e9eeae7f165ac5",
              "locked": "off",
              "humansensor": "0",
              "height": "",
              "lastTime": "2018-10-31T02:23:21Z",
              "status": "online"
            }
          }
        ]
      }
    ]
  };

  const url = filterUrl({ ...payload, token: getToken() });
  return request(`${API_URL}/space/desk/status?${url}`, {
    method: 'GET',
  });
}
