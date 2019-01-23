// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import { urlToList } from './pathTools';

describe('test urlToList', () => {
  it('A path', () => {
    expect(urlToList('/userinfo')).toEqual(['/userinfo']);
  });
  it('Secondary path', () => {
    expect(urlToList('/userinfo/2144')).toEqual(['/userinfo', '/userinfo/2144']);
  });
  it('Three paths', () => {
    expect(urlToList('/userinfo/2144/addr')).toEqual([
      '/userinfo',
      '/userinfo/2144',
      '/userinfo/2144/addr',
    ]);
  });
});
