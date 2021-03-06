// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setUserInfo(user) {
  return sessionStorage.setItem('userInfo', JSON.stringify(user));
}

export function getUserInfo() {
  return sessionStorage.getItem('userInfo');
}

export function getSidebar() {
  return JSON.parse(sessionStorage.getItem('sidebar'));
}

export function setSidebar(sidebar) {
  sessionStorage.setItem('sidebar', JSON.stringify(sidebar));
}
