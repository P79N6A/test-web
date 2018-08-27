import { getEquipmentlList } from '../services/api';

export default {
  namespace: 'manaEquip',
  state: {
    equipmentlList: [],
  },

  effects: {
    *fetchEquip({ payload }, { call, put }) {
      const response = yield call(getEquipmentlList, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'equipSave',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    equipSave(state, action) {
      return {
        ...state,
        equipmentlList: action.payload,
      };
    },
  },
};
