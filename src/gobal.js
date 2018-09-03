import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';

moment.locale('zh-cn');
const env = '';
// const env = 'dev';
// const env = 'prod';

let API_URL = 'http://39.108.86.241:9201';
if (env === 'prod') {
  API_URL = 'http://39.108.86.241:9201';
} else if (env === 'dev') {
  API_URL = 'http://39.108.86.241:9201';
} else {
  API_URL = '/space';
}

export default {
  API_URL,
  env,
  _,
  moment,
  axios,
};
