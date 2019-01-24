// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import G from '@/global';
import { spacexUser } from '@/locales/user';
import { getLocale } from 'umi/locale';

const { globalStartTime } = G;
const {
  strokeOffline,
  fillOffline,
  strokeVacant,
  fillVacant,
  strokeOccupied,
  fillOccupied,
} = G.svgColor;

export function random(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'LAST_DAY') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'LAST_7DAYS') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'LAST_30DAYS') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    // console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

// 过滤 url
export function filterUrl(url) {
  let newUrl = '';
  let count = 0;
  for (const p in url) {
    if (url[p] || typeof (url[p] === 'number')) {
      if (count === 0) {
        newUrl = `${newUrl + p}=${url[p]}`;
      } else {
        newUrl = `${newUrl}&${p}=${url[p]}`;
      }
      count += 1;
    }
  }
  return newUrl;
}

// 过滤 body
export function filterBody(body) {
  const filter = G._.mapKeys(body, (value, key) => {
    if (typeof value !== 'object' && (value || typeof value === 'boolean')) {
      return key;
    }
    if (!G._.isEmpty(value)) {
      if (value instanceof Array) {
        if (value.length > 1 || !G._.isEmpty(value[0])) {
          return key;
        }
      } else {
        return key;
      }
    }
  });
  delete filter.undefined;
  return filter;
}

// 过滤编辑 body
export function filterEdit(body) {
  const filter = G._.mapValues(body, o => {
    if (o || typeof (o) === 'number') {
      return o;
    }
    return '';
  });
  return filter;
}

// 根据时间类型返回对应时间和单位
export function getTimeByType(date, type) {
  if (type === 'LAST_DAY') {
    return `${date}:00`;
  }
  if (type === 'LAST_7DAYS') {
    return G.moment.unix(date).format('dddd');
  }
  if (type === 'LAST_30DAYS') {
    return G.moment.unix(date).format('Do');
  }
  if (type === 'LAST_YEAR') {
    return G.moment.unix(date).format('MMM');
  }
}

export function getToken() {
  const state = window.g_app._store.getState();
  return state && state.user && state.user.user && state.user.user.token;
}

// 处理工位使用趋势的数据
export function processData(data) {
  const dateShow = data.date_type === "LAST_7DAYS" ? 'dddd' : (data.date_type === "LAST_30DAYS" ? 'Do' : 'MM');
  let useRateTend = []; const useRateAverage = []; const date = [];
  // 返回百分比数据
  if (data.type === "duration") {
    const useRateTendFirst = []; const useRateTendSecond = []; const useRateTendthird = [];
    data.dataList.map((item) => {
      useRateTendFirst.push({ type: '离线', date: G.moment(item.time).format(dateShow), value: item.offline_duration });
      useRateTendSecond.push({ type: '空闲', date: G.moment(item.time).format(dateShow), value: item.vacant_duration });
      useRateTendthird.push({ type: '使用', date: G.moment(item.time).format(dateShow), value: item.occupied_duration });
      useRateAverage.push({ date: G.moment(item.time).format(dateShow), value: item.daily_average_duration });
    })
    useRateTend = useRateTendFirst.concat(useRateTendSecond).concat(useRateTendthird);
  }
  // 返回数量
  if (data.type === "workStation") {
    const useRateTendFirst = { type: '离线' }; const useRateTendSecond = { type: '空闲' }; const useRateTendthird = { type: '使用' };
    data.dataList.map((item) => {
      date.push(G.moment(item.time).format(dateShow));
      useRateTendFirst[G.moment(item.time).format(dateShow)] = item.offline_duration;
      useRateTendSecond[G.moment(item.time).format(dateShow)] = item.vacant_duration;
      useRateTendthird[G.moment(item.time).format(dateShow)] = item.occupied_duration;
      useRateAverage.push({ date: G.moment(item.time).format(dateShow), value: item.daily_average_duration });
    })
    useRateTend.push(useRateTendFirst, useRateTendSecond, useRateTendthird);
  }
  return { useRateTend, useRateAverage, date }
}

// 处理服务时长统计数据
export function serviceData(data) {
  const serviceData = [];
  serviceData.push({ x: '使用时长', y: data.occupied_duration }, { x: '空闲时长', y: data.vacant_duration })
  return serviceData;
}

// 计算总时长
export function totalTime(data) {
  return `<div style="font-size:30px;color:#35536C;"><p style="line-height:28px;margin-bottom:0;">${data}</p><p style="font-size:10px;line-height:14px;">小时/工位/天</p></div>`;
}

// 处理功能权限未操作过的数据
export function checkUnOperateData(data) {
  const list = []; const content = [];
  data && data.length > 0 && data.forEach((item) => {
    list.push({ serviceId: item.serviceId, choose: item.choose });
    if (!G._.isEmpty(item.children)) {
      item.children.length > 0 && item.children.forEach((lItem) => {
        content.push({ serviceId: lItem.serviceId, choose: lItem.choose })
      })
    }
  })
  return list.concat(content);
}

export function checkAddPermission(data) {
  const list = [];
  data && data.map((item) => {
    item.child && item.child.map((lItem) => {
      if (lItem.choose === true) {
        list.push(lItem.menu_id)
      }
    })
  });
  return list;
}

export function getUserWithCToken(ctoken) {
  const user = G._.find(spacexUser, (value) => {
    return value.ctoken === ctoken;
  })
  return user;
}

export function getHourDuractionRate(status, hour, sensorLength, config, occupiedCount) {
  if (hour <= 5) {
    return 0;
  }
  let occupied = occupiedCount - 10;
  if ((hour > 5 && hour < 9) || hour > 20) {
    occupied = 10;
  } else if (hour > 18 && hour <= 20) {
    occupied = 20;
  } else if (hour >= 9 && hour <= 11) {
    occupied = 20;
  }
  const today = moment()
    .startOf('day')
    .format('D');
  let dutaction = 0;
  switch (status) {
    case 'Yesterday':
      if (today % 3 === 0) {
        occupied += config[hour % 10];
      } else {
        occupied -= config[hour % 10];
      }
      dutaction = parseInt((24 * sensorLength * occupied) / 100);
      break;
    case '7 Days':
      if (today % 7 === 0) {
        occupied -= config[hour % 10];
      } else {
        occupied += config[hour % 10];
      }
      const daysIntervalWeek = parseInt((moment().unix() - globalStartTime) / 86400);
      if (daysIntervalWeek >= 7) {
        dutaction = parseInt((24 * sensorLength * 7 * occupied) / 100);
      } else {
        dutaction = parseInt((24 * sensorLength * daysIntervalWeek * occupied) / 100);
      }
      break;
    case '30 Days':
      if (today % 4 === 0) {
        occupied -= config[hour % 10];
      } else {
        occupied += config[hour % 10];
      }
      const daysIntervalMonth = parseInt((moment().unix() - globalStartTime) / 86400);
      if (daysIntervalMonth >= 30) {
        dutaction = parseInt((24 * sensorLength * 30 * occupied) / 100);
      } else {
        dutaction = parseInt((24 * sensorLength * daysIntervalMonth * occupied) / 100);
      }
      break;
    case 'Year':
      if (today % 6 === 0) {
        occupied -= config[hour % 10];
      } else {
        occupied += config[hour % 10];
      }
      const daysIntervalYear = parseInt((moment().unix() - globalStartTime) / 86400);
      dutaction = parseInt((24 * sensorLength * daysIntervalYear * occupied) / 100);
      break;
    default:
      break;
  }
  return dutaction;
}

export function getUsingRankDuraction(index, status, occupiedCountRate, config, occupiedResort) {
  let lastTime = moment().unix() - globalStartTime;
  const fourWeek = 86400 * 28;
  let occupiedCount = occupiedCountRate;
  if (status === 'Last 4 Weeks' && lastTime >= fourWeek) {
    lastTime = fourWeek;
  }
  if (index % 3 === 0) {
    occupiedCount -= config[index];
  } else {
    occupiedCount += config[index];
  }
  if (status === 'Year') {
    occupiedCount -= 15;
  } else {
    occupiedCount -= 40;
  }
  if ((index >= 6 && index < 9) || (index >= 1 && index < 5)) {
    occupiedCount += occupiedCountRate;
  }
  const duraction = parseFloat(((lastTime * occupiedResort[index]) / 100 / 3600).toFixed(1));
  return duraction;
}

function filterOccupiedTime(occupiedTime, tag) {
  let isBetween = false;
  occupiedTime.forEach(value => {
    const timearr = value.split('-');
    const startTime = timearr[0];
    const endTime = timearr[1];
    const currentTime =
      moment().unix() -
      moment()
        .startOf('d')
        .unix();
    const startDuraction = parseTime(startTime);
    const endDuraction = parseTime(endTime);
    if (currentTime >= startDuraction && currentTime <= endDuraction) {
      isBetween = true;
    }
  });
  return isBetween;
}

export function isOccupiedTime(occupiedCountRate, sensor, occupiedTime) {
  const hour = parseInt(moment().format('H'));
  if (hour <= 6 || hour >= 23) return false;
  const tag = parseInt(sensor.split('_')[1]) + 1111;
  if ((hour > 6 && hour < 10) || (hour >= 18 && hour < 23)) {
    return filterOccupiedTime(occupiedTime, tag);
  }
  return random(0, 50) >= 20;
}

/**
 * 修改 svg 中所有元素的颜色以及统计每个状态的个数
 *
 * @param {array} data svg 元素数据
 * @param {object} svgDoc svg
 * @param {function} updateSvg 修改 svg 元素函数回调
 * @param {function} setCount 统计在线、离线个数回调
 */
export function updateSvgElement(data, svgDoc, updateSvg, setCount) {
  let offlineCount = 0;
  let vacantCount = 0;
  let occupiedCount = 0;
  for (let i = 0; i < data.length; i += 1) {
    const { tag, humansensor, status } = data[i];
    if (!tag) continue;
    const htmlId = tag.replace('_', '');
    const element = svgDoc.getElementById(htmlId);
    if (htmlId && element) {
      let stroke = '';
      let fill = '';
      if (status === 'offline') {
        offlineCount += 1;
        stroke = strokeOffline;
        fill = fillOffline;
      } else if (parseInt(humansensor, 10) === 0) {
        vacantCount += 1;
        stroke = strokeVacant;
        fill = fillVacant;
      } else {
        occupiedCount += 1;
        stroke = strokeOccupied;
        fill = fillOccupied;
      }
      updateSvg && updateSvg(element, stroke, fill);
    }
  }
  setCount && setCount({
    offlineCount,
    vacantCount,
    occupiedCount,
  });
}