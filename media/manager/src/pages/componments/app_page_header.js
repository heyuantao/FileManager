import React from "react";
import { Col, Row, Layout, Button  } from "antd";
import { connect } from "react-redux";
import * as UserActionCreator from "../commons/store/user_action_creator"
import "./app_page_header.css"

const { Header } = Layout;

class AppPageHeader extends React.Component {
    handleLogout(){
        this.props.logout()
    }
    componentDidMount() {
        this.props.getUser()
    }
    render() {
        const user = this.props.user.get("user");
        return (
            <Header style={{ background: '#fff'}} >
                <Row type="flex" align="middle" justify="end">
                    <Col style={{marginRight:"10px"}}><h3>{user.get("username")}</h3></Col>
                    {  (user.get("is_superuser")===true)&&
                        <Col ><h3>管理员</h3></Col>
                    }
                    <Col>
                        <Button style={{marginLeft:"50px"}} onClick={()=>{this.handleLogout()}} type="primary">注销</Button>
                    </Col>
                </Row>
            </Header>
        )
    }
}

const mapStoreToProps = (store) => {
    return {
        user:store.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser(){
            dispatch(UserActionCreator.getUser())
        },
        logout(){
            dispatch(UserActionCreator.logout())
        }
    }
}

export default connect(mapStoreToProps,mapDispatchToProps)(AppPageHeader)
