// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    title={formatMessage({ id: 'app.exception.title-403' })}
    desc={formatMessage({ id: 'app.exception.description-403' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception403;
