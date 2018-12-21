import React from 'react'
import { expect } from 'chai'
import { createMockStore } from 'redux-test-utils'
import { unwrapReduxComponent } from '../lib'

import { mount } from 'enzyme'

import Thanks from '../../src/containers/thanks'

import outkastPetition from '../../local/api/v1/petitions/outkast.json'

describe('<Thanks />', () => {
  const store = createMockStore({ petitionStore: {} })
  it('renders thanks for petition', () => {
    const context = mount(<Thanks store={store} petition={outkastPetition} />)
    expect(context.text()).to.contain('Thank')
  })

  it('does not render a WhatsApp Link when whatsApp state is not set', () => {
    if (process.env.THEME !== 'giraffe') { return }
    const context = mount(<Thanks store={store} petition={outkastPetition} />)
    const component = unwrapReduxComponent(context).instance()
    expect(component.state.whatsApp).to.be.undefined
    expect(context.find('.petition-thanks__link').length).to.equal(2)
  })

  it('renders a WhatsApp Link when whatsApp is true', () => {
    if (process.env.THEME !== 'giraffe' && process.env.AB_TEST_ENABLED !== 10) { return }
    const context = mount(<Thanks store={store} showWhatsAppButton petition={outkastPetition} />)
    const component = unwrapReduxComponent(context).instance()
    expect(component.state.whatsApp).to.be.true
    expect(context.find('.petition-thanks__link').length).to.equal(3)
  })

  it('does not render a WhatsApp Link when whatsApp is false', () => {
    if (process.env.THEME !== 'giraffe' && process.env.AB_TEST_ENABLED !== 10) { return }
    const context = mount(<Thanks store={store} showWhatsAppButton={false} petition={outkastPetition} />)
    const component = unwrapReduxComponent(context).instance()
    expect(component.state.whatsApp).to.be.false
    expect(context.find('.petition-thanks__link').length).to.equal(2)
  })
})
