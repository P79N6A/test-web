import { getDeviceStatus } from '@/services/api';

export default {
  namespace: 'officeMap',

  state: {},

  effects: {
    *getDeviceStatus({ payload }, { call }) {
      const { tags } = payload;
      const response = yield call(getDeviceStatus, tags);
      if (!(response && (response.status === 'success'))) {
        payload.callback({ status: 'fail' });
        return;
      }
      if (payload.noFilter) {
        payload.callback({ status: 'success', data: response.data });
        return;
      }
      const data = [];
      const resData = response.data;
      for (let i = 0; i < tags.tags.length; i += 1) {
        for (let j = 0; j < resData.length; j += 1) {
          if (tags.tags[i] === '') {
            data.push({ value: '' });
            break;
          }
          const { humansensor, status } = resData[j];
          if (tags.tags[i] === resData[j].tag) {
            data.push({
              active: parseInt(humansensor, 10) === 1,
              value: i + 1,
              status,
            });
            break;
          }
          if (j === resData.length - 1 && tags.tags[i] !== resData[j].id) {
            data.push({ value: '?', active: false });
            break;
          }
        }
      }
      payload.callback({ status: 'success', data });
    },
  },

  reducers: {},
};
