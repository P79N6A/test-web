// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import G from '@/global';

import {
  random,
  getHourDuractionRate,
  getUsingRankDuraction,
  isOccupiedTime,
} from '@/utils/utils';
import { demoSensor } from '@/pages/Spacex/GlobalStatus/Map/config';

const { globalStartTime, moment, _ } = G;
const config = [3, 7, 2, 5, 8, 4, 0, 6, 9, 1];
const occupiedCountRate = 68;
const sensorLength = 37;

export function mockDemoStatus(payload) {
  return payload.tags.map(value => {
    const { tag, occupiedTime } = value;
    return {
      humansensor: isOccupiedTime(occupiedCountRate, tag, occupiedTime) ? '1' : '0',
      status: random(0, 100) === 1 ? 'offline' : 'online',
      tag,
    };
  });
}

export function mockServiceHour() {
  const rate = random(60, 70);
  return {
    data: {
      total: (moment().unix() - globalStartTime) * 34,
      occupied: ((moment().unix() - globalStartTime) * 34 * rate) / 100,
      vacant: ((moment().unix() - globalStartTime) * 34 * (100 - rate)) / 100,
    },
    status: 'success',
  };
}

export function mockYesterdayData() {
  const dayOfWeek = parseInt(moment().format('d'));
  const dayOfMonth = parseInt(moment().format('D'));
  let occupiedCount = occupiedCountRate;
  if (dayOfWeek <= 1) {
    occupiedCount = 20;
  }
  const lastTime = 24 * sensorLength;
  if (dayOfMonth % 3 === 0) {
    occupiedCount -= config[4];
  } else {
    occupiedCount += config[4];
  }
  return {
    data: {
      occupiedCount: parseInt((lastTime * occupiedCount) / 100),
      occupiedRise: 1 + config[dayOfMonth % 3] / 10,
      occupiedDecline: 1 + config[(dayOfMonth % 5) + 2] / 10,
      vacantCount: parseInt((lastTime * (95 - occupiedCount)) / 100),
      vacantRise: 1 + config[9 - (dayOfMonth % 3)] / 10,
      vacantDecline: 1 + config[8 - (dayOfMonth % 5)] / 10,
    },
    status: 'success',
  };
}

export function mockWorkStation() {
  const data = [];
  for (let i = 0; i < 30; i++) {
    let occupiedCount = occupiedCountRate;
    let vacantCount = 40;
    let offlineCount = 2;
    const week = moment()
      .startOf('month')
      .add(i, 'd');
    const time = moment()
      .subtract(30 - i, 'd')
      .format('D/M, ddd');
    if (week.format('e') === '0' || week.format('e') === '6') {
      vacantCount = 88;
      occupiedCount = 20;
    }
    if (i % 3 === 0) {
      vacantCount -= config[i % 10];
      occupiedCount += config[i % 10];
    } else {
      vacantCount += config[i % 10];
      occupiedCount -= config[i % 10];
      offlineCount += config[i % 10];
    }
    data.push({
      type: 'offline',
      date: time,
      value: offlineCount,
    });
    data.push({
      type: 'vacant',
      date: time,
      value: vacantCount,
    });
    data.push({
      type: 'occupied',
      date: time,
      value: occupiedCount,
    });
  }
  return {
    data,
    status: 'success',
  };
}

export function mockUsingHour(payload) {
  const { type, status } = payload;
  const data = [];
  const today = moment()
    .startOf('d')
    .unix();
  const fourWeekAgo = moment()
    .subtract(28, 'd')
    .unix();
  if (type === 'Hour') {
    for (let i = 0; i < 24; i++) {
      const duraction = getHourDuractionRate(status, i, sensorLength, config, occupiedCountRate);
      data.push({
        date: i,
        duraction,
      });
    }
  } else {
    let lastTime = today - globalStartTime;
    if (status === 'Last 4 Weeks' && fourWeekAgo >= globalStartTime) {
      lastTime = today - fourWeekAgo;
    }
    const totalOccupiedCount = 380;
    const weekOfYear = moment().format('W');
    for (let i = 0; i < 7; i++) {
      let occupiedCount = occupiedCountRate;
      if (i === 0 || i === 6) occupiedCount = 20;
      switch (status) {
        case 'Last 4 Weeks':
          if ((parseInt(weekOfYear / 10) + (weekOfYear % 10)) % 3 === 0) {
            occupiedCount -= config[i];
          } else {
            occupiedCount += config[i];
          }
          break;
        case 'Year':
          if ((parseInt(weekOfYear / 10) + (weekOfYear % 10)) % 4 === 0) {
            occupiedCount -= config[i];
          } else {
            occupiedCount += config[i];
          }
          break;
        default:
          break;
      }
      data.push({
        time: G.moment()
          .startOf('week')
          .add(i, 'd')
          .format('ddd'),
        duraction: parseInt((lastTime * occupiedCount) / totalOccupiedCount / 3600),
      });
    }
  }
  return {
    data,
    status: 'success',
  };
}

export function mockUsingRanking(payload) {
  const { status } = payload;
  const data = [];
  const weekOfYear = parseInt(moment().format('W'));
  let numberOfYear = weekOfYear;
  if (numberOfYear < 10) numberOfYear += 10;
  if (numberOfYear > 27) numberOfYear = parseInt(numberOfYear / 3);
  const occupiedCount = occupiedCountRate;
  const occupiedArr = config.map(value => {
    if (
      (status === 'Year' && weekOfYear % 3 === 0) ||
      (status === 'Last 4 Weeks' && weekOfYear % 3 !== 0)
    ) {
      return occupiedCount - value;
    }
    return occupiedCount + value;
  });
  const occupiedResort = _.sortBy(occupiedArr, occupied => {
    return occupied;
  });
  for (let i = 0; i < 10; i++) {
    const number = numberOfYear;
    const sum = number + config[i];
    const sub = number - config[i];
    let tagIndex = sum;

    if (
      (status === 'Last 4 Weeks' && weekOfYear % 2 === 0) ||
      (status === 'Year' && weekOfYear % 2 !== 0)
    ) {
      tagIndex = sub;
    }
    const tag = demoSensor[tagIndex].tag;
    const duraction = getUsingRankDuraction(i, status, occupiedCountRate, config, occupiedResort);
    data.push({ x: tag.split('_')[0] + tag.split('_')[1], y: duraction });
  }
  return {
    data,
    status: 'success',
  };
}
export function getRoutePath() { }
