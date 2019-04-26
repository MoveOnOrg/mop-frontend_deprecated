import React from 'react'
import PropTypes from 'prop-types'

import { withWhatsApp } from '../../containers/hoc-whatsapp'
import WhatsAppSvg from 'GiraffeUI/svgs/whatsapp.svg'
import { addBrandedColorClass } from '../../lib'

const WhatsAppLink = ({ onClick, cohort }) => (
  <a className={'mo-btn petition-thanks__link d-none d-lg-inline-flex ' + addBrandedColorClass('whatsapp', cohort)} onClick={onClick}>
    <WhatsAppSvg />
    WhatsApp
  </a>
)

WhatsAppLink.propTypes = {
  onClick: PropTypes.func
}

export default withWhatsApp(WhatsAppLink)
