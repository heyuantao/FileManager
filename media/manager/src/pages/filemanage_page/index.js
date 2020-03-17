import React from "react";
import {Col, Row, Button} from "antd";
import FileList from "./file_list";
import FileAdd from "./file_add";
import FileEdit from "./file_edit";

class FileManagePage extends React.Component{
    constructor(props) {
        super(props);
        this.state= {mode:'list',id:0};
    }
    handleChangeModeAndInstanceId =(mode='list',id=0)=>{
        this.setState({mode:mode,id:id});
    }

    render() {
        return (
            <div style={{ padding: 24, background: "#fff"}}>
                <Row>
                    {(this.state.mode==='list')&&
                        <FileList changeModeAndInstanceId={this.handleChangeModeAndInstanceId} ></FileList>
                    }
                    {(this.state.mode==='add')&&
                        <FileAdd changeModeAndInstanceId={this.handleChangeModeAndInstanceId} ></FileAdd>
                    }
                    {(this.state.mode==='edit')&&
                        <FileEdit changeModeAndInstanceId={this.handleChangeModeAndInstanceId} instanceId={this.state.id}></FileEdit>
                    }
                </Row>
            </div>
        )
    }
}

export default FileManagePage
