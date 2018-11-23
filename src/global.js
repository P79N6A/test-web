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
  2001: { "message_ch": "参数错误", "message_en": "Parameter error" },
  2002: { "message_ch": "所在的用户组没有权限", "message_en": "User group is not authorized" },
  3001: { "message_ch": "用户登录失败", "message_en": "User login failed" },
  3002: { "message_ch": "账户不存在，请联系管理员", "message_en": "The account does not exist, please contact the administrator" },
  3003: { "message_ch": "验证码已发送，请不要重复发送", "message_en": "The verification code has been sent, please do not send it again." },
  3004: { "message_ch": "验证码发送失败，请重试", "message_en": "Verification code failed to send, please try again" },
  3005: { "message_ch": "用户退出失败", "message_en": "User exit failed" },
  3007: { "message_ch": "编辑用户失败", "message_en": "Edit user failed" },
  3008: { "message_ch": "创建用户失败", "message_en": "Create user failed" },
  3009: { "message_ch": "原密码不匹配", "message_en": "The original password does not match" },
  3010: { "message_ch": "修改密码失败", "message_en": "Password change failed" },
  3011: { "message_ch": "操作失败", "message_en": "Operation failed" },
  3012: { "message_ch": "用户计数失败", "message_en": "Failed to count user" },
  3013: { "message_ch": "查询用户失败", "message_en": "Failed to list user" },
  3014: { "message_ch": "获取用户设置信息失败", "message_en": "Failed to get user settings" },
  3015: { "message_ch": "获取员工站立数据失败", "message_en": "Failed to get person stand information" },
  3016: { "message_ch": "获取员工站立排行数据失败", "message_en": "Failed to get person stand rank information" },
  3017: { "message_ch": "获取七牛云上传图片 token 失败", "message_en": "Failed to get qiniu cloud upload image token" },
  3018: { "message_ch": "删除用户失败", "message_en": "Failed to delete user" },
  3019: { "message_ch": "手机号码已存在", "message_en": "Telephone already exists" },
  3020: { "message_ch": "密码错误", "message_en": "Wrong password" },
  3021: { "message_ch": "用户已登录，不能删除", "message_en": "User is logged in and cannot be deleted" },
  3022: { "message_ch": "验证码不正确，请重新输入", "message_en": "The verification code is incorrect. Please re-enter" },
  3023: { "message_ch": "验证码已失效，请重新请求验证码", "message_en": "The verification code has expired. Please request a verification code again" },
  3024: { "message_ch": "账号不存在，请联系管理员", "message_en": "" },
  3026: { "message_ch": "推送消息失败", "message_en": "Push message failed" },
  3027: { "message_ch": "获取 SVG 失败", "message_en": "Failed to get SVG" },
  4001: { "message_ch": "账户已存在", "message_en": "Account already exists" },
  4002: { "message_ch": "公司名称已存在", "message_en": "Company name already exists" },
  4003: { "message_ch": "创建公司失败", "message_en": "Failed to add company" },
  4004: { "message_ch": "创建管理员失败", "message_en": "Failed to add admin" },
  4005: { "message_ch": "编辑公司失败", "message_en": "Failed to edit company" },
  4006: { "message_ch": "重置密码失败", "message_en": "Failed to reset the password" },
  4007: { "message_ch": "获取公司站立数据失败", "message_en": "Failed to get company stand information" },
  4008: { "message_ch": "获取公司站立趋势数据失败", "message_en": "Failed to get company stand trend information" },
  5001: { "message_ch": "心跳更新数据失败", "message_en": "Failed to update with heartbeat data" },
  5002: { "message_ch": "更改桌子状态失败", "message_en": "Failed to change desk status" },
  5003: { "message_ch": "更新用户设置信息失败", "message_en": "Failed to update user settings" },
  5004: { "message_ch": "获取设备蓝牙信息失败", "message_en": "Failed to get device Bluetooth information" },
  5005: { "message_ch": "上传埋点失败", "message_en": "Failed to upload metrics" },
  6001: { "message_ch": "资源计数失败", "message_en": "Failed to count resources" },
  6002: { "message_ch": "资源正在使用中，不能移除", "message_en": "Resource is in use and cannot be removed" },
  7001: { "message_ch": "修改用户消息状态失败", "message_en": "Failed to modify user notice status" },
  7003: { "message_ch": "获取用户消息列表失败", "message_en": "Failed to get user notice list" },
  7004: { "message_ch": "获取通知的用户查看状态列表失败", "message_en": "Failed to get notification user status list" },
  7005: { "message_ch": "解除设备绑定失败", "message_en": "Failed to unbind device" },
  7006: { "message_ch": "修改资源备注失败", "message_en": "Failed to update resource remark" },
  7007: { "message_ch": "获取消息失败", "message_en": "Failed to get notification" },
  8001: { "message_ch": "新增 Banner 失败", "message_en": "Failed to add Banner" },
  8002: { "message_ch": "获取 Banner 列表失败", "message_en": "Failed to get Banner list" },
  8003: { "message_ch": "发布 Banner 失败", "message_en": "Failed to publish Banner" },
  8004: { "message_ch": "删除 Banner 失败", "message_en": "Failed to delete Banner" },
  8005: { "message_ch": "编辑 Banner 失败", "message_en": "Failed to edit Banner" },
  8006: { "message_ch": "获取 Banner 默认图片失败", "message_en": "Failed to get default Banner picture" },
  9001: { "message_ch": "获取工位状态失败", "message_en": "Failed to get desk list" },
  9002: { "message_ch": "获取工位数量失败", "message_en": "Failed to get desk count" },
  9003: { "message_ch": "获取工位趋势失败", "message_en": "Failed to get desk trend" },
  9004: { "message_ch": "获取工位总服务时长失败", "message_en": "Failed to get service duration" },
  9005: { "message_ch": "获取工位时长失败", "message_en": "Failed to get desk duration" },
  9006: { "message_ch": "获取工位使用率排行失败", "message_en": "Failed to get usage rank" },
  9007: { "message_ch": "获取昨日使用工位数失败", "message_en": "Failed to get yesterday desk count" },
  9008: { "message_ch": "获取 IoT token 失败", "message_en": "Failed to get IoT token" },
}

export default {
  API_URL,
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
};
