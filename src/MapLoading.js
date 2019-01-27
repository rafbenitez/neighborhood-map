import React, {Component} from 'react'

class MapLoading extends Component {
  state = {
    loading: true,
    timeoutID: null
  }

  componentDidMount() {
    let timeoutID = window.setTimeout(this.loadFailed, 2000)
    this.setState({timeoutID})
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutID)
  }

  loadFailed() {
    this.setState({loading: false})
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>
            <h1>Loading Map</h1>
          </div>
        ) : (
          <div>
            <h1>Error Loading Map</h1>
            <p>Unable to load Map. Please try again later.</p>
          </div>
        )}
      </div>
    )
  }
}

export default MapLoading