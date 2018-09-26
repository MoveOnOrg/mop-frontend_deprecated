import React from 'react'
import PropTypes from 'prop-types'

const ChatEnd = ({ getStateValue }) => (
  <div
    id='chatend'
    style={
      {
        float: 'left',
        clear: 'both',
        display: getStateValue('currentIndex') > 21 ? 'none' : 'block',
        height: '0',
        marginTop: getStateValue('currentIndex') === 20 ? '210px' : '90px',
        transition: 'margin-top .3s ease-in-out 1s',
        width: '100px'
      }
    }
    className='chat-end'
  />
)
ChatEnd.propTypes = {
  getStateValue: PropTypes.func
}

export default ChatEnd
