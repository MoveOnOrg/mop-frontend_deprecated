import React from 'react'
import PropTypes from 'prop-types'

import Config from '../../../config'

import ChatBubble from 'GiraffeUI/conversation/chat-bubble'
import { conversation } from 'GiraffeUI/conversation/conversation'
import ConversationalInput from 'GiraffeUI/conversation/input'
import Tip from './ppp-steps/tip'
import Review from './ppp-steps/review'
import Signup from './ppp-steps/signup'
import DesktopProgress from 'GiraffeUI/conversation/desktop-progress'
import ChatEnd from 'GiraffeUI/conversation/chat-end'
import CreateTargets from '../../../containers/create-targets'
import cx from 'classnames'
import '../../../../css/create.scss'

const CreatePetitionFormConversation = ({
  updateStateFromValue,
  getStateValue,
  toggleOpen,
  onTargetAdd,
  onTargetRemove,
  publish,
  targets,
  targetQuery,
  saveInput,
  toggleEditBubble,
  currentIndex,
  setRef,
  toggleConvoTip
}) => {
  const section = getStateValue('section')
  const progressWidth = `${(section / 5) * 100}%`
  const progressStyles = {
    width: progressWidth
  }
  const convoReviewToggled = getStateValue('convoReviewToggled')
  const bubbles = conversation.map(b => {
    let innerClasses = 'inner'
    let userInput
    if (b.type === 'input') {
      innerClasses = 'inner user-response'
      if (b.input.type === 'email') userInput = getStateValue('email')
      if (b.input.type === 'title') userInput = getStateValue('title')
      if (b.input.type === 'summary') userInput = getStateValue('summary')
      if (b.input.type === 'description') userInput = getStateValue('description')
      if (b.input.type === 'target') userInput = getStateValue('targets')
    }
    if (b.type === 'tip') innerClasses = 'inner bubble-tip'

    return (
      <ChatBubble
        bubble={b}
        key={b.id}
        bubbleId={b.id}
        innerClasses={innerClasses}
        userInput={userInput}
        toggleOpen={toggleOpen}
        updateStateFromValue={updateStateFromValue}
        getStateValue={getStateValue}
        toggleEditBubble={toggleEditBubble}
        targets={targets}
        onTargetRemove={onTargetRemove}
        toggleConvoTip={toggleConvoTip}
      />
    )
  })
  const createTargets = (<CreateTargets
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    onTargetAdd={onTargetAdd}
    onTargetRemove={onTargetRemove}
    targets={targets}
    targetQuery={targetQuery}
    theme='convo'
    saveInput={saveInput}
    currentIndex={currentIndex}
    setRef={setRef}
  />)
  const input = (<ConversationalInput
    saveInput={saveInput}
    updateStateFromValue={updateStateFromValue}
    toggleOpen={toggleOpen}
    getStateValue={getStateValue}
    setRef={setRef}
  />)
  const chatend = (<ChatEnd
    getStateValue={getStateValue}
  />)
  const tips = (<Tip
    toggleOpen={toggleOpen}
    getStateValue={getStateValue}
  />)
  const review = (<Review
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    onTargetAdd={onTargetAdd}
    onTargetRemove={onTargetRemove}
    targets={targets}
    targetQuery={targetQuery}
    theme='convo'
    setRef={setRef}
  />)
  const desktop = (<DesktopProgress
    getStateValue={getStateValue}
  />)
  const signup = (<Signup
    afterSignup={publish}
    getStateValue={getStateValue}
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    type='conversational'
    publish={publish}
  />)
  return (
    <div>
      <div id='conversational-top'>
        <div className='conversational-progress'>
          <span className='progress-bar' style={progressStyles} />
        </div>
        <a href='https://front.moveon.org/'>
          <img className='logo' src={`${Config.STATIC_ROOT}images/logo.svg`} alt='MoveOn Logo' />
        </a>
      </div>
      <div id='conversational'>
        <div id='chat-wrap' className={cx('chat-wrap', !convoReviewToggled ? 'toggled' : '')}>
          {bubbles}
          {createTargets}
          {input}
          {chatend}
        </div>
        {tips}
        <div className={cx('convo-review-wrap', convoReviewToggled ? 'toggled' : '')} >
          {review}
        </div>
        {desktop}
        {signup}
      </div>
    </div>
  )
}

CreatePetitionFormConversation.propTypes = {
  toggleOpen: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  getStateValue: PropTypes.func,
  onTargetAdd: PropTypes.func,
  onTargetRemove: PropTypes.func,
  publish: PropTypes.func,
  saveInput: PropTypes.func,
  toggleEditBubble: PropTypes.func,
  currentIndex: PropTypes.number,
  targets: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string
  ]),
  targetQuery: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  setRef: PropTypes.func,
  toggleConvoTip: PropTypes.func
}

export default CreatePetitionFormConversation
