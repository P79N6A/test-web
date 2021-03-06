// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

const globalSensor = ['A2_1725', 'A2_1726'];

/**
 * @param {*}
 *   tag         String    设备编号
 *   vacantTime  Array     设备空闲区间
 */
const demoSensor = [
  {
    tag: 'A2_0001',
    occupiedTime: ['8:26-9:27', '18:05-18:36'],
  },
  {
    tag: 'A2_0002',
    occupiedTime: ['8:34-9:54', '18:09-18:42'],
  },
  {
    tag: 'A2_0003',
    occupiedTime: ['8:28-8:58', '18:20-18:45'],
  },
  {
    tag: 'A2_0004',
    occupiedTime: ['8:06-8:50', '18:00-18:25'],
  },
  {
    tag: 'A2_0005',
    occupiedTime: ['8:36-9:02', '18:22-18:58'],
  },
  {
    tag: 'A2_0006',
    occupiedTime: ['8:26-9:40', '18:08-19:42'],
  },
  {
    tag: 'A2_0007',
    occupiedTime: ['8:14-9:50', '18:00-18:55'],
  },
  {
    tag: 'A2_0008',
    occupiedTime: ['8:30-9:30', '18:00-19:44'],
  },
  {
    tag: 'A2_0009',
    occupiedTime: ['8:46-9:36', '18:26-19:27'],
  },
  {
    tag: 'A2_0010',
    occupiedTime: ['8:12-9:58', '18:13-18:30'],
  },
  {
    tag: 'A2_0011',
    occupiedTime: ['8:26-9:55', '18:40-19:40'],
  },
  {
    tag: 'A2_0012',
    occupiedTime: ['8:56-9:37', '18:00-18:20'],
  },
  {
    tag: 'A2_0013',
    occupiedTime: ['8:36-9:27', '18:20-18:54'],
  },
  {
    tag: 'A2_0014',
    occupiedTime: ['9:00-9:30', '18:00-20:27'],
  },
  {
    tag: 'A2_0015',
    occupiedTime: ['8:14-9:50', '18:00-19:22'],
  },
  {
    tag: 'A2_0016',
    occupiedTime: ['8:44-9:27', '18:07-18:46'],
  },
  {
    tag: 'A2_0017',
    occupiedTime: ['8:40-9:20', '18:03-18:52'],
  },
  {
    tag: 'A2_0018',
    occupiedTime: ['8:20-8:40', '18:10-19:00'],
  },
  {
    tag: 'A2_0019',
    occupiedTime: ['8:52-9:40', '18:00-18:28'],
  },
  {
    tag: 'A2_0020',
    occupiedTime: ['8:42-9:11', '18:00-20:30'],
  },
  {
    tag: 'A2_0021',
    occupiedTime: ['8:22-9:20', '20:08-20:40'],
  },
  {
    tag: 'A2_0022',
    occupiedTime: ['9:05-9:58', '18:00-18:30'],
  },
  {
    tag: 'A2_0023',
    occupiedTime: ['8:56-9:40', '22:00-23:30'],
  },
  {
    tag: 'A2_0024',
    occupiedTime: ['8:16-9:00', '9:26-9:58'],
  },
  {
    tag: 'A2_0025',
    occupiedTime: ['8:52-9:30', '21:00-22:30'],
  },
  {
    tag: 'A2_0026',
    occupiedTime: ['8:30-9:40', '18:08-18:55', '19:40-20:30'],
  },
  {
    tag: 'A2_0027',
    occupiedTime: ['8:44-9:50', '18:10-18:44'],
  },
  {
    tag: 'A2_0028',
    occupiedTime: ['8:24-9:38', '18:00-18:54', '20:06-21:24'],
  },
  {
    tag: 'A2_0029',
    occupiedTime: ['8:50-9:20', '18:29-18:48'],
  },
  {
    tag: 'A2_0030',
    occupiedTime: ['8:18-9:44', '18:02-19:04'],
  },
  {
    tag: 'A2_0031',
    occupiedTime: ['8:47-9:30', '20:00-21:30'],
  },
  {
    tag: 'A2_0032',
    occupiedTime: ['8:32-9:50', '18:00-19:38', '22:10-22:30'],
  },
  {
    tag: 'A2_0033',
    occupiedTime: ['8:20-9:33', '18:30-19:30', '21:28-23:02'],
  },
];

module.exports = {
  globalSensor,
  demoSensor,
};
