import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import forEach from 'mocha-each'

import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'

import { mount, shallow } from 'enzyme'

import CreatePetition, {
  CreatePetition as CreatePetitionUnwrapped
} from '../../src/containers/create-petition-legacy'


describe('<CreatePetition />', () => {
  const store = createMockStore()

  it('loads', () => {
    const context = mount(
      <Provider store={store}>
        <CreatePetition />
      </Provider>
    )
    expect(context.text()).to.contain('Start your petition')
  })

  it('displays basic fields', () => {
    const context = mount(
      <Provider store={store}>
        <CreatePetition />
      </Provider>
    )
    expect(context.find('input[name="title"]').length).to.equal(1)
    expect(context.find('textarea[name="summary"]').length).to.equal(1)
    expect(
      context.find('input[name="checkbox_national_group"]').length
    ).to.equal(1)
    expect(context.find('input[name="checkbox_state_group"]').length).to.equal(
      1
    )
    expect(context.find('input[name="checkbox_custom_group"]').length).to.equal(
      1
    )
    expect(context.find('input[name="checkbox_custom_group"]').length).to.equal(
      1
    )
    expect(context.find('textarea[name="description"]').length).to.equal(1)
    expect(context.find('button[type="submit"]').text()).to.contain(
      'Preview Petition'
    )
  })

  forEach([
    ['national', 'Or, enter a specific legislator'],
    ['state', 'Pick your state'],
    ['custom', 'Add another target']
  ]).it('Clicking %s checkbox shows hidden content', (name, text) => {
    const context = mount(
      <Provider store={store}>
        <CreatePetition />
      </Provider>
    )
    context.find(`input[name="checkbox_${name}_group"]`).simulate('change', { target: { checked: true } })
    expect(context.find('#target_wrapper').html()).to.contain(text)
  })

  it('typing incomplete fields submit fails and displays validation error messages', () => {
    const context = mount(
      <Provider store={store}>
        <CreatePetition />
      </Provider>
    )
    context.find('form').simulate('submit')
    expect(context.find('.errors li').length).to.equal(4)
  })

  it('has errors when required fields are missing', () => {
    const component = shallow(<CreatePetitionUnwrapped />)

    component.instance().setState({ title: 'test' })
    component.instance().onPreview({ preventDefault: () => {} })
    expect(component.state('errors').length).to.equal(3)
  })

  it('submitting petition for preview fires the action and redirects', () => {
    const dispatch = sinon.spy()
    const component = shallow(<CreatePetitionUnwrapped dispatch={dispatch} />)
    const petition = {
      title: 'testtitle',
      target: [{ name: 'testtarget' }],
      summary: 'testsummary',
      description: 'testdescription'
    }
    component.setState(petition)
    component.instance().onPreview({ preventDefault: () => {} })
    expect(dispatch.calledOnce).to.be.true
    expect(dispatch.firstCall.args[0].type).to.equal('CREATE_PETITION_PREVIEW_SUBMIT')
    expect(dispatch.firstCall.args[0]).to.contain(petition)
    expect(document.location.toString()).to.contain('create_preview.html')
  })
})
