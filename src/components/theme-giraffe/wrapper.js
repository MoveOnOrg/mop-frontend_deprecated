import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import Nav from '../../containers/nav'
import Footer from 'Theme/footer'

const Wrapper = ({
  children,
  organization,
  minimalNav,
  hideNav,
  hideFooter,
  offWhiteBg,
  entity
}) => (
  <div className='giraffe'>
    <div
      id='giraffe-wrapper'
      className={cx('giraffe', 'petition', {
        'bg-off-white': offWhiteBg,
        'pt-0': hideNav
      })}
    >
      {!hideNav && (
        <Nav organization={organization} minimal={minimalNav} entity={entity} />
      )}
      <main id='content'>{children}</main>
      {!hideFooter && <Footer entity={entity} />}
    </div>
  </div>
)

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  organization: PropTypes.string,
  minimalNav: PropTypes.bool,
  hideNav: PropTypes.bool,
  hideFooter: PropTypes.bool,
  offWhiteBg: PropTypes.bool,
  entity: PropTypes.string
}

export default Wrapper
