import { expect } from 'chai'
import reducer from '../../src/reducers'

import { actionTypes as accountActionTypes } from '../../src/actions/accountActions'
import { actionTypes as sessionActionTypes } from '../../src/actions/sessionActions'
import sampleUserPetions from '../../local/api/v1/user/petitions.json'

const defaultState = reducer(undefined, {})

describe('user petition reducer', () => {
  it('adds petitions to state when FETCH_USER_PETITIONS_SUCCESS', () => {
    const action = {
      type: accountActionTypes.FETCH_USER_PETITIONS_SUCCESS,
      petitions: sampleUserPetions._embedded
    }

    const state = reducer(defaultState, action)
    expect(state.userStore.petitions).to.deep.equal([95983])
  })
  it('adds cohort to state when FETCH_USER_PETITIONS_SUCCESS', () => {
    const cohort = 0
    const action = {
      type: sessionActionTypes.SESSION_COHORT_CHOICE,
      cohort
    }

    const state = reducer(defaultState, action)
    expect(state.userStore.cohort).to.deep.equal(0)
  })
})
