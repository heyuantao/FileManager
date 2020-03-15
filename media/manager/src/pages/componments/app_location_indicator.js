import React from "react";
import {  Breadcrumb } from "antd";
import { connect } from "react-redux";

class AppLocationIndicator extends React.Component{
    render() {
        const path = this.props.location.get("path");
        return (
            <Breadcrumb style={{margin:"16px 13px"}}>
                {
                    path.map((item,index) =>{
                        return(<Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
                    })
                }
            </Breadcrumb>
        )
    }
}

const mapStoreToProp = (store)=>{
    return {location:store.location}
}

export default connect(mapStoreToProp,null)(AppLocationIndicator)
