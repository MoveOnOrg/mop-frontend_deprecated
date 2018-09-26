import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const Errors = ({
    errors
}) => (
  <div className={cx('convo-error-message', 'red', errors.length ? 'show' : '')}>
    <span>{errors}</span>
  </div>
)


Errors.propTypes = {
    errors: PropTypes.array
}

export default Errors
