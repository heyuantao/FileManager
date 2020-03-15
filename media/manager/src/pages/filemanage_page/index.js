import React from "react";
import {Col, Row, Button} from "antd";
import FileList from "./file_list";
import FileAdd from "./file_add";

class FileManagePage extends React.Component{
    constructor(props) {
        super(props);
        this.state= {mode:'list'};
    }
    handleChangeMode =(mode)=>{
        let newMode ='';
        if(mode==='list'){
            newMode='add';
        }else{
            newMode='list';
        }
        this.setState({mode:newMode});
    }
    render() {
        return (
            <div style={{ padding: 24, background: "#fff"}}>
                <Row>
                    {(this.state.mode==='list')&&
                        <FileList close={()=>{this.handleChangeMode('list')}}></FileList>
                    }
                    {(this.state.mode==='add')&&
                        <FileAdd close={()=>{this.handleChangeMode('add')}} ></FileAdd>
                    }
                </Row>
            </div>
        )
    }
}

export default FileManagePage
