import React from 'react'
import PropTypes from 'prop-types'

import { withTwitter } from '../../containers/hoc-twitter'
import TwitterSvg from 'GiraffeUI/svgs/twitter.svg'

const MessengerButton = ({ onClick }) => (
  <a className='mo-btn petition-thanks__link' onClick={onClick}>
    <TwitterSvg />
    Twitter
  </a>
)

MessengerButton.propTypes = {
  onClick: PropTypes.func
}

export default withMessenger(MessengerButton)
