import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import { message } from 'antd';
import 'moment/locale/zh-cn';
import error from '@/errorCode';

moment.locale('zh-cn');
const env = process.BUILD_ENV;
let API_URL = '';
if (env === '') {
  API_URL = '/space/api';
} else {
  API_URL = `${process.API_URL}/api`;
}
const picUrl = 'http://cdn.space.9amtech.com/';
const IXAM_URL = process.IXAM_URL;
const SUBSCRIPTION_KEY = '8a61f42ed2144d18a11b4d0e243434e3';
const CNAME_CONFIG = ['siemens', 'weworkchina', '9amGlobal'];
const svgColor = {
  strokeOffline: '#DBDBDB',
  fillOffline: '#F3F3F3',
  strokeOccupied: '#FF5A5F',
  fillOccupied: '#FFDEDF',
  strokeVacant: '#00A699',
  fillVacant: '#CCEDEB',
};
// 海外演示开始时间
const globalStartTime = 1543680000; // "2018-12-02T00:00:00+08:00"

message.config({
  maxCount: 1,
});
const htmlUrl = process.SERVER_URL;
const phoneCheck = /^1[34578]\d{9}$/;
const emailCheck = /^\w[-+.\w]*@\w[-\w]*(\.\w[-\w]*)+$/;
const passCheck = /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/;
const accountCheck = /^\w+$/;

// 后台错误码
const { errorLists } = error;

export default {
  API_URL,
  IXAM_URL,
  SUBSCRIPTION_KEY,
  CNAME_CONFIG,
  env,
  _,
  moment,
  axios,
  picUrl,
  message,
  htmlUrl,
  phoneCheck,
  emailCheck,
  passCheck,
  accountCheck,
  errorLists,
  svgColor,
  globalStartTime,
};
