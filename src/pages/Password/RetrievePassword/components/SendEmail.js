import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Row, Col, Button } from 'antd';
import G from '@/global'
import styles from './../index.less'

const FormItem = Form.Item;


class SendEmail extends Component {

  // 发送邮箱
  checkEmail() {
    const { dispatch, form, sendEmails } = this.props;
    form.validateFields(err => {
      if (err) return;
      dispatch({
        type: 'RetrievePassword/emailSave',
        payload: {
          ...form.getFieldsValue()
        },
      });
      // 添加
      sendEmails({ ...form.getFieldsValue() });
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.emailBox}>
        <div className={styles.emailContent}>
          <h3>找回密码</h3>
          <p>如果您无法访问空间管理系统，请输入您的注册邮箱地址，系统会给您发送详细的帐号信息。</p>
          <Row className={styles.lageBox}>
            <Col span={24}>
              <Form>
                <FormItem label={"邮箱地址"} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: "请输入邮箱地址" },
                      {
                        pattern: G.emailCheck,
                        message: formatMessage({ id: 'customer.email.message' }),
                      },
                    ],
                  })(<Input placeholder={"请输入邮箱地址"} />)}
                </FormItem>
              </Form>
            </Col>
            <Col span={24} style={{ textAlign: 'center', paddingTop: '10px' }}>
              <Button
                style={{ marginRight: 24 }}
                size='small'
                onClick={() => {
                  history.back(-1);
                }}
              >
                <FormattedMessage id='all.cancel' />
              </Button>
              <Button type="primary" size='small' htmlType="submit" onClick={this.checkEmail.bind(this)}>发送</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Form.create()(SendEmail);
