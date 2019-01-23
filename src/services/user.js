// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
