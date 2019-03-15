import { actionTypes as sessionActionTypes } from '../actions/sessionActions'
import { actionTypes as accountActionTypes } from '../actions/accountActions'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions'

const initialUserState = {
  // Possible keys. none of these are guaranteed to be present/available
  // # OSDI fields:
  // postal_addresses: [{status: "Potential"}] (here when we have an address for this user)
  // identifiers: <probably a combination of signonId, token, and any other identifiers available>
  // given_name: (first name)
  //
  // # LOGIN STATUS fields:
  // anonymous: <boolean>
  // signonId: (unique id from signon)
  // authenticated: If the person is actually logged in
  // token: (either an id:<signon token> or akid:<akid token>) that can be used for a single action
  //
  // # FIELDS SAVED FROM petition signing, e.g.
  // full_name:
  // email:
  // zip:
  // state:
  // country:
}

export default function userReducer(state = initialUserState, action) {
  // Fold in tokens at the top, since it's possible it's for everyone
  // tokens can be hashedId and akid
  const newData = { ...(action.tokens || {}) }
  if (!newData.token) {
    // from query parameters
    if (newData.hashedId) {
      newData.token = `id:${newData.hashedId}`
    } else if (newData.akid) {
      newData.token = `akid:${newData.akid}`
    }
  }
  switch (action.type) {
    case sessionActionTypes.SESSION_COHORT_CHOICE:
      return { ...state,
               cohort: action.cohort }
    case sessionActionTypes.UNRECOGNIZE_USER_SESSION:
      return { anonymous: true } // Purposefully destroying current state
    case sessionActionTypes.ANONYMOUS_SESSION_START:
      newData.anonymous = true
      return { ...state, ...newData }
    case sessionActionTypes.USER_SESSION_START:
      if (action.session) {
        // session might have: given_name, authenticated, postal_addresses
        Object.assign(newData, action.session)
        const { identifiers } = action.session
        if (identifiers && identifiers.length) {
          newData.signonId = identifiers[0]
          identifiers.forEach(id => {
            if (/^(ak|token)?id:/.test(id)) {
              newData.token = id
            }
          })
        }
      }
      return { ...state, ...newData }
    case sessionActionTypes.USER_SESSION_FAILURE:
      return { ...state, ...newData }
    case petitionActionTypes.PETITION_SIGNATURE_SUBMIT:
      // If it's an anonymous user or we get useful session information
      // Then copy it into userData
      if (!state.full_name
          && action.signature && action.signature.person) {
        if (action.signature.person.full_name) {
          newData.full_name = action.signature.person.full_name
        }
        if (action.signature.person.email_addresses
            && action.signature.person.email_addresses.length) {
          newData.email = action.signature.person.email_addresses[0]
        }
        if (action.signature.person.postal_addresses
            && action.signature.person.postal_addresses.length) {
          const address = action.signature.person.postal_addresses[0]
          newData.zip = address.postal_code
          newData.state = address.region
          newData.country = address.country_name
        }
        return { ...state, ...newData }
      }
      return state
    case accountActionTypes.FETCH_USER_PETITIONS_SUCCESS:
      // TODO: merge in new ids, so we can support pagination
      newData.petitions = action.petitions.map(p => p.petition_id)
      newData.hasFetchedPetitions = true
      return { ...state, ...newData }

    case accountActionTypes.REGISTER_SUBMIT:
      // Purposefully destroying current state
      return { isSubmittingRegister: true, registerErrors: null }
    case accountActionTypes.REGISTER_SUCCESS:
      return { ...state, isSubmittingRegister: false, registerErrors: null }
    case accountActionTypes.REGISTER_FAILURE:
      return { ...state, isSubmittingRegister: false, registerErrors: action.formErrors }

    case accountActionTypes.LOGIN_SUBMIT:
      // Purposefully destroying current state
      return { isSubmittingLogin: true, loginErrors: null }
    case accountActionTypes.LOGIN_SUCCESS:
      return { ...state, isSubmittingLogin: false, loginErrors: null }
    case accountActionTypes.LOGIN_FAILURE:
      return { ...state, isSubmittingLogin: false, loginErrors: action.formErrors }

    default:
      return state
  }
}
