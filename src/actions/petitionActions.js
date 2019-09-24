import Config from '../config'
import { getPageLoadTime, stringifyParams, rejectNetworkErrorsAs500, parseAPIResponse, parseSQSApiResponse, md5ToToken } from '../lib'
import { appLocation } from '../routes'

export const actionTypes = {
  FETCH_PETITION_REQUEST: 'FETCH_PETITION_REQUEST',
  FETCH_PETITION_SUCCESS: 'FETCH_PETITION_SUCCESS',
  FETCH_PETITION_FAILURE: 'FETCH_PETITION_FAILURE',

  FETCH_PETITION_SIGNATURES_REQUEST: 'FETCH_PETITION_SIGNATURES_REQUEST',
  FETCH_PETITION_SIGNATURES_SUCCESS: 'FETCH_PETITION_SIGNATURES_SUCCESS',
  FETCH_PETITION_SIGNATURES_FAILURE: 'FETCH_PETITION_SIGNATURES_FAILURE',

  FETCH_TOP_PETITIONS_REQUEST: 'FETCH_TOP_PETITIONS_REQUEST',
  FETCH_TOP_PETITIONS_SUCCESS: 'FETCH_TOP_PETITIONS_SUCCESS',
  FETCH_TOP_PETITIONS_FAILURE: 'FETCH_TOP_PETITIONS_FAILURE',

  SEARCH_PETITIONS_REQUEST: 'SEARCH_PETITIONS_REQUEST',
  SEARCH_PETITIONS_SUCCESS: 'SEARCH_PETITIONS_SUCCESS',
  SEARCH_PETITIONS_FAILURE: 'SEARCH_PETITIONS_FAILURE',

  PETITION_SIGNATURE_SUBMIT: 'PETITION_SIGNATURE_SUBMIT',
  PETITION_SIGNATURE_SUCCESS: 'PETITION_SIGNATURE_SUCCESS',
  PETITION_SIGNATURE_FAILURE: 'PETITION_SIGNATURE_FAILURE',

  FEEDBACK_SUCCESS: 'FEEDBACK_SUCCESS',
  FEEDBACK_FAILURE: 'FEEDBACK_FAILURE'
}

/**
 * Fetches a petition by name (slugified), and dispatches an action to place it in the store
 * @param {string} petitionName A slugified version of the petition name, as returned by the api
 * @param {boolean} forceReload Whether we should ignore petitions already in the redux store
 */
export function loadPetition(petitionName, forceReload) {
  const urlKey = `petitions/${petitionName}`
  if (global && global.preloadObjects && global.preloadObjects[urlKey]) {
    return dispatch => {
      dispatch({
        type: actionTypes.FETCH_PETITION_SUCCESS,
        petition: window.preloadObjects[urlKey]
      })
    }
  }
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_PETITION_REQUEST,
      name: petitionName
    })
    const { petitionStore } = getState()
    if (!forceReload
        && petitionStore
        && petitionStore.petitions
        && petitionStore.petitions[petitionName]) {
      return dispatch({
        type: actionTypes.FETCH_PETITION_SUCCESS,
        petition: petitionStore.petitions[petitionName]
      })
    }
    return fetch(`${Config.API_URI}/${urlKey}.json`)
      .catch(rejectNetworkErrorsAs500)
      .then(parseAPIResponse)
      .then(json => {
        dispatch({
          type: actionTypes.FETCH_PETITION_SUCCESS,
          petition: json
        })
      })
      .catch(err => {
        dispatch({
          type: actionTypes.FETCH_PETITION_FAILURE,
          error: err,
          name: petitionName
        })
      })
  }
}

export function searchPetitions(query, pageNumber, selectState) {
  return dispatch => {
    dispatch({
      type: actionTypes.SEARCH_PETITIONS_REQUEST,
      query,
      pageNumber,
      selectState
    })

    const page = pageNumber ? `&page=${pageNumber}` : ''

    const selState = selectState ? `&state=${selectState}` : ''

    return fetch(`${Config.API_URI}/search/petitions.json?q=${query}${selState}${page}`)
      .then(
        response => response.json().then(json => {
          dispatch({
            type: actionTypes.SEARCH_PETITIONS_SUCCESS,
            searchResults: json,
            pageNumber: page,
            query,
            selectState: selState
          })
        }),
        err => {
          dispatch({
            type: actionTypes.SEARCH_PETITIONS_FAILURE,
            error: err
          })
        }
      )
  }
}

export function loadTopPetitions(pac, megapartner, forceReload) {
  // topPetitionsKey must not just be truthily equal but exact
  // eslint-disable-next-line no-unneeded-ternary
  const topPetitionsKey = `${pac ? 1 : 0}--${megapartner ? megapartner : ''}`
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_TOP_PETITIONS_REQUEST,
      topPetitionsKey
    })
    const { userStore, petitionStore } = getState()
    if (!forceReload
        && petitionStore
        && petitionStore.topPetitions
        && petitionStore.topPetitions[topPetitionsKey]) {
      return dispatch({
        type: actionTypes.FETCH_TOP_PETITIONS_SUCCESS,
        useCache: true,
        topPetitionsKey
      })
    }
    const query = []
    if (pac !== null) {
      query.push(`pac=${pac ? 1 : 0}`)
    }
    if (megapartner) {
      query.push(`megapartner=${megapartner}`)
    }
    if (userStore && userStore.signonId) {
      query.push(`user=${userStore.signonId}`)
    }
    const queryString = ((query.length) ? `?${query.join('&')}` : '')
    return fetch(`${Config.API_URI}/top-petitions.json${queryString}`)
      .then(
        response => response.json().then(json => {
          dispatch({
            type: actionTypes.FETCH_TOP_PETITIONS_SUCCESS,
            petitions: json._embedded,
            topPetitionsKey
          })
        }),
        err => {
          dispatch({
            type: actionTypes.FETCH_TOP_PETITIONS_FAILURE,
            error: err,
            topPetitionsKey
          })
        }
      )
  }
}

export const registerSignatureAndThanks = (petition, signature) => () => {
  // 1. track petition success
  if (window.fbq) {
    window.fbq('track', 'Lead') // facebook lead
  }
  if (window.gtag && petition.gtag_keys) {
    // https://developers.google.com/adwords-remarketing-tag/
    window.gtag('event', 'conversion', { send_to: petition.gtag_keys })
  }
  // 2. show thanks page
  let thanksUrl = '/thanks.html'
  if (petition.thanks_url) {
    if (/^https?:\/\//.test(petition.thanks_url)) {
      document.location = petition.thanks_url // FUTURE: maybe add some query params
      return
    }
    thanksUrl = petition.thanks_url
  }
  const { referrer_data: { source } = {} } = signature
  const fromSource = (source ? `&from_source=${encodeURIComponent(source)}` : '')
  appLocation.push(`${thanksUrl}?petition_id=${
    petition.petition_id
  }&name=${petition.name}${fromSource}`)
}

const signatureSuccess = (dispatch, response, petition, signature, options) => {
  const dispatchData = {
    type: actionTypes.PETITION_SIGNATURE_SUCCESS,
    petition,
    signature
  }
  if (response && response.SendMessageResponse) {
    const sqsResponse = response.SendMessageResponse.SendMessageResult
    if (sqsResponse) {
      dispatchData.messageId = sqsResponse.MessageId
      dispatchData.messageMd5 = sqsResponse.MD5OfMessageBody
      if (window.analytics && window.analytics.alias) {
        const r_hash = md5ToToken(dispatchData.messageMd5)
        window.analytics.alias(`rhash${r_hash}`)
      }
    }
  }
  const dispatchResult = dispatch(dispatchData)
  if (options && options.redirectOnSuccess) {
    registerSignatureAndThanks(dispatchResult.petition, dispatchResult.signature)(dispatch)
  }
}

export function signPetition(petitionSignature, petition, options) {
  return dispatch => {
    dispatch({
      type: actionTypes.PETITION_SIGNATURE_SUBMIT,
      petition,
      signature: petitionSignature
    })

    const signingEndpoint = ((Config.API_SIGN_PETITION)
                              ? Config.API_SIGN_PETITION
                              : `${Config.API_URI}/signatures.json`)
    const body = petitionSignature
    const pageLoadTime = getPageLoadTime()
    if (pageLoadTime) {
      body.loadTime = pageLoadTime
    }
    const fetchArgs = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    if (Config.API_WRITABLE === 'fake') {
      fetchArgs.method = 'GET'
      delete fetchArgs.body
    }
    fetch(signingEndpoint, fetchArgs)
      .catch(rejectNetworkErrorsAs500)
      .then(parseSQSApiResponse)
      .then(response => {
        signatureSuccess(dispatch, response, petition, petitionSignature, options)
      })
      .catch(err =>
        dispatch({
          type: actionTypes.PETITION_SIGNATURE_FAILURE,
          petition,
          signature: petitionSignature,
          error: err
        })
      )
  }
}

// This thunk is for development when no backend server is running
// It is configured to be used in the component when API_WRITABLE is false
export function devLocalSignPetition(signature, petition, options) {
  return dispatch => {
    dispatch({
      type: actionTypes.PETITION_SIGNATURE_SUBMIT,
      petition,
      signature
    })
    signatureSuccess(dispatch, null, petition, signature, options)
  }
}

function getPetitionListId(petition) {
  // Every petition has a couple of identifiers
  // name, petition_id, and also a list_id
  // which is the object in the database that tracks the owner and signers
  // Since petition signatures are indexed against list_id, it's
  // more efficient to load through that value.
  const petitionListIds = petition.identifiers
    .filter(ident => /^list_id:/.test(ident))
    .map(ident => ident.substr(8))
  return (petitionListIds.length ? petitionListIds[0] : null)
}

export const recordShareClick = (petition, tracking, medium, source, user) => {
  if (window.gtag) {
    window.gtag('event', 'share', {
      method: medium,
      content_type: 'petition',
      content_id: String(petition.petition_id)
    })
  }
  const params = {
    page: window.location.pathname,
    petition_id: petition.petition_id,
    list_id: getPetitionListId(petition),
    medium,
    source
  }
  if (user && user.signonId) params.user_id = user.signonId
  if (tracking && tracking.r_hash) params.r_hash = tracking.r_hash

  if (window.analytics) {
    window.analytics.track('mopshareclick', {
      ...params,
      r_hash: tracking.r_hash || '',
      user_id: user.signonId || ''
    })
  }

  if (Config.TRACK_SHARE_URL) {
    fetch(Config.TRACK_SHARE_URL, { // "/record_share_click.html"
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: stringifyParams(params)
    })
  }
}

export const loadPetitionSignatures = (petition, page = 1) => {
  const petitionListId = getPetitionListId(petition)
  const petitionName = petition.name
  const urlKey = (petitionListId
                  ? `petitions/list${petitionListId}/signatures`
                  : `petitions/${petitionName}/signatures`)
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_PETITION_SIGNATURES_REQUEST,
      name: petitionName,
      page
    })
    const dispatchError = err => {
      dispatch({
        type: actionTypes.FETCH_PETITION_SIGNATURES_FAILURE,
        error: err,
        name: petitionName,
        page
      })
    }
    return fetch(`${Config.API_URI}/${urlKey}.json?per_page=10&page=${page}`)
      .then(
        response => response.json().then(json => {
          dispatch({
            type: actionTypes.FETCH_PETITION_SIGNATURES_SUCCESS,
            signatures: json,
            page,
            petition
          })
        }, dispatchError),
        dispatchError
      )
  }
}

export const flagPetition = (petitionId, reason) => dispatch =>
  fetch(`${Config.API_URI}/petitions/${petitionId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Accept: 'application/json'
    },
    body: stringifyParams({ reason })
  }).then(
      response => {
        dispatch({
          type: actionTypes.FEEDBACK_SUCCESS,
          petitionId,
          reason,
          response })
      },
      error => {
        dispatch({
          type: actionTypes.FEEDBACK_FAILURE,
          petitionId,
          reason,
          error })
      }
    )

export const flagComment = commentId => dispatch =>
  fetch(`${Config.API_URI}/petitions/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Accept: 'application/json'
    },
    body: stringifyParams({ comment_id: commentId })
  }).then(
      response => {
        dispatch({
          type: actionTypes.FEEDBACK_SUCCESS,
          commentId,
          response })
      },
      error => {
        dispatch({
          type: actionTypes.FEEDBACK_FAILURE,
          commentId,
          error })
      }
    )

export const getSharebanditShareLink = petitionSharebanditUrl => {
  const jsonSampleUrl = petitionSharebanditUrl.replace('/r/0/', '/jsonaction/')
  const fallbackResponse = () => petitionSharebanditUrl
  return fetch(`${jsonSampleUrl}`).then(
    success => success.json().then(
      jsonData => jsonData.shareurl,
      fallbackResponse
    ),
    fallbackResponse)
}

export const actions = {
  loadPetition,
  signPetition,
  searchPetitions,
  registerSignatureAndThanks,
  recordShareClick,
  loadPetitionSignatures,
  getSharebanditShareLink,
  loadTopPetitions
}
