import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { LoadableThanks } from './index'
import { actions as petitionActions } from '../actions/petitionActions'

// This component is used in place of the Thanks component after a user has signed a petition,
// for creating a petition, see CreateFinished
// and handles lazy-loading the actual Thanks component (with LoadableThanks)
class ThanksShim extends React.Component {
  componentWillMount() {
    const { dispatch, petition } = this.props
    if (!petition) {
      const query = this.props.location.query
      if (query.name) {
        dispatch(petitionActions.loadPetition(query.name))
      } else if (query.petition_id) {
        dispatch(petitionActions.loadPetition(query.petition_id))
      }
    }
  }

  render() {
    return (
      <div className='moveon-petitions share container background-moveon-white bump-top-1'>
        {(this.props.petition ?
          <LoadableThanks
            petition={this.props.petition}
            signatureMessage={this.props.signatureMessage}
            fromSource={this.props.location.query.from_source}
            showWhatsAppButton={this.props.routes[1].cohort === 1}
          />
          : ''
        )}
      </div>
    )
  }
}

ThanksShim.propTypes = {
  petition: PropTypes.object,
  signatureMessage: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  location: PropTypes.object
}

function mapStateToProps(store, ownProps) {
  const pkey = ownProps.location.query.name || ownProps.location.query.petition_id
  const petition = pkey && store.petitionStore.petitions[pkey]
  return {
    petition,
    searchQuery: {},
    signatureMessage: (petition
                       && petition.petition_id
                       && store.petitionStore.signatureMessages
                       && store.petitionStore.signatureMessages[petition.petition_id])
  }
}

export default connect(mapStateToProps)(ThanksShim)
