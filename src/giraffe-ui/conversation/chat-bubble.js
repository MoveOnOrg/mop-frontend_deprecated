import React from 'react'
import PropTypes from 'prop-types'
import Edit from 'GiraffeUI/svgs/edit.svg'
import Lightbulb from 'GiraffeUI/svgs/lightbulb.svg'
import CloseIcon from 'GiraffeUI/svgs/close.svg'
import { InputMaterial } from 'GiraffeUI/input-material'
import cx from 'classnames'

const ChatBubble = ({
    bubble,
    bubbleId,
    innerClasses,
    userInput,
    toggleOpen,
    updateStateFromValue,
    getStateValue,
    toggleEditBubble,
    targets,
    onTargetRemove
}) => {
    // Object.prototype.hasOwnProperty.call(foo, "bar");
    const hasInput = Object.prototype.hasOwnProperty.call(bubble, 'input')
    const inputType = hasInput ? bubble.input.type : ''
    const inputPlaceholder = hasInput ? bubble.content : ''
    const charLimit = hasInput ? bubble.input.charLimit : ''

    const staticBubble = (
      <div className={innerClasses}>{bubble.content}</div>
    )

    let targetBubbles = []
    if (inputType === 'target') {
        if (!targets.length) return null
        targetBubbles = targets.map(target => (
          <div className={innerClasses} key={target.value}>
            {target.label}
            <span className='close bubble-fab bg-azure' onClick={onTargetRemove(target)}>
              <CloseIcon />
            </span>
          </div>
            ))
    }

    let interactBubble = null

    if (getStateValue('bubbleEdit') === inputType) {
        interactBubble = (
          <div className={cx(innerClasses, 'editing')}>
            <InputMaterial
              name={inputType}
              type='textarea'
              className={cx('bg-white user-input', charLimit > 0 ? 'has-helper-text' : '')}
              label={inputPlaceholder}
              charLimit={charLimit}
              stateRef={userInput}
              onChange={updateStateFromValue(inputType)}
              onBlur={updateStateFromValue(inputType)}
              id='user-input'
              value={userInput}
              onKeyPress={event => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            const s = toggleEditBubble(inputType)
                            s()
                        }
                    }}
            />
            <a className='bubble-submit' onClick={toggleEditBubble(inputType)}>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
                <path d='M0 0h24v24H0z' fill='none' />
              </svg>
            </a>
          </div>
        )
    } else if (inputType === 'target') {
            interactBubble = (
              <div>
                {targetBubbles}
              </div>
            )
        } else {
            interactBubble = (
              <div className={innerClasses}>
                {bubble.type === 'input' ? userInput : bubble.content}
                {bubble.type === 'input' ? <span onClick={toggleEditBubble(inputType)} className='bubble-fab'><Edit /></span> : <span onClick={toggleOpen('tipModalToggled', bubble.tipID)} className='bubble-fab'><Lightbulb /></span>}
              </div>
            )
        }
    const bubbleOutput = bubble.type === 'input' || bubble.type === 'tip' ? interactBubble : staticBubble
    const classes = getStateValue('currentIndex') >= (bubbleId + 1) || (inputType === 'target') ? 'bubble show' : 'bubble'

    return (
      <div className={classes}>
        {bubbleOutput}
      </div>
    )
}

ChatBubble.propTypes = {
    toggleOpen: PropTypes.func,
    bubble: PropTypes.object,
    bubbleId: PropTypes.number,
    innerClasses: PropTypes.string,
    userInput: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    updateStateFromValue: PropTypes.func,
    getStateValue: PropTypes.func,
    toggleEditBubble: PropTypes.func,
    targets: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array
    ]),
    onTargetRemove: PropTypes.func
}

export default ChatBubble