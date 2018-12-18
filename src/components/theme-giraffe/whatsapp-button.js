import React from 'react'
import PropTypes from 'prop-types'

import { withWhatsApp } from '../../containers/hoc-whatsapp'
import TwitterSvg from 'GiraffeUI/svgs/twitter.svg'

const WhatsAppButton = ({ onClick }) => (
  <a className='mo-btn petition-thanks__link' onClick={onClick}>
    <TwitterSvg />
    WhatsApp
  </a>
)

WhatsAppButton.propTypes = {
  onClick: PropTypes.func
}

export default withWhatsApp(WhatsAppButton)
