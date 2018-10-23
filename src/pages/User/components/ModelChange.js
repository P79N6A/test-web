import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from '../../../../node_modules/dva/router';

const FormItem = Form.Item;

@connect(({ ChangePass, user }) => ({
  ChangePass,
  user
}))
class ModalChange extends Component {
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(formatMessage({ id: 'change.two.message' }));
    } else {
      callback();
    }
  };

  handleConfirmBlur = () => { };

  // 修改成功或者失败的回调函数(判断角色返回不同页面)
  release = res => {
    const { form, user } = this.props;
    const currentAuthority = user.user.currentAuthority;
    if (res.status === 'success') {
      message.success(res.message || formatMessage({ id: 'customer.successfully.modified' }));
      form.setFieldsValue({
        oldPassword: '',
        newPassword: '',
        newsPassword: '',
      });
      window.sessionStorage.removeItem('userInfo');
      window.localStorage.setItem('antd-pro-authority', '["guest"]');
      if (currentAuthority === 'user') {
        this.props.dispatch(routerRedux.push('/user/login'));
      } else {
        this.props.dispatch(routerRedux.push('/admin_user/login'));
      }
      return;
    } else {
      message.error(res.message || formatMessage({ id: 'customer.fail.to.edit' }));
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
        type: 'ChangePass/changePassword',
        payload: { ...all, callback: this.release.bind(this) },
      });
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <h3><FormattedMessage id='change.password' /></h3>
        <br />
        <Form style={{ backgroundColor: '#fff', padding: '20px' }}>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label={formatMessage({ id: 'change.original.password' })} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('oldPassword', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'change.original.password.text' }) },
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                    {
                      pattern: /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/,
                      message: formatMessage({ id: 'change.original.password.message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'change.original.password.text' })} type="password" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label={formatMessage({ id: 'change.new.password' })} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'change.new.password.text' }) },
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                    {
                      pattern: /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/,
                      message: formatMessage({ id: 'change.original.password.message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'change.new.password.text' })} type="password" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <FormItem label={formatMessage({ id: 'change.confirm.new.password' })} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('newsPassword', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'change.confirm.new.password.text' }) },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <Input
                    placeholder={formatMessage({ id: 'change.confirm.new.password.text' })}
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
                <FormattedMessage id='change.certain' />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ModalChange);
