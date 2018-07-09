import React from 'react'
import PropTypes from 'prop-types'

const Statement = ({ statementOnChange }) => (
  <div>
    <div className='bubble'>That’s a great title! <span role='img' aria-label='thumbs up'>👍</span>
    </div>
    <div className='bubble'>Now for the petition statement, what is the change you want to see? <span role='img' aria-label='chat bubble'>💬</span>
    </div>
    <div className='bubble'>You will get a lot more signers if your message is short and sweet—one or two sentences at most.
    </div>
    <div className='bubble user'>
      <input
        type='text'
        name='title'
        placeholder='Your petition statement'
        onChange={statementOnChange}
        onBlur={statementOnChange}
      />
    </div>
  </div>
)

Statement.propTypes = {
  statementOnChange: PropTypes.func
}

export default Statement
