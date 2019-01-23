// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import request from '@/utils/request';

export default async function queryError(code) {
  return request(`/api/${code}`);
}
