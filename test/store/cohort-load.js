import { expect } from 'chai'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { actionTypes, loadCohort } from '../../src/actions/sessionActions'
import { expectAsync } from '../lib'
// import samplePetition from '../../local/api/v1/petitions/outkast.json'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('Cohort loading', () => {
  const cohort = 1
  it('creates SESSION_COHORT_CHOICE when loading cohort', done => {
    const expectedActions = [
      { type: actionTypes.SESSION_COHORT_CHOICE, cohort }
    ]
    const store = mockStore()
    expectAsync(store.dispatch(loadCohort(cohort)),
                 done,
                 () => {
                   const actions = store.getActions()
                   expect(actions).to.deep.equal(expectedActions)
                 })
  })
})
