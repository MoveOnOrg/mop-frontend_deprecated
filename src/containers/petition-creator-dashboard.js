import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { appLocation } from '../routes.js'
import PetitionOverview from '../components/legacy/petition-overview'
import { actions as accountActions } from '../actions/accountActions.js'

class PetitionCreatorDashboard extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(accountActions.loadUserPetitions())
  }

  onSelectPetition(e) {
    const value = e.target.value
    if (value === 'more' || !value) {
      return appLocation.push('/your_petitions.html')
    }
    return appLocation.push(`/dashboard.html?petition_id=${value}`)
  }

  render() {
    const { petition, userPetitions } = this.props

    return (
      <div className='moveon-petitions'>
        <div className='container background-moveon-white bump-top-1'>
          {petition && (
            <PetitionOverview
              petition={petition}
              otherPetitions={userPetitions.filter(
                p => petition.petition_id !== p.petition_id
              )}
              onSelectPetition={this.onSelectPetition}
            />
          )}
        </div>
      </div>
    )
  }
}
PetitionCreatorDashboard.propTypes = {
  userPetitions: PropTypes.array,
  location: PropTypes.object,
  petition: PropTypes.object,
  dispatch: PropTypes.func
}

function getUserPetitions(petitions, userPetitionIds = []) {
  return userPetitionIds.map(id => petitions[id])
}

function getCurrentPetition(userPetitions, allPetitions, petitionId) {
  if (!petitionId) return userPetitions[0]
  return allPetitions[petitionId]
}

function mapStateToProps(store, ownProps) {
  const userPetitions = getUserPetitions(
    store.petitionStore.petitions,
    store.userStore.petitions
  )
  return {
    userPetitions,
    petition: getCurrentPetition(
      userPetitions,
      store.petitionStore.petitions,
      ownProps.location.query && ownProps.location.query.petition_id
    )
  }
}

export default connect(mapStateToProps)(PetitionCreatorDashboard)
