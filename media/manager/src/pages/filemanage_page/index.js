import React from "react";
import {Col, Row, Button} from "antd";
import FileList from "./file_list";

class FileManagePage extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ padding: 24, background: "#fff"}}>
                <Row>
                    <FileList></FileList>
                </Row>
            </div>
        )
    }
}

export default FileManagePage
