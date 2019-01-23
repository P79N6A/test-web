// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

export default () => (
  <Exception type="404" style={{ minHeight: 500, height: '100%' }} linkElement={Link} />
);
