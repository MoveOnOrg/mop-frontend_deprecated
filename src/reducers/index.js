/* eslint-disable no-underscore-dangle */
import { combineReducers } from 'redux'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions'
import { actionTypes as accountActionTypes } from '../actions/accountActions'
import { byIdAndName } from '../lib'

import navStore from './nav'
import errorReducer from './error'
import staticPageReducer from './static-pages'
import userReducer from './user'
import petitionTargetsReducer from './petition-targets'
import petitionCreateReducer from './petition-create'

const initialPetitionState = {
  petitions: {}, // Keyed by name (slug) AND petition_id for petition route
  petitionSignatures: {}, // Keyed by petition name (slug), then page
  signatureStatus: {}, // Keyed by petition_id (because form doesn't have name)
  signatureMessages: {}, // Keyed by petition_id, MessageId value from SQS post
  topPetitions: {}, // Lists of petition IDs keyed by pac then megapartner
  nextPetitions: [], // List of petition IDs that can be suggested to sign next
  cohort: false,
  nextPetitionsLoaded: false // Is nextPetitions empty because there are none to suggest or it hasn't been loaded yet?
}

const initialSearchState = {
  searchResults: {
    count: '0',
    page_size: 0,
    _embed: [],
    _links: {}
  }
}

function petitionReducer(state = initialPetitionState, action) {
  const {
    type,
    petition,
    page,
    signatures,
    petitions,
    topPetitionsKey,
    useCache
  } = action
  let updateData = {}

  switch (type) {
    case petitionActionTypes.FETCH_PETITION_SUCCESS:
      return {
        ...state,
        petitions: {
          ...state.petitions,
          // Key it both by id and by name (slug), for different lookup needs
          ...byIdAndName(petition)
        }
      }
    case petitionActionTypes.PETITION_SIGNATURE_SUCCESS:
      updateData = {
        signatureStatus: {
          ...state.signatureStatus,
          [petition.petition_id]: 'success'
        }
      }
      if (action.messageId) {
        updateData.signatureMessages = {
          ...state.signatureMessages,
          [petition.petition_id]: {
            messageId: action.messageId,
            messageMd5: action.messageMd5
          }
        }
      }
      if (state.nextPetitionsLoaded) {
        updateData.nextPetitions = state.nextPetitions.filter(petId => petId !== petition.petition_id)
      }
      if (action.cohort) {
        updateData = {
          cohort: true
        }
      }
      return {
        ...state,
        ...updateData
      }
    case petitionActionTypes.FETCH_PETITION_SIGNATURES_SUCCESS:
      return {
        ...state,
        petitionSignatures: {
          ...state.petitionSignatures,
          [petition.name]: { // slug
            ...state.petitionSignatures[petition.name],
            [page]: signatures._embedded.map(signature =>
              Object.assign(signature, { user: signature._embedded.user })
            )
          }
        },
        petitions: {
          ...state.petitions,
          ...byIdAndName({ ...petition, total_signatures: signatures.count })
        }
      }
    case petitionActionTypes.FETCH_TOP_PETITIONS_SUCCESS:
      if (useCache) {
        return state
      }
      updateData = {
        petitions: Object.assign({}, state.petitions, ...petitions.map(byIdAndName)),
        topPetitions: {
          ...state.topPetitions,
          [topPetitionsKey]: petitions.map(topPetition => topPetition.petition_id)
        },
        nextPetitionsLoaded: true
      }
      updateData.nextPetitions = state.nextPetitions.concat(
        petitions.map(topPetition => topPetition.petition_id)
      ).filter((petId, i, list) => (
        i === list.indexOf(petId) // Make each item unique on the list
          && !(petId in state.signatureStatus || updateData.petitions[petId].signed) // Exclude signed
      ))
      return {
        ...state,
        ...updateData
      }
    case accountActionTypes.FETCH_USER_PETITIONS_SUCCESS:
      updateData = {
        petitions: {
          ...state.petitions,
          ...petitions.reduce((acc, p) => ({ ...acc, [p.name]: p, [p.petition_id]: p }), {})
        }
      }
      return {
        ...state,
        ...updateData
      }
    default:
      return state
  }
}

function petitionSearchReducer(state = initialSearchState, action) {
  const {
    type,
    searchResults
  } = action
  switch (type) {
    case petitionActionTypes.SEARCH_PETITIONS_SUCCESS:
      return {
        ...state,
        searchResults: { ...searchResults }
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  navStore,
  petitionStore: petitionReducer,
  petitionSearchStore: petitionSearchReducer,
  userStore: userReducer,
  staticPageStore: staticPageReducer,
  petitionTargetsStore: petitionTargetsReducer,
  petitionCreateStore: petitionCreateReducer,
  errorStore: errorReducer
})

export default rootReducer
