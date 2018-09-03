import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, message, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;

@connect(({ manaCustomer }) => ({
  manaCustomer,
}))
class NewCustomer extends Component {
  state = {
    title: '新建客户',
  };

  componentDidMount() {
    const { manaCustomer } = this.props;
    const { editValue } = manaCustomer;
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
        contractDate: moment(editValue.company.contractDate),
        remark: editValue.company.remark,
      });
      this.setState({ title: '编辑客户' });
    }
  }

  // 时间选择器
  onChange() {}

  // 上传成功或者失败的回调
  release(res) {
    if (res.status === 'success') {
      message.success(res.data.data.msg || '添加成功！');
      setTimeout(() => {
        this.goBack();
      }, 2000);
    } else {
      message.error(res.message.err);
    }
  }

  // 添加
  handleCommit() {
    const { form, dispatch, manaCustomer } = this.props;
    const { editValue } = manaCustomer;
    form.validateFields(err => {
      if (err) return;
      if (editValue !== '') {
        const all = form.getFieldsValue();
        delete all.password;
        delete all.account;
        delete all.companyName;
        // 编辑
        dispatch({
          type: 'manaCustomer/editCustomer',
          payload: {
            companyId: editValue.companyId,
            ...all,
            contractDate: moment(form.getFieldsValue().contractDate).format('YYYY-MM-DD'),
            callback: this.release.bind(this),
          },
        });
      } else {
        // 添加
        dispatch({
          type: 'manaCustomer/addCustomer',
          payload: {
            ...form.getFieldsValue(),
            contractDate: moment(form.getFieldsValue().contractDate).format('YYYY-MM-DD'),
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
      type: 'manaCustomer/setEditValue',
      payload: '',
    });
    history.back(-1);
  }

  render() {
    const { form, manaCustomer } = this.props;
    const { title } = this.state;
    const { getFieldDecorator } = form;
    const { editValue } = manaCustomer;
    return (
      <div>
        <h3>{title}</h3>
        <br />
        <Form style={{ backgroundColor: '#fff', padding: '20px' }}>
          <Row>
            <Col span={12}>
              <FormItem label="账号" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('account', {
                  rules: [
                    { required: true, message: '请输入账号' },
                    {
                      min: 8,
                      message: '最小长度8',
                    },
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                    {
                      pattern: /^[a-zA-Z]\w$/,
                      message: '仅支持半角英文数字和下划线',
                    },
                  ],
                })(<Input placeholder="请输入账号" size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="密码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                    {
                      pattern: /^[a-zA-Z]\w$/,
                      message: '仅支持半角英文数字和下划线',
                    },
                  ],
                })(<Input placeholder="请输入密码" size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="邮箱" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: '请输入邮箱' },
                    {
                      min: 10,
                      message: '最小长度10',
                    },
                    {
                      max: 50,
                      message: '最大长度50',
                    },
                  ],
                })(<Input placeholder="请输入邮箱" size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="公司全称" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('companyName', {
                  rules: [
                    { required: true, message: '请输入公司全称' },
                    {
                      max: 50,
                      message: '最大长度50',
                    },
                  ],
                })(<Input placeholder="请输入公司全称" size="large" disabled={editValue !== ''} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="管理员姓名" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('contacts', {
                  rules: [
                    { required: true, message: '请输入管理员姓名' },
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                  ],
                })(<Input placeholder="请输入管理员姓名" size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="管理员手机号码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('telephone', {
                  rules: [
                    { required: true, message: '请输入管理员手机号码' },
                    {
                      max: 11,
                      message: '最大长度11',
                    },
                    {
                      pattern: /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/,
                      message: '请正确输入管理员手机号码',
                    },
                  ],
                })(<Input placeholder="请输入管理员手机号码" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="客户详细地址" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      max: 100,
                      message: '最大长度100',
                    },
                  ],
                })(<Input placeholder="请输入客户详细地址" size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="网址" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('website', {
                  rules: [
                    {
                      max: 100,
                      message: '最大长度100',
                    },
                  ],
                })(<Input placeholder="请输入网址" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="客户所属行业" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('industry', {
                  rules: [
                    {
                      max: 20,
                      message: '最大长度20',
                    },
                  ],
                })(<Input placeholder="请输入客户所属行业" size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="合同编号" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('contractNo', {
                  rules: [
                    {
                      max: 100,
                      message: '最大长度100',
                    },
                  ],
                })(<Input placeholder="请输入合同编号" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="签约时间" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('contractDate', {
                  rules: [{ required: true, message: '请选择签约时间' }],
                })(<DatePicker onChange={this.onChange.bind(this)} size="large" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      max: 100,
                      message: '最大长度100',
                    },
                  ],
                })(<Input placeholder="请输入备注" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" onClick={this.handleCommit.bind(this)}>
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.goBack.bind(this)}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(NewCustomer);
