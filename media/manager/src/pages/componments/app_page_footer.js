import React from "react";
import {Layout} from "antd";

const { Footer } = Layout;

export default class AppPageFooter extends React.PureComponent {
    render() {
        return (
            <Footer style={{ textAlign:"center",padding: "10px" }}>
                文件管理平台
            </Footer>
        )
    }
}
