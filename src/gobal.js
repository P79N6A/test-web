import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import { message } from 'antd';

moment.locale('zh-cn');
const env = process.BUILD_ENV;

let API_URL = '';
if (env === '') {
  API_URL = '/space';
} else {
  API_URL = process.PROXY_URL;
}

const picUrl = 'https://cdn.9amtech.com/space/';
message.config({
  maxCount: 3,
});

export default {
  API_URL,
  env,
  _,
  moment,
  axios,
  picUrl,
  message,
};
