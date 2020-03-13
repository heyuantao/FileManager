import React from "react";
import {Layout} from "antd";

const { Footer} = Layout;

export default class AppPageFooter extends React.PureComponent {
    render() {
        return (
                <Footer style={{ textAlign:"center",padding:"20px"}}>
                    数据平台
                </Footer>
        )
    }
}
