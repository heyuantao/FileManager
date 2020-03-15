import React from "react";
import { hashHistory,Link } from "react-router";
import { Icon, Layout, Menu } from "antd";
import {connect} from "react-redux";
import {fromJS} from "immutable";
import * as LocationActionCreator from "./store/LocationIndicatorActionCreator";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class AppSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys:["1"],
        }
    }
    componentDidMount(){
        let that = this;
        hashHistory.listen( (location) =>  {
            if(location.action==="PUSH"){
                if(location.pathname.includes("/examination")){
                    if(location.pathname.includes("/enrollment")){
                        that.setState({selectedKeys:["11"]});
                        this.props.changeLocation(fromJS(["考试管理","考试安排","报名情况"]));
                        return;
                    }
                    that.setState({selectedKeys:["11"]});
                    this.props.changeLocation(fromJS(["考试管理","考试安排"]));
                    return;
                }
                if(location.pathname.includes("/userenrollment")){
                    that.setState({selectedKeys:['12']});
                    this.props.changeLocation(fromJS(["考试管理","报名信息"]));
                    return;
                }
                if(location.pathname.includes("/externalexam")){
                    that.setState({selectedKeys:['22']});
                    this.props.changeLocation(fromJS(["成绩管理","外部考试"]));
                    return;
                }
                if(location.pathname.includes("/account")){
                    that.setState({selectedKeys:['31']});
                    this.props.changeLocation(fromJS(["账号管理","考生账号"]));
                    return;
                }
                if(location.pathname.includes("/personal")){
                    that.setState({selectedKeys:["41"]});
                    this.props.changeLocation(fromJS(["个人管理","密码修改"]));
                    return;
                }
                if(location.pathname.includes("/examcategory")){
                    that.setState({selectedKeys:["51"]});
                    this.props.changeLocation(fromJS(["系统设置","考试类别"]));
                    return;
                }
                if(location.pathname.includes("/managercategory")){
                    that.setState({selectedKeys:["52"]});
                    this.props.changeLocation(fromJS(["系统设置","管理员分类"]));
                    return;
                }
            }
        });
    }
    render() {
        const user = this.props.user.get("user");
        let isSuperuser = false;
        if((user.get("is_superuser")===true)&&(user.get("category")==='超级管理员')){
            isSuperuser = true;
        }
        return (
            <Sider width="230">
                <div className="logo" style={{textAlign:"center"}} >
                    <h1 style={{color:"white"}}>报名管理</h1>
                </div>
                <Menu theme="dark" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]}
                      selectedKeys={this.state.selectedKeys} mode="inline">
                    <SubMenu key="sub1" title={<span><Icon type="pie-chart" /><span>考试管理</span></span>}>
                        <Menu.Item key="11">
                            <Link to="/examination">
                                <Icon type="schedule" /><span>考试安排</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="12">
                            <Link to="/userenrollment">
                                <Icon type="solution" />
                                <span>报名信息</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="contacts" /><span>成绩管理</span></span>}>
                        <Menu.Item key="22">
                            <Link to="/externalexam">
                                <Icon type="import" /><span>考试数据（导入）</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="contacts" /><span>账号管理</span></span>}>
                        <Menu.Item key="31">
                            <Link to="/account">
                                <Icon type="user" />
                                <span>考生账号</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" title={<span><Icon type="setting" /><span>个人管理</span></span>}>
                        <Menu.Item key="41">
                            <Link to="/personal">
                                <Icon type="key" /><span>密码修改</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub5" title={<span><Icon type="tool" /><span>系统设置</span></span>}
                        className={isSuperuser===true ? "": "hidden"}>
                        <Menu.Item key="51">
                            <Link to="/examcategory">
                                <Icon type="idcard" /><span>考试类别</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="52">
                            <Link to="/managercategory">
                                <Icon type="usergroup-add" /><span>管理员分类</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>

            </Sider>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        user:store.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeLocation(locationList){
            dispatch(LocationActionCreator.changeLocation(locationList))
        }
    }
}

export default connect(mapStoreToProps,mapDispatchToProps)(AppSideBar)
