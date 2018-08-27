import moment from 'moment';
import _ from 'lodash';

moment.locale('zh-cn');
const env = 'api';
// let env = 'dev';
// let env = 'prod';

let API_URL = '/api';
if (env === 'prod') {
  API_URL = 'https://wework2018apis.azure-api.cn/';
} else if (env === 'dev') {
  API_URL = 'https://wework2018apis-dev.azure-api.cn/';
}

export default {
  API_URL,
  _,
  moment,
};
