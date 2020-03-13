import React from "react";
import { Col, Row, Layout, Menu } from "antd";
import { Link } from "react-router";
import { connect } from "react-redux";
import { fromJS } from "immutable";

//import "./index.css";
//import * as NavActionCreator from "./store/NavActionCreator";

const { Header} = Layout;

class AppPageHeader extends React.Component {
    handleMenuSelect(item){

    }
    componentDidMount() {
    }
    handleGoToUserDashboard(){
        const user = this.props.user.get("user");
        const isLogin = this.props.user.get("isLogin");
        if(isLogin){
            window.location.href = user.get('dashboard_url');
        }
    }
    render() {
        const user = this.props.user.get("user");
        const isLogin = this.props.user.get("isLogin");
        return (
            <Header>
                <Row type="flex" justify="space-between" align="middle">
                    <Col>
                        <div className="HeadLogo">
                            数据分享
                        </div>
                    </Col>
                    <Col span={15} style={{float: "right"}}>
                        <Menu theme="dark" mode="horizontal" onSelect={(item)=>{this.handleMenuSelect(item)}}
                               style={{lineHeight:"64px"}}>
                            { (isLogin===false)&&
                                <Menu.Item key="login" style={{float: "right"}}>
                                    <Link to="/login">登录/注册</Link>
                                </Menu.Item>
                            }
                            { ((isLogin===true)&&(user.get("is_superuser")===true))&&
                                <Menu.Item key="login" style={{float: "right"}}>
                                    <a onClick={()=>{this.handleGoToUserDashboard()}}>管理考生({user.get("username")}已登录)</a>
                                </Menu.Item>
                            }
                            { ((isLogin===true)&&(user.get("is_superuser")===false))&&
                                <Menu.Item key="login" style={{float: "right"}}>
                                    <a onClick={()=>{this.handleGoToUserDashboard()}}>开始报名({user.get("username")}已登录)</a>
                                </Menu.Item>
                            }
                            <Menu.Item key="query" style={{float: "right"}}>
                                <Link to="/query">结果查询</Link>
                            </Menu.Item>
                            <Menu.Item key="help" style={{float: "right"}}>
                                <Link to="/help">使用帮助</Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
            </Header>
        )
    }
}

const navStoreToProps = (store) => {
    return {
        user:store.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(navStoreToProps,mapDispatchToProps)(AppPageHeader)
