import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


const mapStyles = {
  width: '50%',
  height: '100%',
  float: 'right',
  position: 'absolute'
};

export class MapComponent extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={16}
        style={mapStyles}
        initialCenter={{
         lat: -1.2884,
         lng: 36.8233
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA1hygOKnk5N5aJ3-oHHzYQ-031Ug-OP_U'
})(MapComponent);