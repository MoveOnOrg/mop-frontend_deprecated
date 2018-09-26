import React from 'react'
import PropTypes from 'prop-types'

import Config from '../../../config'

const Finished = ({
  renderRawLink,
  renderTwitter,
  renderFacebook,
  renderMail,
  renderCopyPaste
}) => (
  <div className='row mx-1 justify-content-center create-finished-wrap'>
    <div className='container-fluid ppp-page-heading bg-off-white'>
      <div className='progress-bar bg-azure' />
      <div className='background'>
        <img alt='background' src={`${Config.STATIC_ROOT}images/ppp-heading-background.svg`} />
      </div>
      <div className='row'>
        <div className='col-12 heading-title-wrap'>
          <h2 className='bg-white'>
              One more step. Share your petition.
          </h2>
        </div>
      </div>
    </div>
    <div className='col-10 col-md-7 petition-thanks__container'>
      <div className='petition-thanks__content'>
        <p>
            Getting to <b>10 signatures makes your petition visible</b> to the MoveOn.org community.
        </p>
        <p>
          <strong>Share</strong>
        </p>

        <div className='petition-thanks__cta-group'>
          {renderMail()}
          {renderFacebook()}
        </div>

        <p>Or copy and paste the text below into a message:</p>

        {renderCopyPaste()}

        <div className='petition-thanks__links'>
          {renderTwitter()}
          {renderRawLink()}
        </div>

        <div className='skip-wrap'>
          <a href='https://petitions.moveon.org/dashboard.html'>Skip sharing - take me to my dashboard</a>
        </div>
      </div>
    </div>
  </div>
)

Finished.propTypes = {
  renderTwitter: PropTypes.func,
  renderFacebook: PropTypes.func,
  renderMail: PropTypes.func,
  renderCopyPaste: PropTypes.func,
  renderRawLink: PropTypes.func
}

export default Finished
