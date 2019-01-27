import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

class FilterPane extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    filterResults: PropTypes.array.isRequired,
    onToggleFilterPane: PropTypes.func.isRequired,
    onFilterLocations: PropTypes.func.isRequired,
    onSelectLocation: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.onFilterLocations('')
  }

  render () {
    const { query, locations, onToggleFilterPane, onFilterLocations, onSelectLocation} = this.props

    return (
      <div id="filter-pane" className="filter-pane">
        <div className="filter-header">
          <span>Locations</span>
          <div>
            <button type="button" className="app-button close-filter" onClick={onToggleFilterPane}>
              <FontAwesomeIcon icon="angle-left"/>
            </button>
          </div>
        </div>
        <div className="filter-locations-bar">
          {/* <div className="filter-locations-input-wrapper"> */}
            <input
              type="text"
              placeholder="Filter by location name"
              value={query}
              onChange={(event) => onFilterLocations(event.target.value)}
            />
            <div className="app-button icon">
              <FontAwesomeIcon icon="filter"/>
            </div>
          {/* </div> */}
        </div>
        <div className="filter-locations-results">
          <ol className="locations-list">
            {locations.map((location, index) => {
                return location.show && (
                  <li key={index}>
                    <button
                      className="location-button"
                      key={index}
                      onClick={e => onSelectLocation(index)}
                    >{location.name}</button>
                  </li>
                )
            })}
          </ol>
        </div>
      </div>
    )
  }
}

export default FilterPane