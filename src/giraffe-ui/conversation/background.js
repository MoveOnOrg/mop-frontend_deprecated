import React from 'react'
import PropTypes from 'prop-types'

const Background = ({ backgroundOnChange }) => (
  <div>
    <div className='bubble'>
      Great. Why are you starting this petition?
    </div>
    <div className='bubble'>
      Adding a paragraph or two about this issue and why it matters to you goes a long way. <span role='img' aria-label='writing'>✍️</span>
    </div>
    <div className='bubble user'>
      <input
        type='text'
        name='background'
        placeholder='Your petition background'
        onChange={backgroundOnChange}
        onBlur={backgroundOnChange}
      />
    </div>
  </div>
)

Background.propTypes = {
  backgroundOnChange: PropTypes.func
}

export default Background
