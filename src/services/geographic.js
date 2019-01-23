// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import request from '@/utils/request';

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
