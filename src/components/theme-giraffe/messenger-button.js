import React from 'react'
import PropTypes from 'prop-types'

import { withMessenger } from '../../containers/hoc-messenger'
import MessengerSvg from 'GiraffeUI/svgs/messenger.svg'

const MessengerButton = ({ onClick }) => (
  <a className='mo-btn petition-thanks__link' onClick={onClick}>
    <MessengerSvg />
    Messenger
  </a>
)

MessengerButton.propTypes = {
  onClick: PropTypes.func
}

export default withMessenger(MessengerButton)
