import React from "react";
import {Layout} from "antd";

const { Footer} = Layout;

export default class AppPageFooter extends React.PureComponent {
    render() {
        return (
                <Footer style={{ textAlign:"center"}}>
                    文件下载平台
                </Footer>
        )
    }
}
