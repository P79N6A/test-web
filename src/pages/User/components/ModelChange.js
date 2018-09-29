import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from '../../../../node_modules/dva/router';

const FormItem = Form.Item;

@connect(({ changePass }) => ({
  changePass,
}))
class ModalChange extends Component {
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('与第一次输入密码不一致，请重新输入！');
    } else {
      callback();
    }
  };

  handleConfirmBlur = () => { };

  // 修改成功或者失败的回调函数(判断角色返回不同页面)
  release(res) {
    const { form } = this.props;
    const currentAuthority = this.props.currentUser.currentAuthority;
    if (res.status === 'success') {
      message.success(res.data.msg || '修改成功！');
      form.setFieldsValue({
        oldPassword: '',
        newPassword: '',
        newsPassword: '',
      });
      window.sessionStorage.removeItem('userInfo');
      window.localStorage.setItem('antd-pro-authority', '["guest"]');
      if (currentAuthority === 'user') {
        router.push('/user/login');
      } else {
        router.push('/admin_user/login');
      }
      return;
    } else {
      message.error(res.message || '修改失败！');
    }
  }

  handleCommit() {
    const { form, dispatch } = this.props;
    form.validateFields(err => {
      if (err) return;
      const all = form.getFieldsValue();
      delete all.newsPassword;
      // 修改密码
      dispatch({
        type: 'changePass/changePassword',
        payload: { ...all, callback: this.release.bind(this) },
      });
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <h3>修改密码</h3>
        <br />
        <Form style={{ backgroundColor: '#fff', padding: '20px' }}>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label="原始密码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('oldPassword', {
                  rules: [
                    { required: true, message: '请输入原始密码' },
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                    {
                      pattern: /^\w+$/,
                      message: '仅支持半角英文数字和下划线',
                    },
                  ],
                })(<Input placeholder="请输入原始密码" type="password" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label="新密码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: '请输入新密码' },
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                    {
                      pattern: /^\w+$/,
                      message: '仅支持半角英文数字和下划线',
                    },
                  ],
                })(<Input placeholder="请输入新密码" type="password" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label="确认新密码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('newsPassword', {
                  rules: [
                    { required: true, message: '请再次输入新密码' },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <Input
                    placeholder="请再次输入新密码"
                    type="password"
                    size="large"
                    onBlur={this.handleConfirmBlur}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10} offset={6}>
              <Button type="primary" htmlType="submit" onClick={this.handleCommit.bind(this)}>
                确认修改
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ModalChange);
