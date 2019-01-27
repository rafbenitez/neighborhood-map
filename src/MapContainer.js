import React, {Component} from 'react'
import {Map, InfoWindow, GoogleApiWrapper} from  'google-maps-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const MAPS_API_KEY='AIzaSyCdKuhS-Bxv3iBsGlsIiuMbB3rxM8D1Pbw'

class MapContainer extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    locations: PropTypes.array.isRequired,
    filterPaneOpen: PropTypes.bool.isRequired,
    onSelectLocation: PropTypes.func.isRequired,
    selectedLocationIndex: PropTypes.number
  }

  state = {
    map: null,
    markers: [],
    markersDropped: false,
    showingInfoWindow: false
  }

  componentWillReceiveProps = (nextProps) => {
    // Update InfoWindow visibility and Marker animation
    if (nextProps.selectedLocationIndex === null || typeof(nextProps.selectedLocationIndex) === 'undefined') {
      if (this.state.showingInfoWindow) {
        // The open InfoWindow needs to be closed since there is no selectedLocationIndex
        this.setState({ showingInfoWindow: false })
        this.state.markers[this.props.selectedLocationIndex].setAnimation(null)
      }
    } else {
      if (this.state.showingInfoWindow) {
        // A location was selected while an InfoWindow was already showing
        // Close the previous InfoWindow and Open the new InfoWindow
        if (nextProps.selectedLocationIndex !== this.props.selectedLocationIndex) {
          this.state.markers[this.props.selectedLocationIndex].setAnimation(null)
          this.state.markers[nextProps.selectedLocationIndex].setAnimation(this.props.google.maps.Animation.BOUNCE);
        }
      } else {
        // A location was selected while no InfoWindow was showing so show the InfoWindow
        this.state.markers[nextProps.selectedLocationIndex].setAnimation(this.props.google.maps.Animation.BOUNCE);
        this.setState({showingInfoWindow: true});// setState causes re-render, so render function is re-executed
      }
    }
    this.updateMarkers(nextProps.locations)
  }

  mapReady = (props, map) => {
    this.setState({map});
    this.setupMarkers(this.props.locations);
    this.setState({markersDropped: true})
  }

  onCloseInfoWindow = () => {
    this.props.onSelectLocation(null)
  }

  onClickMarker = (index, marker, e) => {
    this.props.onSelectLocation(index)
  }

  // Setup markers for all locations when the map is ready
  // This function only runs once
  setupMarkers = (locations) => {
    let markers = []

    locations.forEach((location, index) => {
      let animation = this.state.markersDropped ? null : this.props.google.maps.Animation.DROP;
      let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
        animation
      });
      marker.addListener('click', () => {
        this.onClickMarker(index, marker, null);
      });
      markers.push(marker)

    })
    this.setState({ markers })
  }

  // Update markers when state changes
  // Show or hide each marker based on filter results
  // This method only shows or hides a marker if it's location's show flag has changed
  // This prevents flickering of the markers
  updateMarkers = (locations) => {
    if (this.state.markers.length === locations.length) {
      let markers = this.state.markers
      locations.forEach((location, index) => {
        location.show ?
          (!markers[index].map && markers[index].setMap(this.state.map))
          :
          (markers[index].map && markers[index].setMap(null))
      })
      this.setState({ markers })
    }
  }

  render() {
    const { lat, lng, zoom, locations, filterPaneOpen } = this.props

    const style = {
      width: '100%',
      height: '100%'
    }

    const center = {
      lat: lat,
      lng: lng
    }

    let className = filterPaneOpen ? 'narrow-map' : 'wide-map'
    let location = (this.props.selectedLocationIndex !== null && typeof(this.props.selectedLocationIndex) !== "undefined")
      && locations[this.props.selectedLocationIndex]

    return (
      <Map
        role='application'
        aria-label='map'
        onReady={this.mapReady}
        google={this.props.google}
        zoom={zoom}
        style={style}
        className={className}
        initialCenter={center}
        onClick={this.onCloseInfoWindow}>
        <InfoWindow
          marker={ (this.props.selectedLocationIndex === null || typeof(this.props.selectedLocationIndex) === "undefined")
           ? {} : this.state.markers[this.props.selectedLocationIndex] }
          visible={this.state.showingInfoWindow}
          onClose={this.onCloseInfoWindow}>
          {location ? (
            <div>
              <h3>{location.name}</h3>
              {location.photos[0] ? (
                <div>
                  <img
                    src={location.photos[0].prefix + "100x100" + location.photos[0].suffix}
                    alt={location.name + " photo"}
                  />
                </div>
              ) : (<div></div>)}
              <div className="info-window-address">
                {location.street} {location.city}, {location.state} {location.zip}
              </div>
              {location.url ? (
                <div>
                  <a href={location.url}
                    className="info-window-link"
                    target="_blank"
                    rel="noopener noreferrer">
                    open website
                    <FontAwesomeIcon icon="external-link-alt"/>
                  </a>
                </div>
              ) : (<div></div>)}
            </div>
          ) : (<div></div>)}
        </InfoWindow>
      </Map>

    )
  }
}

export default GoogleApiWrapper({apiKey: MAPS_API_KEY})(MapContainer)