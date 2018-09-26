import React from 'react'
import { expect } from 'chai'

import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'

import { mount } from 'enzyme'

import CreateRevise from '../../src/containers/create-revise'
import { CreatePetition } from '../../src/containers/create-petition-legacy'


describe('<CreateRevise />', () => {
  const petition = {
    title: 'testtitle',
    target: [
      {
        label: 'Governor of Florida',
        target_type: 'governor',
        target_id: 'FL'
      }],
    summary: 'testsummary',
    description: 'testdescription'
  }

  const store = createMockStore({
    petitionCreateStore: petition
  })

  const revise = mount(
    <Provider store={store}>
      <CreateRevise />
    </Provider>
  )

  it('loads the create page', () => {
    expect(revise.text()).to.contain('Start your petition')
  })

  it('displays title', () => {
    expect(revise.find('input[name="title"]').prop('value')).to.equal('testtitle')
  })

  it('displays target', () => {
    expect(revise.text()).to.contain('Governor of Florida')
  })

  it('displays summary', () => {
    expect(revise.find('textarea[name="summary"]').text()).to.equal('testsummary')
  })

  it('displays description', () => {
    expect(revise.text()).to.contain('testdescription')
  })

  it('passes the stored petition to <CreatePetition />', () => {
    const createPetition = revise.find(CreatePetition)
    expect(createPetition.length).to.equal(1)
    expect(createPetition.prop('initialPetition')).to.equal(petition)
  })

  it('redirects when there is no petition', () => {
    mount(
      <Provider store={createMockStore({ petitionCreateStore: {} })}>
        <CreateRevise />
      </Provider>
    )
    expect(document.location.toString()).to.contain('/create_start.html')
  })
})
