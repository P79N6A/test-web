import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import { message } from 'antd';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const env = process.BUILD_ENV;
let API_URL = '';
if (env === '') {
  API_URL = '/space/api';
} else {
  API_URL = `${process.API_URL}/api`;
}
const picUrl = 'http://cdn.space.9amtech.com/';
message.config({
  maxCount: 1,
});
const htmlUrl = process.SERVER_URL;
const phoneCheck = /^1[34578]\d{9}$/;
const emailCheck = /^\w[-+.\w]*@\w[-\w]*(\.\w[-\w]*)+$/;
const passCheck = /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/;
const accountCheck = /^\w+$/;

export default {
  API_URL,
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
};
