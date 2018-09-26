import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { appLocation } from '../routes'
import CreatePetition from './create-petition-legacy'

class CreateRevise extends React.Component {
  componentDidMount() {
    if (!this.props.hasPetition) appLocation.push('/create_start.html')
  }

  render() {
    if (!this.props.hasPetition) return null // We will also redirect in componentDidMount
    return <CreatePetition initialPetition={this.props.petition} />
  }
}

function mapStateToProps({ petitionCreateStore }) {
  return {
    hasPetition: !!(
      petitionCreateStore &&
      petitionCreateStore.title &&
      !petitionCreateStore.submitted
    ),
    petition: petitionCreateStore
  }
}

CreateRevise.propTypes = {
  hasPetition: PropTypes.bool,
  petition: PropTypes.object
}

export default connect(mapStateToProps)(CreateRevise)
