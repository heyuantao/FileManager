import React from "react";
import { Layout } from "antd";
import AppSideBar from "./componments/app_sidebar";
import AppPageHeader from "./componments/app_page_header";
import AppPageFooter from "./componments/app_page_footer";


import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Content} = Layout;

class App extends React.Component{
    render(){
        return(
             <Layout style={{ minHeight: "100vh" }}>
                    <AppSideBar></AppSideBar>
                    <Layout>
                        <AppPageHeader></AppPageHeader>
                        <Content style={{ margin: "0 10px" }}>
                            {this.props.children}
                        </Content>
                        <AppPageFooter></AppPageFooter>
                    </Layout>
                </Layout>
        );
    }
}

export default App

