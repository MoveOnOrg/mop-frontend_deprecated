import React from 'react'
import PropTypes from 'prop-types'

import About from './form/instructions/about'
import Statement from './form/instructions/statement'
import TargetCustom from './form/instructions/target-custom'
import TargetNational from './form/instructions/target-national'
import TargetState from './form/instructions/target-state'
import Title from './form/instructions/title'
import CustomTargetSelect from './form/target-select/custom'
import NationalTargetSelect from './form/target-select/national'
import StateTargetSelect from './form/target-select/state'

const instructionsByField = {
  title: <Title />,
  statement: <Statement />,
  'target-national': <TargetNational />,
  'target-state': <TargetState />,
  'target-custom': <TargetCustom />,
  about: <About />
}

const CreatePetitionForm = ({
  selected,
  setSelected,
  nationalOpen,
  stateOpen,
  customOpen,
  instructionStyle,
  setRef,
  toggleOpen
}) => {
  const instructions = instructionsByField[selected]

  const national = !nationalOpen ? '' : <NationalTargetSelect />
  const state = !stateOpen ? '' : <StateTargetSelect />
  const custom = !customOpen ? '' : <CustomTargetSelect />

  return (
    <div id='conversational'>
      <div className='chat-wrap'>
        <div className='bubble'>Hi 👋 Want to start a petition? That’s great! Petitions like yours are one of the most powerful ways to get support for an issue or topic.
        </div>
        <div className='bubble'>
          <div className='loading'>
            <div className='dot one'></div>
            <div className='dot two'></div>
            <div className='dot three'></div>
          </div>
        </div><br/>
        <div className='bubble user'>
          <div className='text wrapper' id='text_statement_wrapper'>
            <textarea
              className='span6 '
              name='text_statement'
              placeholder='What&rsquo;s the text of your petition? (Try to keep it to 1-2 sentences.)'
              id='text_statement_field'
              title='Text of your Petition'
              onClick={setSelected('statement')}
              ref={setRef('statementInput')}
            />
          </div>
        </div>
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    </div>
  )
}

CreatePetitionForm.propTypes = {
  selected: PropTypes.string,
  setSelected: PropTypes.func,
  nationalOpen: PropTypes.bool,
  stateOpen: PropTypes.bool,
  customOpen: PropTypes.bool,
  instructionStyle: PropTypes.object,
  setRef: PropTypes.func,
  toggleOpen: PropTypes.func
}

export default CreatePetitionForm
