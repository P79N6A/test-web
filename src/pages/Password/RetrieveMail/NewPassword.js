import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Row, Col, message, Button, Form, Input } from 'antd';
import LeftHeader from '@/components/SpaceHeader/LeftHeader';
import Footer from '@/layouts/Footer';
import styles from './index.less';
import G from '@/global';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;

@connect(({ RetrieveMail }) => ({
  RetrieveMail,
}))
class SetNewPassword extends Component {
  state = {
    id: "",
    save: "保存"
  }

  componentDidMount() {
    this.setState({
      id: this.props.location.query.id
    })
  }

  // 提交更改
  handleCommit() {
    const { form, dispatch } = this.props;
    const { id } = this.state;
    form.validateFields(err => {
      if (err) return;
      this.setState({
        save: "验证"
      })
      const all = form.getFieldsValue();
      delete all.passwordAgain;
      // 找回密码
      dispatch({
        type: 'RetrieveMail/sendPassword',
        payload: {
          ...all,
          id,
          callback: this.release.bind(this),
        },
      });
    });
  }

  // 发送之后的回调
  release(res) {
    if (res.status === 'success') {
      this.setState({
        save: "保存成功"
      })
    } else {
      this.setState({
        save: "保存失败"
      })
    }
  }

  // 验证两次输入密码是不是一样
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'change.two.message' }));
    } else {
      callback();
    }
  };

  // 去登录页面
  goLogin() {
    this.props.dispatch(routerRedux.push('/user/login'));
  }

  render() {
    const leftImg = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 };
    const centerContent = { xs: 22, sm: 20, md: 18, lg: 16, xl: 14, xxl: 12 };
    const inputPass = { xs: 22, sm: 20, md: 18, lg: 16, xl: 16, xxl: 16 };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { save } = this.state;
    return (
      <div className={styles.content}>
        <LeftHeader />
        <div className={styles.send_content}>
          <Row className={styles.new_password}>
            <Col {...leftImg}></Col>
            <Col {...centerContent}>
              <p className={styles.title}>设置新密码</p>
              <p className={styles.set_new_password}>设置您新的密码并开始使用</p>
              <Form className={styles.formModel}>
                <Row type="flex" justify="center">
                  <Col {...inputPass}>
                    <FormItem wrapperCol={{ span: 24 }} className={styles.input_pass}>
                      {getFieldDecorator('password', {
                        rules: [
                          { required: true, message: formatMessage({ id: 'change.new.password.text' }) },
                          {
                            min: 8,
                            message: formatMessage({ id: 'test.min.long.eight' }),
                          },
                          {
                            max: 20,
                            message: formatMessage({ id: 'test.max.long.twenty' }),
                          },
                          {
                            pattern: G.passCheck,
                            message: formatMessage({ id: 'change.original.password.message' }),
                          },
                        ],
                      })(<Input placeholder={formatMessage({ id: 'change.new.password.text' })} type="password" size="large" />)}
                    </FormItem>
                  </Col>
                  <Col {...inputPass}>
                    <FormItem wrapperCol={{ span: 24 }} className={styles.input_pass}>
                      {getFieldDecorator('passwordAgain', {
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
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...inputPass}>
                    <Button className={styles.set_new_btn} type="primary" htmlType="submit" onClick={this.handleCommit.bind(this)}>{save}</Button>
                  </Col>
                  <Col {...inputPass}>
                    <p className={styles.go_login} onClick={this.goLogin.bind(this)}>去登录</p>
                  </Col>
                </Row>
              </Form>
              <p className={styles.question}>如有任何问题，可以与我们联系，我们将尽快为你解答。</p>
              <p className={styles.email}>Email:_________<span>电话:_________</span></p>
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Form.create()(SetNewPassword);
