import React from 'react'
import { expect } from 'chai'
import { createMockStore } from 'redux-test-utils'

import { mount } from 'enzyme'

import Thanks from '../../src/containers/thanks'

import outkastPetition from '../../local/api/v1/petitions/outkast.json'

describe('<Thanks />', () => {
  const store = createMockStore({ petitionStore: {} })
  it('renders thanks for petition', () => {
    const context = mount(<Thanks store={store} petition={outkastPetition} />)
    expect(context.text()).to.contain('Thank')
  })
})
