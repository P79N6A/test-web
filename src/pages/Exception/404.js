// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    title={formatMessage({ id: 'app.exception.title-404' })}
    desc={formatMessage({ id: 'app.exception.description-404' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception404;
