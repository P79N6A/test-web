// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

import CheckPermissions from './CheckPermissions';

const Authorized = ({ children, authority, noMatch = null }) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  return CheckPermissions(authority, childrenRender, noMatch);
};

export default Authorized;
