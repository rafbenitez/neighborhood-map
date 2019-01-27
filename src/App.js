import React, { Component } from 'react';
import MapContainer from './MapContainer.js'
import FilterPane from './FilterPane.js'
import './App.css';
import sortBy from 'sort-by'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFilter, faAngleLeft, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import locations from './data/locations.json'

library.add(faBars, faFilter, faAngleLeft, faExternalLinkAlt)

const FOURSQUARE_API = 'https://api.foursquare.com/v2/venues'
const FOURSQUARE_CLIENT_ID = "MTD4Q1FAJTXP1RXCCEROWBDWWQWYCN5VA0VVOCYHEVIFT1GO";
const FOURSQUARE_CLIENT_SECRET = "CKYXUB0EBZBIUEJITEEMFWOANZKKAWQLW5DTH0SUKCZM3KS5";
const FOURSQUARE_API_VERSION = "20190101";

class App extends Component {
  state = {
    lat: 39.696619,
    lng: -104.959259,
    zoom: 11,
    query: '',
    locations: locations.sort(sortBy('name')),
    filterResults: locations,
    filterPaneOpen: true,
    selectedLocationIndex: null
  }

  componentDidMount() {
    this.loadFourSquareImages(this.state.locations)
  }

  filterVenues = (searchResults, location) => {
    return searchResults.response.venues.filter(item => item.name.includes(location.name) || location.name.includes(item.name));
  }

  updateStateLocations = (location, index) => {
    this.setState((state) => {
      const newLocations = state.locations.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            foursquare: location.foursquare,
            photos: location.photos
          }
        } else {
          return item
        }
      })
      return {
        ...state,
        locations: newLocations
      }
    })

  }

  loadFourSquareImages = (locations) => {
    const headers = {
      'Accept': 'application/json'
    }

    locations.forEach((location, index) => {
      let url =
        `${FOURSQUARE_API}/search?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=${FOURSQUARE_API_VERSION}` +
        `&radius=100&ll=${location.pos.lat},${location.pos.lng}&llAcc=100`;
      fetch(url, { headers })
        .then(response => response.json())
        .then(searchResults => {
          let matchingVenues = this.filterVenues(searchResults, location)
          location = {
            ...location,
            foursquare: matchingVenues[0]
          }
          if (location.foursquare) {
            let url =
            `${FOURSQUARE_API}/${location.foursquare.id}/photos?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=${FOURSQUARE_API_VERSION}`
            fetch(url, { headers })
              .then(response => response.json())
              .then(photosResults => {
                if (photosResults.response.photos) {
                  location = {
                    ...location,
                    photos: photosResults.response.photos.items
                  }
                  this.updateStateLocations(location, index)
                  }
              })
          } else {
            location = {
              ...location,
              photos: []
            }
            this.updateStateLocations(location, index)
          }
        })
    })
  }

  filterLocations = (query) => {
    this.setState({ query, selectedLocationIndex: null })
    this.setState({ locations: this.state.locations.map(location => {
      return {
        ...location,
        show: location.name.toLowerCase().includes(query.toLowerCase())
      }
    }
    )})
  }

  toggleFilterPane = () => {
    this.setState( { filterPaneOpen: !document.getElementById('filter-pane').classList.toggle('hide-filter-pane')})
  }

  selectLocation = (index) => {
    this.setState({ selectedLocationIndex: index })
  }

  render() {
    return (
      <div className="App">
        <FilterPane
          locations={this.state.locations}
          query={this.state.query}
          filterResults={ Array.isArray(this.state.filterResults) ? this.state.filterResults : [] }
          onToggleFilterPane={this.toggleFilterPane}
          onFilterLocations={this.filterLocations}
          onSelectLocation={this.selectLocation}
        />
        <div className="app-main">
          <div className="app-header">
            <button type="button" className="app-button" onClick={this.toggleFilterPane}>
              <FontAwesomeIcon icon="bars"/>
            </button>
            <h1>Denver Board Gaming Spots</h1>
          </div>
          <MapContainer
            lat={this.state.lat}
            lng={this.state.lng}
            zoom={this.state.zoom}
            locations={this.state.locations}
            // locations={this.state.filterResults}
            filterPaneOpen={this.state.filterPaneOpen}
            onSelectLocation={this.selectLocation}
            selectedLocationIndex={this.state.selectedLocationIndex}
          />
        </div>
      </div>
    );
  }
}

export default App;
