import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';

moment.locale('zh-cn');
const env = process.BUILD_ENV;

let API_URL = '';
if (env === '') {
  API_URL = '/space';
} else {
  API_URL = process.PROXY_URL;
}

const picUrl = 'http://pdum0jw3j.bkt.clouddn.com/';

export default {
  API_URL,
  env,
  _,
  moment,
  axios,
  picUrl,
};
