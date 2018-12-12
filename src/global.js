import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import { message } from 'antd';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const env = process.BUILD_ENV;
let API_URL = '';
if (env === '') {
  API_URL = '/space/api';
} else {
  API_URL = `${process.API_URL}/api`;
}
const picUrl = 'http://cdn.space.9amtech.com/';
const IXAM_URL = process.IXAM_URL;
const SUBSCRIPTION_KEY = '8a61f42ed2144d18a11b4d0e243434e3';
const CNAME_CONFIG = ['siemens', 'weworkchina', '9amGlobal'];
const svgColor = {
  strokeOffline: '#DBDBDB',
  fillOffline: '#F3F3F3',
  strokeOccupied: '#FF5A5F',
  fillOccupied: '#FFDEDF',
  strokeVacant: '#00A699',
  fillVacant: '#CCEDEB',
};
// 海外演示开始时间
const globalStartTime = 1543680000; // "2018-12-02T00:00:00+08:00"

message.config({
  maxCount: 1,
});
const htmlUrl = process.SERVER_URL;
const phoneCheck = /^1[34578]\d{9}$/;
const emailCheck = /^\w[-+.\w]*@\w[-\w]*(\.\w[-\w]*)+$/;
const passCheck = /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/;
const accountCheck = /^\w+$/;

// 后台错误码
const errorLists = {
  2001: { "message_zh-CN": "参数错误", "message_en-US": "Parameter Error" },
  2002: { "message_zh-CN": "所在的用户组没有权限", "message_en-US": "The user group do not have permissions" },
  3001: { "message_zh-CN": "用户登录失败", "message_en-US": "Failed to login" },
  3002: { "message_zh-CN": "账户不存在，请联系管理员", "message_en-US": "Non-existent account, please contact administrator" },
  3003: { "message_zh-CN": "验证码已发送，请不要重复发送", "message_en-US": "The verification code has been sent, please do not try to repeat" },
  3004: { "message_zh-CN": "验证码发送失败，请重试", "message_en-US": "The verification code failed to send, please try again" },
  3005: { "message_zh-CN": "用户退出失败", "message_en-US": "Failed to exit" },
  3007: { "message_zh-CN": "编辑用户失败", "message_en-US": "Failed to edit user information" },
  3008: { "message_zh-CN": "创建用户失败", "message_en-US": "Failed to create new account" },
  3009: { "message_zh-CN": "原密码不匹配", "message_en-US": "Password entered and original password do not match" },
  3010: { "message_zh-CN": "修改密码失败", "message_en-US": "Failed to change password" },
  3011: { "message_zh-CN": "操作失败", "message_en-US": "Operation failed" },
  3012: { "message_zh-CN": "用户计数失败", "message_en-US": "Failed to count user" },
  3013: { "message_zh-CN": "查询用户失败", "message_en-US": "Failed to list user" },
  3014: { "message_zh-CN": "获取用户设置信息失败", "message_en-US": "Failed to get user settings" },
  3015: { "message_zh-CN": "获取员工站立数据失败", "message_en-US": "Failed to get person stand rank information" },
  3016: { "message_zh-CN": "获取员工站立排行数据失败", "message_en-US": "Failed to get person stand rank information" },
  3017: { "message_zh-CN": "获取七牛云上传图片 token 失败", "message_en-US": "Failed to get qiniu cloud upload image token" },
  3018: { "message_zh-CN": "删除用户失败", "message_en-US": "Failed to delete user" },
  3019: { "message_zh-CN": "手机号码已存在", "message_en-US": "Telephone already exists" },
  3020: { "message_zh-CN": "密码错误", "message_en-US": "Wrong password" },
  3021: { "message_zh-CN": "用户已登录，不能删除", "message_en-US": "User is logged in and cannot be deleted" },
  3022: { "message_zh-CN": "验证码不正确，请重新输入", "message_en-US": "The verification id is incorrect. Please re-enter" },
  3023: { "message_zh-CN": "验证码已失效，请重新请求验证码", "message_en-US": "The verification id has expired. Please request a verification id again" },
  3024: { "message_zh-CN": "账号不存在，请联系管理员", "message_en-US": "Non-existent account, please contact administrator" },
  3026: { "message_zh-CN": "推送消息失败", "message_en-US": "Push message failed" },
  3027: { "message_zh-CN": "获取 SVG 失败", "message_en-US": "Failed to get SVG" },
  3028: { "message_zh-CN": "发送邮件失败", "message_en-US": "Failed to send mail" },
  3029: { "message_zh-CN": "用户不是管理员", "message_en-US": "User is not an administrator" },
  3030: { "message_zh-CN": "密码找回链接无效或已过期", "message_en-US": "Password recovery link is invalid or has expired" },
  4001: { "message_zh-CN": "账户已存在", "message_en-US": "Account already exists" },
  4002: { "message_zh-CN": "公司名称已存在", "message_en-US": "Company name already exists" },
  4003: { "message_zh-CN": "创建公司失败", "message_en-US": "Failed to add company" },
  4004: { "message_zh-CN": "创建管理员失败", "message_en-US": "Failed to add admin" },
  4005: { "message_zh-CN": "编辑公司失败", "message_en-US": "Failed to edit company" },
  4006: { "message_zh-CN": "重置密码失败", "message_en-US": "Failed to reset the password" },
  4007: { "message_zh-CN": "获取公司站立数据失败", "message_en-US": "Failed to get company stand information" },
  4008: { "message_zh-CN": "获取公司站立趋势数据失败", "message_en-US": "Failed to get company stand trend information" },
  5001: { "message_zh-CN": "心跳更新数据失败", "message_en-US": "Failed to update with heartbeat data" },
  5002: { "message_zh-CN": "更改桌子状态失败", "message_en-US": "Failed to change desk status" },
  5003: { "message_zh-CN": "更新用户设置信息失败", "message_en-US": "Failed to update user settings" },
  5004: { "message_zh-CN": "获取设备蓝牙信息失败", "message_en-US": "Failed to get device Bluetooth information" },
  5005: { "message_zh-CN": "上传埋点失败", "message_en-US": "Failed to upload metrics" },
  6001: { "message_zh-CN": "资源计数失败", "message_en-US": "Failed to count resources" },
  6002: { "message_zh-CN": "资源正在使用中，不能移除", "message_en-US": "Resource is in use and cannot be removed" },
  7001: { "message_zh-CN": "修改用户消息状态失败", "message_en-US": "Failed to modify user notice status" },
  7003: { "message_zh-CN": "获取用户消息列表失败", "message_en-US": "Failed to get user notice list" },
  7004: { "message_zh-CN": "获取通知的用户查看状态列表失败", "message_en-US": "Failed to get notification user status list" },
  7005: { "message_zh-CN": "解除设备绑定失败", "message_en-US": "Failed to unbind device" },
  7006: { "message_zh-CN": "修改资源备注失败", "message_en-US": "Failed to update resource remark" },
  7007: { "message_zh-CN": "获取消息失败", "message_en-US": "Failed to get notification" },
  8001: { "message_zh-CN": "新增 Banner 失败", "message_en-US": "Failed to add Banner" },
  8002: { "message_zh-CN": "获取 Banner 列表失败", "message_en-US": "Failed to get Banner list" },
  8003: { "message_zh-CN": "发布 Banner 失败", "message_en-US": "Failed to publish Banner" },
  8004: { "message_zh-CN": "删除 Banner 失败", "message_en-US": "Failed to delete Banner" },
  8005: { "message_zh-CN": "编辑 Banner 失败", "message_en-US": "Failed to edit Banner" },
  8006: { "message_zh-CN": "获取 Banner 默认图片失败", "message_en-US": "Failed to get default Banner picture" },
  9001: { "message_zh-CN": "获取工位状态失败", "message_en-US": "Failed to get desk list" },
  9002: { "message_zh-CN": "获取工位数量失败", "message_en-US": "Failed to get desk count" },
  9003: { "message_zh-CN": "获取工位趋势失败", "message_en-US": "Failed to get desk trend" },
  9004: { "message_zh-CN": "获取工位总服务时长失败", "message_en-US": "Failed to get service duration" },
  9005: { "message_zh-CN": "获取工位时长失败", "message_en-US": "Failed to get desk duration" },
  9006: { "message_zh-CN": "获取工位使用率排行失败", "message_en-US": "Failed to get usage rank" },
  9007: { "message_zh-CN": "获取昨日使用工位数失败", "message_en-US": "Failed to get yesterday desk count" },
  9008: { "message_zh-CN": "获取 IoT token 失败", "message_en-US": "Failed to get IoT token" },
}

export default {
  API_URL,
  IXAM_URL,
  SUBSCRIPTION_KEY,
  CNAME_CONFIG,
  env,
  _,
  moment,
  axios,
  picUrl,
  message,
  htmlUrl,
  phoneCheck,
  emailCheck,
  passCheck,
  accountCheck,
  errorLists,
  svgColor,
  globalStartTime,
};
