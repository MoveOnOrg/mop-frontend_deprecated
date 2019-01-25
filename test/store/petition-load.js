import { expect } from 'chai'

import Config from '../../src/config'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { actionTypes, loadPetition } from '../../src/actions/petitionActions'
import { expectAsync } from '../lib'
import nock from 'nock'
import samplePetition from '../../local/api/v1/petitions/outkast.json'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const BASE_URI = 'http://localhost:8080'
Config.API_URI = BASE_URI

describe('Petition loading', () => {
  nock(BASE_URI)
    .get('/petitions/outkast.json')
    .reply(200, samplePetition)

  it('creates FETCH_PETITION_SUCCESS when loading petition', done => {
    const expectedActions = [
      { type: actionTypes.FETCH_PETITION_REQUEST, name: 'outkast' },
      { type: actionTypes.FETCH_PETITION_SUCCESS, petition: samplePetition }
    ]
    const store = mockStore()
    expectAsync(store.dispatch(loadPetition('outkast')),
                 done,
                 () => {
                   const actions = store.getActions()
                   expect(actions).to.deep.equal(expectedActions)
                 })
  })
})
