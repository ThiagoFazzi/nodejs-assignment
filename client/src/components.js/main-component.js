import React, { Component } from 'react'
import MapComponent from './map-component';
import GaugeComponent from './gauge-component';
import socketIOClient from "socket.io-client";

class MainComponent extends Component {

  constructor(){
    super()
    this.state = {speed: 0};
  }


  componentDidMount(){
    //const { endpoint } = this.state;
    const socket = socketIOClient('ws://localhost:8080');
    //socket.on("FromAPI", data => this.setState({ response: data }));
    socket.on("Vehicle", data => this.setState({speed: data.speed}))
  }



  render() {
    return (
      <div>
        <GaugeComponent
          color="green"
          strokeWidth="5"
          sqSize="100"
          percentage={this.state.speed}
        />
        <MapComponent />
      </div>
    )
  }
}

export default MainComponent

