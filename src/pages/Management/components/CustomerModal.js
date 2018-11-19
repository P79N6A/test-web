import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import G from '@/global'

const FormItem = Form.Item;

@connect(({ ManagementCustomer }) => ({
  ManagementCustomer,
}))
class NewCustomer extends Component {
  state = {
    title: formatMessage({ id: 'menu.management.newCustomer' }),
  };

  componentDidMount() {
    const { ManagementCustomer } = this.props;
    const { editValue } = ManagementCustomer;
    const { form } = this.props;
    if (editValue !== '') {
      form.setFieldsValue({
        account: editValue.company.account,
        password: '******',
        email: editValue.company.email,
        companyName: editValue.companyName,
        contacts: editValue.company.contacts,
        telephone: editValue.company.telephone,
        address: editValue.company.address,
        website: editValue.company.website,
        industry: editValue.company.industry,
        contractNo: editValue.company.contractNo,
        remark: editValue.company.remark,
      });
      this.setState({ title: formatMessage({ id: 'customer.edit.customer' }) });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/setEditValue',
      payload: '',
    });
  }

  // 时间选择器
  onChange() { }

  // 上传成功或者失败的回调
  release(res) {
    if (res.status === 'success') {
      message.success(res.message || formatMessage({ id: 'customer.add.success' }));
      setTimeout(() => {
        this.goBack();
      }, 2000);
    } else {
      message.error(res.message || formatMessage({ id: 'customer.add.company.fail' }));
    }
  }

  // 编辑成功或者失败的回调
  releases(res) {
    if (res.status === 'success') {
      message.success(res.message || formatMessage({ id: 'customer.successfully.modified' }));
      setTimeout(() => {
        this.goBack();
      }, 2000);
    } else {
      message.error(res.message || formatMessage({ id: 'customer.fail.to.edit' }));
    }
  }
  // 添加
  handleCommit() {
    const { form, dispatch, ManagementCustomer } = this.props;
    const { editValue } = ManagementCustomer;
    form.validateFields(err => {
      if (err) return;
      if (editValue !== '') {
        const all = form.getFieldsValue();
        delete all.password;
        delete all.account;
        delete all.companyName;
        // 编辑
        dispatch({
          type: 'ManagementCustomer/editCustomer',
          payload: {
            companyId: editValue.companyId,
            ...all,
            callback: this.releases.bind(this),
          },
        });
      } else {
        // 添加
        dispatch({
          type: 'ManagementCustomer/addCustomer',
          payload: {
            ...form.getFieldsValue(),
            callback: this.release.bind(this),
          },
        });
      }
    });
  }

  // 返回上一页
  goBack() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ManagementCustomer/setEditValue',
      payload: '',
    });
    this.props.dispatch(routerRedux.push('/management/customer'))
  }

  render() {
    const { form, ManagementCustomer } = this.props;
    const { title } = this.state;
    const { getFieldDecorator } = form;
    const { editValue } = ManagementCustomer;
    return (
      <div>
        <h3>{title}</h3>
        <br />
        <Form style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.company.name' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('companyName', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.company.name.message' }) },
                        {
                          max: 50,
                          message: formatMessage({ id: 'test.max.long.fifty' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.company.name.message' })} size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.industry' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('industry', {
                  rules: [
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.industry.message' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.account.number' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('account', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.account.number.text' }) },
                        {
                          max: 20,
                          message: formatMessage({ id: 'test.max.long.twenty' }),
                        },
                        {
                          pattern: G.accountCheck,
                          message: formatMessage({ id: 'customer.account.number.message' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.account.number.text' })} size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.detailed.address' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.detailed.address.text' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.password' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('password', {
                  rules:
                    editValue === ''
                      ? [
                        { required: true, message: formatMessage({ id: 'customer.password.text' }) },
                        {
                          max: 20,
                          message: formatMessage({ id: 'test.max.long.twenty' }),
                        },
                        {
                          pattern: G.passCheck,
                          message: formatMessage({ id: 'customer.password.message' }),
                        },
                      ]
                      : [],
                })(<Input placeholder={formatMessage({ id: 'customer.password.text' })} size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.website.link' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('website', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.website.link.text' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'app.settings.basic.email' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'app.settings.basic.email-message' }) },
                    {
                      pattern: G.emailCheck,
                      message: formatMessage({ id: 'customer.email.message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.settings.basic.email-message' })} size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.contract.no' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('contractNo', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.contract.no.text' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.administrator.name' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('contacts', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'customer.administrator.name.text' }) },
                    {
                      max: 20,
                      message: formatMessage({ id: 'test.max.long.twenty' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.administrator.name.text' })} size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'all.remarks' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      max: 100,
                      message: formatMessage({ id: 'test.max.long.one.hundred' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'person.remarks.input' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label={formatMessage({ id: 'customer.administrator.mobile' })} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('telephone', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'customer.administrator.mobile.text' }) },
                    {
                      max: 11,
                      message: formatMessage({ id: 'test.max.long.eleven' }),
                    },
                    {
                      pattern: G.phoneCheck,
                      message: formatMessage({ id: 'customer.administrator.mobile.message' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'customer.administrator.mobile.text' })} size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" size='small' onClick={this.handleCommit.bind(this)}>
                <FormattedMessage id='all.save' />
              </Button>
              <Button style={{ marginLeft: 8 }} size='small' onClick={this.goBack.bind(this)}>
                <FormattedMessage id='all.cancel' />
              </Button>
            </Col>
          </Row>
        </Form>
      </div >
    );
  }
}

export default Form.create()(NewCustomer);
