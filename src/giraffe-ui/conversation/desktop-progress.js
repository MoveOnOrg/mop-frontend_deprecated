import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const DesktopProgress = ({ getStateValue }) => {
const section = getStateValue('section')
return (
  <div>
    <div className='progress-wrap'>
      <h3>Check your progress!</h3>
      <div className={cx(
          'step', section === 1 ? 'step-active' : '', section > 1 ? 'step-complete' : ''
      )}
      >
        Petition Title
        <span className='checkmark'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none' /><path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' /></svg>
        </span>
      </div>
      <div className={cx(
          'step', section === 2 ? 'step-active' : '', section > 2 ? 'step-complete' : ''
      )}
      >
        Petition Statement
        <span className='checkmark'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none' /><path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' /></svg>
        </span>
      </div>
      <div className={cx(
          'step', section === 3 ? 'step-active' : '', section > 3 ? 'step-complete' : ''
      )}
      >
        Petition Background
        <span className='checkmark'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none' /><path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' /></svg>
        </span>
      </div>
      <div className={cx(
          'step', section === 4 ? 'step-active' : '', section > 4 ? 'step-complete' : ''
      )}
      >
        Decision Maker
        <span className='checkmark'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none' /><path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' /></svg>
        </span>
      </div>
      <div className={cx(
          'step', section === 5 ? 'step-active' : '', section > 5 ? 'step-complete' : ''
      )}
      >
        All Published <span role='img' aria-label='celebrate'>🎉</span>
      </div>
    </div>
  </div>
)
}
DesktopProgress.propTypes = {
  getStateValue: PropTypes.func
}

export default DesktopProgress
