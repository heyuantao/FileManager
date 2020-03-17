import React from "react";
import {Layout} from "antd";

const { Footer } = Layout;

export default class AppPageFooter extends React.PureComponent {
    render() {
        return (
            <Footer style={{ textAlign:"center",padding: 5 }}>
                文件管理
            </Footer>
        )
    }
}
