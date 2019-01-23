// Copyright 2019 9AM Software. All rights reserved.
// Distribution of this file is strictly prohibited.

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function setUserInfo(user) {
  return sessionStorage.setItem('userInfo', JSON.stringify(user));
}

export function getUserInfo() {
  return sessionStorage.getItem('userInfo');
}
