import React from 'react'
import PropTypes from 'prop-types'
import { tips } from './tips-data'
import Lightbulb from '../../../../giraffe-ui/svgs/lightbulb.svg'

const Tip = ({
    toggleOpen,
    getStateValue
}) => {
    const createType = getStateValue('createType')
    let currentTip
    if (createType === 'chat') {
      if (getStateValue('currentTip') === 0) currentTip = tips[0]
      if (getStateValue('currentTip') > 0) currentTip = tips[getStateValue('currentTip') - 1]
    } else {
      currentTip = tips[getStateValue('step') - 1]
    }

    const description = currentTip.description.map((paragraph, index) => {
      const key = index
      return <p key={key}>{paragraph}</p>
    })
    const examples = currentTip.examples.map((example, index) => {
      const key = index
      const paragraphs = example.map((paragraph, subIndex) => {
        const subKey = subIndex
        return <p key={subKey}>{paragraph}</p>
      })
      return (
        <div className='example col-12' key={key}>
          <h3 className='bg-azure'>Example #{index + 1}</h3>
          {paragraphs}
        </div>)
    })

    const classes = getStateValue('tipModalToggled') ? 'tip-modal container bg-white toggled' : 'tip-modal container bg-white'

    return (
      <div className={classes}>
        <div className='close' onClick={toggleOpen('tipModalToggled')}>
          <span className='bg-azure' />
          <span className='bg-azure' />
        </div>
        <div className='row heading'>
          <div className='col-12'>
            <span className='bg-azure'><Lightbulb /></span>
            <h2>{currentTip.title}</h2>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            {description}
          </div>
          {examples}
        </div>
      </div>
    )
}

Tip.propTypes = {
    toggleOpen: PropTypes.func,
    getStateValue: PropTypes.func
}

export default Tip
