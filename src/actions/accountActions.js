import 'whatwg-fetch'

import Config from '../config.js'
import { parseServerErrors } from '../lib'
import { actions as sessionActions } from './sessionActions'

export const actionTypes = {
  REGISTER_SUBMIT: 'REGISTER_SUBMIT',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  FETCH_USER_PETITIONS_REQUEST: 'FETCH_USER_PETITIONS_REQUEST',
  FETCH_USER_PETITIONS_SUCCESS: 'FETCH_USER_PETITIONS_SUCCESS',
  FETCH_USER_PETITIONS_FAILURE: 'FETCH_USER_PETITIONS_FAILURE'
}

function checkSuccess(response) {
  if (!response.success) {
    return Promise.reject(response)
  }
  return response
}

export function register(fields, successCallback) {
  return dispatch => {
    dispatch({
      type: actionTypes.REGISTER_SUBMIT
    })
    return fetch(`${Config.API_URI}/user`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ user: fields })
    })
      .then(res => res.json())
      .then(checkSuccess)
      .then(() => {
        dispatch({
          type: actionTypes.REGISTER_SUCCESS
        })
        dispatch(sessionActions.callSessionApi())
        successCallback()
      })
      .catch(err => {
        let formErrors = [{ message: 'server error: account was not created' }]
        if (err && err.fields) {
          formErrors = parseServerErrors(err.fields)
        }
        dispatch({
          type: actionTypes.REGISTER_FAILURE,
          formErrors
        })
      })
  }
}

export function loadUserPetitions() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_USER_PETITIONS_REQUEST
    })
    return fetch(`${Config.API_URI}/user/petitions.json`)
      .then(response => response.json())
      .then(
        json => {
          dispatch({
            type: actionTypes.FETCH_USER_PETITIONS_SUCCESS,
            petitions: json._embedded
          })
        },
        err => {
          dispatch({
            type: actionTypes.FETCH_USER_PETITIONS_FAILURE,
            error: err
          })
        }
      )
  }
}

export function forgotPassword(email) {
  // We don't care much about the response in this case
  return fetch(`${Config.API_URI}/users/forgot-password.json`, {
    method: 'POST',
    body: JSON.stringify({ email })
  })
    .then(() => true)
    .catch(() => true)
}

export const actions = {
  register,
  loadUserPetitions,
  forgotPassword
}
