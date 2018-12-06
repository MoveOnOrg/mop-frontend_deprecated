import React from 'react'
import { expect } from 'chai'
import forEach from 'mocha-each'

import outkastPetition from '../../local/api/v1/petitions/outkast.json'
import outkastPetition2 from '../../local/api/v1/petitions/outkast-opposite.json'

import { createMockStore } from 'redux-test-utils'

import { mount } from 'enzyme'
import { unwrapReduxComponent } from '../lib'

import SignatureAddForm from '../../src/containers/signature-add-form'
import { isValidEmail } from '../../src/lib'

describe('<SignatureAddForm />', () => {
  // This file is organized into two sub- describe() buckets.
  // 1. for "static tests" which do not involve any state
  // 2. for changing state (like filling in forms, etc)
  // Please put new tests in the appropriate bucket with `it(...)`
  // Below are a set of profiles and user store states that can be re-used
  // for different test conditions


  const propsProfileBase = { petition: outkastPetition, query: {} }
  const propsProfileOpposite = { petition: outkastPetition2, query: {} }
  const propsProfileBaseNoAddressRequired = { petition: { ...outkastPetition }, query: {} }
  propsProfileBase.petition.needs_full_addresses = true
  propsProfileOpposite.petition.needs_full_addresses = true

  propsProfileBaseNoAddressRequired.petition.needs_full_addresses = false

  const outkastPetition2AsMegapartner = JSON.parse(JSON.stringify(outkastPetition2)) // Deepcopy
  outkastPetition2AsMegapartner._embedded.creator.source = 'M.O.P.' // Set as megapartner
  const petitionProfiles = {
    megapartner_mayoptin: outkastPetition2AsMegapartner,
    mayoptin: outkastPetition2,
    normal: outkastPetition
  }

  const storeAnonymous = { userStore: { anonymous: true } }
  const storeAkid = { userStore: { signonId: 123456,
    token: 'akid:fake.123456.bad123',
    given_name: 'Three Stacks' } }

  const storeAkidAddress = { userStore: { signonId: 123456,
      token: 'akid:fake.123456.bad123',
      given_name: 'Three Stacks',
      postal_addresses: [{ status: 'Potential' }]
  } }

  describe('<SignatureAddForm /> static tests', () => {
    // THESE ARE TESTS WHERE NO STATE IS CHANGED -- we send in properties, and the rest should be static

    it('basic loading', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(component.props.user.anonymous).to.be.equal(true)
      expect(context.text().toLowerCase()).to.contain('sign this petition')
    })

    it('displays only some fields at first (giraffe only)', () => {
      if (process.env.THEME !== 'giraffe') { return }

      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      expect(context.find('input[name="name"]').length).to.equal(1)
      expect(context.find('input[name="email"]').length).to.equal(1)
      expect(context.find('input[name="address1"]').length).to.equal(0)
      expect(context.find('input[name="address2"]').length).to.equal(0)
      expect(context.find('input[name="city"]').length).to.equal(0)
      expect(context.find('input[name="zip"]').length).to.equal(0)
      expect(context.find('textarea[name="comment"]').length).to.equal(1)
    })

    it('shows more fields when a character is typed (giraffe only)', () => {
      if (process.env.THEME !== 'giraffe') { return }

      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      context.find('input[name="name"]').simulate('change', { target: { value: 'Hello' } })

      expect(context.find('input[name="address1"]').length).to.equal(1)
      expect(context.find('input[name="address2"]').length).to.equal(1)
      expect(context.find('input[name="city"]').length).to.equal(1)
      expect(context.find('input[name="zip"]').length).to.equal(1)
    })

    it('anonymous fields displaying', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      context.find('input[name="name"]').simulate('change', { target: { value: 'Hello' } })

      expect(context.find('input[name="name"]').length).to.equal(1)
      expect(context.find('input[name="email"]').length).to.equal(1)
      expect(context.find('input[name="address1"]').length).to.equal(1)
      expect(context.find('input[name="address2"]').length).to.equal(1)
      expect(context.find('input[name="city"]').length).to.equal(1)
      expect(context.find('input[name="zip"]').length).to.equal(1)
    })

    it('petition with user fields displaying (address not required, no address stored)', () => {
      // Note: needs to test when it *appears* not when it's required
      const store = createMockStore(storeAkid)
      const context = mount(<SignatureAddForm {...propsProfileBaseNoAddressRequired} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)
      // Do not display because logged in and petition doesn't need addresses
      expect(context.find('input[name="name"]').length).to.equal(0)
      expect(context.find('input[name="email"]').length).to.equal(0)
      expect(context.find('input[name="address1"]').length).to.equal(0)
      expect(context.find('input[name="address2"]').length).to.equal(0)
      expect(context.find('input[name="city"]').length).to.equal(0)
      expect(context.find('input[name="zip"]').length).to.equal(0)
      // DOES display comment
      expect(context.find('textarea[name="comment"]').length).to.equal(1)
    })

    it('local petition with user fields displaying (address required, user has no address)', () => {
      const store = createMockStore(storeAkid)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)

      const comment = context.find('textarea[name="comment"]')

      // We do not simulate typing, since address should be visible by default if its
      // required for logged in users, because everything else is optional.

      // INTENTIONALLY COMMENTED OUT: comment.simulate('change', { target: { value: 'Hello' } })

      expect(comment.length).to.equal(1)
      expect(context.find('input[name="name"]').length).to.equal(0)
      expect(context.find('input[name="email"]').length).to.equal(0)
      expect(context.find('input[name="address1"]').length).to.equal(1)
      expect(context.find('input[name="address2"]').length).to.equal(1)
      expect(context.find('input[name="city"]').length).to.equal(1)
      expect(context.find('input[name="zip"]').length).to.equal(1)
    })

    it('local petition with user fields displaying (address required, user has address)', () => {
      const store = createMockStore(storeAkidAddress)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)

      const comment = context.find('textarea[name="comment"]')
      // In giraffe, address fields are hidden until change
      comment.simulate('change', { target: { value: 'Hello' } })

      expect(context.find('input[name="name"]').length).to.equal(0)
      expect(context.find('input[name="email"]').length).to.equal(0)
      expect(context.find('input[name="address1"]').length).to.equal(0)
      expect(context.find('input[name="address2"]').length).to.equal(0)
      expect(context.find('input[name="city"]').length).to.equal(0)
      expect(context.find('input[name="zip"]').length).to.equal(0)
    })

    it('show optin warning', () => {
      // Should be: megapartner + not recognized user
      const showStore = createMockStore(storeAnonymous)
      const showContext = mount(<SignatureAddForm {...propsProfileOpposite} store={showStore} />)
      expect(showContext.text()).to.contain('project of M.O.P.')

      const nowarningStore = createMockStore(storeAkid)
      const nowarningContext = mount(<SignatureAddForm {...propsProfileOpposite} store={nowarningStore} />)

      expect(nowarningContext.text()).not.to.contain('project of M.O.P.')
    })

    it('optin checkbox or hidden optin: normal profiles', () => {
      const normalProfiles = [
        { petition: 'normal', query: {} },
        { petition: 'normal', query: { source: 'c.123', mailing_id: '123' } }
      ]
      const mockStoreAnon = createMockStore(storeAnonymous)

      normalProfiles.forEach(profile => {
        const realProfile = { petition: petitionProfiles[profile.petition], query: profile.query }
        const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon} />)
        const component = unwrapReduxComponent(context).instance()
        // 1. make sure NOT shown
        expect(context.find('input[name="thirdparty_optin"]').length,
               `normal profile should not show optin checkbox: ${JSON.stringify(profile)}`
              ).to.equal(0)
        // 2. make sure optin options are false
        expect(component.state.hidden_optin,
               `hidden_optin is false for normal profile: ${JSON.stringify(profile)}`
              ).to.equal(false)
        expect(component.state.thirdparty_optin,
               `thirdparty_optin is false for normal profile: ${JSON.stringify(profile)}`
              ).to.equal(false)
      })
    })

    forEach([
      ['megapartner_mayoptin', { source: 'c.123' }],
      ['megapartner_mayoptin', { source: 'c.imn.123' }],
      ['megapartner_mayoptin', {}],
      ['mayoptin', { source: 'c.123' }]
    ]).it('optin checkbox or hidden optin: hide profiles - %s', (petition, query) => {
      const mockStoreAnon = createMockStore(storeAnonymous)
      const realProfile = { petition: petitionProfiles[petition], query }
      const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon} />)
      const component = unwrapReduxComponent(context).instance()
      // 1. make sure NOT shown
      expect(context.find('input[name="thirdparty_optin"][type="checkbox"]').length,
              `hidden optin profile should not have optin checkbox: ${JSON.stringify(query)}`
            ).to.equal(0)
      // 2. make sure hidden is true
      expect(component.state.hidden_optin,
              `hidden optin profile have hidden_optin=true: ${JSON.stringify(query)}`
            ).to.equal(true)
    })

    forEach([
      ['megapartner_mayoptin', { source: 'c.imn.123', mailing_id: '123' }],
      ['megapartner_mayoptin', { source: 's.imn' }],
      // Non-megapartner, but still may_optin: true
      ['mayoptin', { source: 'c.123', mailing_id: '123' }],
      ['mayoptin', { source: 's.abc' }]
    ]).it('optin checkbox or hidden optin: show profiles - %s', (petition, query) => {
      const mockStoreAnon = createMockStore(storeAnonymous)
      const mockStoreAkid = createMockStore(storeAkid)
      const realProfile = { petition: petitionProfiles[petition], query }
      const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon} />)
      const component = unwrapReduxComponent(context).instance()
      // 1. make sure shown
      expect(context.find('input[name="thirdparty_optin"][type="checkbox"]').length,
              `Show optin checkbox for ${JSON.stringify(query)}`
            ).to.equal(1)
      // 2. make sure hidden is false
      expect(component.state.hidden_optin,
              `hidden_optin is false for ${JSON.stringify(query)}`
            ).to.equal(false)
      // 3. make sure with user it's not shown
      const userContext = mount(<SignatureAddForm {...realProfile} store={mockStoreAkid} />)
      expect(userContext.find('input[name="thirdparty_optin"]').length,
              `optin checkbox with user should NOT show for ${JSON.stringify(query)}`
            ).to.equal(0)
    })

    it('logged in shows unrecognize link', () => {
      const store = createMockStore(storeAkid)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)
      expect(Boolean(component.props.showAddressFields)).to.be.equal(true)
      expect(context.text()).to.contain('Not Three Stacks? Click here.')
      expect(context.find('input[name="name"]').length).to.equal(0)
      expect(context.find('input[name="email"]').length).to.equal(0)
    })

    it('logout/unrecognize shows anonymous field list', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(Boolean(component.props.user.anonymous)).to.be.equal(true)
      expect(context.text()).to.not.contain('Click here.')
      expect(context.find('input[name="name"]').length).to.equal(1)
      expect(context.find('input[name="email"]').length).to.equal(1)
    })
  })
  describe('<SignatureAddForm /> stateful tests', () => {
    // THESE ARE TESTS WHERE WE CHANGE THE STATE (FILL IN FORM, ETC)
    it('typing incomplete fields submit fails and displays validation error messages', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      expect(component.state.validationTried).to.be.equal(false)

      const comment = context.find('textarea[name="comment"]')
      // In giraffe, address fields are hidden until change
      comment.simulate('change', { target: { value: 'Hello' } })

      context.find('button[type="submit"]').simulate('click')
      expect(component.formIsValid()).to.be.equal(false)
      expect(component.state.validationTried).to.be.equal(true)
      expect(context.find('.alert').length).to.equal(6)
    })

    it('adding a non-US address updates requirements to not require state or zip', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      const reqFieldsBefore = component.updateRequiredFields(true)
      expect(typeof reqFieldsBefore.state).to.be.equal('string')
      expect(typeof reqFieldsBefore.zip).to.be.equal('string')
      component.setState({ address1: '123 main', city: 'Sydney', country: 'Australia', region: 'Sydney Region', name: 'John Smith', email: 'hi@example.com', postal: '6024' })
      const reqFieldsAfter = component.updateRequiredFields(true)
      expect(typeof reqFieldsAfter.state).to.be.equal('undefined')
      expect(typeof reqFieldsAfter.zip).to.be.equal('undefined')

      const osdiSignature = component.getOsdiSignature()
      expect(osdiSignature.person.postal_addresses[0].country_name).to.be.equal('Australia')
      expect(osdiSignature.person.postal_addresses[0].locality).to.be.equal('Sydney')
      expect(osdiSignature.person.postal_addresses[0].region).to.be.equal('Sydney Region')
      expect(osdiSignature.person.postal_addresses[0].postal_code).to.be.equal('6024')

      expect(component.formIsValid()).to.be.equal(true)
    })

    it('displays errors when required fields are missing', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      component.setState({ country: 'United States', name: 'John Smith', postal: '6024' })
      expect(component.formIsValid()).to.be.equal(false)
    })

    it('checking volunteer requires phone', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()
      const reqFieldsBefore = component.updateRequiredFields(true)
      expect(typeof reqFieldsBefore.phone).to.be.equal('undefined')
      component.volunteer({ target: { checked: true } })
      expect(component.state.volunteer).to.be.equal(true)
      const reqFieldsAfter = component.updateRequiredFields(true)
      expect(typeof reqFieldsAfter.phone).to.be.equal('string')

      component.setState({ address1: '123 main', city: 'Pittsburgh', state: 'PA', name: 'John Smith', email: 'hi@example.com', zip: '60024' })
      expect(component.formIsValid()).to.be.equal(false)
      component.setState({ phone: '123-123-1234' })
      expect(component.formIsValid()).to.be.equal(true)
    })

    it('submitting petition gives good data', () => {
      // MORE TODO HERE
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()

      component.volunteer({ target: { checked: true } })
      expect(component.state.volunteer).to.be.equal(true)
    })

    it('does not show a optin check box when mobile field isnt filled', () => {
      if (process.env.THEME !== 'giraffe') { return }

      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)

      context.find('input[name="name"]').simulate('change', { target: { value: 'Jane Doe' } })
      expect(context.find('input[name="phone"]').length).to.equal(1)
      expect(context.find('input[name="mobile_optin"]').length).to.equal(0)
    })

    it('shows an optin check box when mobile field has a value', () => {
      if (process.env.THEME !== 'giraffe') { return }

      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)

      context.find('input[name="name"]').simulate('change', { target: { value: 'Jane Doe' } })
      context.find('input[name="phone"]').simulate('change', { target: { value: '216' } })
      expect(context.find('input[name="mobile_optin"]').length).to.equal(1)
    })

    it('sends opt in and revere mobile flow id to api when dynamic_sms_flow is true', () => {
      if (process.env.THEME !== 'giraffe') return
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()

      component.setState({ address1: '123 main', city: 'Pittsburgh', state: 'PA', name: 'John Smith', email: 'hi@example.com', zip: '60024', phone: '2165555555', mobile_optin: true, dynamic_sms_flow: 'fakeflowhash' })
      const osdiSignature = component.getOsdiSignature()

      expect(osdiSignature.person.custom_fields.mobile_optin).to.be.true
      expect(osdiSignature.person.phone_numbers[0]).to.be.equal('2165555555')
      expect(osdiSignature.person.custom_fields.dynamic_sms_flow).to.be.equal('fakeflowhash')
    })

    it('sends opt in to api when mobile_optin is true and phone number is filled', () => {
      if (process.env.THEME !== 'giraffe') { return }

      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store} />)
      const component = unwrapReduxComponent(context).instance()

      component.setState({ address1: '123 main', city: 'Pittsburgh', state: 'PA', name: 'John Smith', email: 'hi@example.com', zip: '60024', phone: '2165555555', mobile_optin: true })

      const osdiSignature = component.getOsdiSignature()

      expect(osdiSignature.person.phone_numbers[0]).to.be.equal('2165555555')
      expect(osdiSignature.person.custom_fields.mobile_optin).to.be.true
    })
  })
  describe('Email validation tests', () => {
    forEach([ // Valid emails
      'foo@example.com',
      'foo.bar@example.com',
      'c\u017Fsaire@example.com',
      'foo@gmail.edu.ca'
    ]).it('valid email %s', goodEmail => {
      expect(isValidEmail(goodEmail)).to.be.equal(true)
    })
    forEach([ // Invalid emails
      'foo@example..com',
      'foo@example.com ',
      'foo@example.com xyz',
      'foo@example.com<',
      'foo@gmau=il.com',
      'foo@gmail.5',
      'foo@gmail',
      'foo@@example',
      'fooexample.com'
    ]).it('invalid email %s', badEmail => {
      expect(isValidEmail(badEmail)).to.be.equal(false)
    })
  })
})
