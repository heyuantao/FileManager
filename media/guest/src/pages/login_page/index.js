import React from "react";
import {connect} from "react-redux";
import {Row, Col, Form, Input, Button, Alert, Icon, Layout, Menu} from "antd";
import { Link } from "react-router";
import { fromJS } from "immutable";
import * as UserActionCreator from "../commons/store/user_action_creator"
import Utils from "../commons/utils";
import Settings from "../../settings";

import AppPageHeader from "../componments/app_page_header";
import AppPageFooter from "../componments/app_page_footer";

const { Content } = Layout;
const FormItem = Form.Item;
const req = Settings.request;

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: fromJS({}),
            formFieldValidateInfo: "",
            captchaImageSrc: "",
        }
    }
    componentDidMount() {
        this.props.fetchUser()
    }
    handleLoginSubmit() {
        if (this.validateFormField() < 0) {
            return
        }
        //this.props.login("abc","123","2232")
        req.post(Settings.loginAPIURL, this.state.formData.toJS()).then(function (response) {
            if (response.data.dashboard_url !== undefined) {
                window.location.href = response.data.dashboard_url;
            }
        }).catch(function (error) {
        })

    }

    validateFormField() {
        let formData = this.state.formData;
        this.setState({ formFieldValidateInfo: "" })

        if (!formData.get("email")) {
            this.setState({ formFieldValidateInfo: "用户名不能为空！" })
            return -1
        }
        if (!Utils.isEmailValid(formData.get("email"))) {
            this.setState({ formFieldValidateInfo: "请使用邮箱注册 ！" })
            return -1
        }
        if (!formData.get("password")) {
            this.setState({ formFieldValidateInfo: "请输入密码 ！" })
            return -1
        }
        if ( formData.get("email").length> 50) {
            this.setState({ formFieldValidateInfo: "用户名非法 ！" })
            return -1
        }
        return 1
    }
    handleFieldChange(value, field) {
        let dict = {}; dict[field] = value;
        let change = fromJS(dict);
        this.setState({ formData: this.state.formData.merge(change) }, () => { this.validateFormField() })
    }
    handleGoToUserDashboard(){
        const user = this.props.user.get("user");
        const isLogin = this.props.user.get("isLogin");
        if(isLogin){
            window.location.href = user.get('dashboard_url');
        }
    }

    //componentDidMount(){
    //    this.refreshCaptch()
    //}

    render() {
        const formData = this.state.formData;
        const user = this.props.user.get("user");
        const isLogin = this.props.user.get("isLogin");
        return (
            <Layout className="layout">
                <AppPageHeader></AppPageHeader>
                <Content style={{background: '#fff',minHeight: "850px", padding: 0 }}>
                    {(isLogin === false) &&
                        <div style={{position: "absolute", width: "100%", top: "20%"}}>
                            <Row type="flex" justify="center" align="middle" style={{}}>
                                <Col md={{span: 8}}>
                                    <h1 style={{height: "60px",lineHeight: "60px",color: "black",textAlign: "center"}}>用户登录（郑州航空工业管理学院）</h1>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <Col md={{span: 6}}>
                                    <Form className="login-form">
                                        <FormItem>
                                            <Input value={formData.get("email")} onChange={(e) => {
                                                this.handleFieldChange(e.target.value, "email")
                                            }}
                                                   prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="请输入用户名"
                                                   size="large"/>
                                        </FormItem>
                                        <FormItem>
                                            <Input value={formData.get("password")} onChange={(e) => {
                                                this.handleFieldChange(e.target.value, "password")
                                            }}
                                                   prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                                   placeholder="请输入密码" size="large"/>
                                        </FormItem>
                                        <FormItem>
                                            <Row type="flex" justify="start" align="middle">
                                                <Link to="/forgetpassword" style={{marginRight: 10}}>忘记密码</Link>
                                                <Link to="/registration">我没有账号</Link>
                                            </Row>
                                        </FormItem>
                                        <FormItem hasFeedback>
                                            <Alert message={'提示：新用户报名前请先注册，注册请点击上方链接"我没有账号"'} type="warning"/>
                                        </FormItem>
                                        <FormItem hasFeedback>
                                            {(this.state.formFieldValidateInfo !== "") &&
                                            <Alert message={this.state.formFieldValidateInfo} type="error"/>
                                            }
                                        </FormItem>
                                        <FormItem>
                                            <Row type="flex" justify="end" align="middle">
                                                <Button
                                                    type={this.state.formFieldValidateInfo === "" ? "primary" : "disabled"}
                                                    onClick={() => {
                                                        this.handleLoginSubmit()
                                                    }} className="login-form-button">
                                                    登录
                                                </Button>
                                            </Row>
                                        </FormItem>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    }
                    { ((isLogin===true)&&(user.get("is_superuser")===true))&&
                        <div style={{position: "absolute", width: "100%", top: "30%"}}>
                            <Row type="flex" justify="center" align="middle" style={{}}>
                                <Col md={{span: 20}}>
                                    <h1 style={{height: "60px",lineHeight: "60px",color: "black",textAlign: "center"}}>
                                        您已登录系统，点击下方或右上方按钮进入管理后台
                                    </h1>
                                    <div style={{marginTop:"50px"}}></div>
                                    <h1 style={{ height: "60px", lineHeight: "60px", color: "black", textAlign: "center" }}>
                                        <Button size="large" type="primary" onClick={()=>{this.handleGoToUserDashboard()}}>
                                            进入{user.get("username")}的后台界面
                                        </Button>
                                    </h1>
                                </Col>
                            </Row>
                        </div>
                    }
                    { ((isLogin===true)&&(user.get("is_superuser")===false))&&
                        <div style={{position: "absolute", width: "100%", top: "30%"}}>
                            <Row type="flex" justify="center" align="middle" style={{}}>
                                <Col md={{span: 20}}>
                                    <h1 style={{height: "60px",lineHeight: "60px",color: "black",textAlign: "center"}}>
                                        考生您好，您已经登录系统！
                                    </h1>
                                    <h1 style={{height: "60px",lineHeight: "60px",color: "black",textAlign: "center"}}>
                                        请点击下方按钮或右上方按钮进入后台以修改或添加报名信息
                                    </h1>
                                    <h1 style={{ height: "60px", lineHeight: "60px", color: "black", textAlign: "center" }}>
                                        <Button size="large" type="primary" onClick={()=>{this.handleGoToUserDashboard()}}>
                                            开始报名（{user.get("username")}已登录）
                                        </Button>
                                    </h1>
                                </Col>
                            </Row>
                        </div>
                    }
                </Content>
                <AppPageFooter></AppPageFooter>
            </Layout>

        )
    }
}

const mapStoreToProps = (store) => {
    return{
        user:store.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        login(username,password,captcha){
            dispatch(UserActionCreator.login(username,password,captcha))
        },
        fetchUser(){
            dispatch(UserActionCreator.getUser());
        }
    }
}

export default connect(mapStoreToProps,mapDispatchToProps)(LoginPage)
