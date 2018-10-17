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

const picUrl = 'http://pflmzpr9l.bkt.clouddn.com/image/';
const uploadPicUrl = 'http://cdn.space.9amtech.com/';
message.config({
  maxCount: 3,
});

const htmlUrl = process.SERVER_URL;

export default {
  API_URL,
  env,
  _,
  moment,
  axios,
  picUrl,
  uploadPicUrl,
  message,
  htmlUrl,
};
