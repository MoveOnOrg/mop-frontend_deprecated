import React from 'react'
import PropTypes from 'prop-types'
import { InputMaterial } from 'GiraffeUI/input-material'
import cx from 'classnames'

const ConvoTargets = ({
renderTargets,
getStateValue,
loadMoreTargets,
filteredTargets,
load,
updateQuery,
renderCustomTarget,
saveInput,
currentIndex,
setRef
}) => {
const loadMoreButton = (
  <div className='col-12'>
    <button type='button' className='xl300 center display-block btn bg-gray' name='load-more' id='load-more' onClick={loadMoreTargets}>Show More Suggestions</button>
  </div>
)

return (
  <div className={cx('targets container bg-azure', currentIndex >= 18 && currentIndex <= 20 ? 'toggled' : '')}>
    <div className='row'>
      <div className={cx('targets-list', currentIndex === 20 ? 'toggled' : '')}>
        {renderTargets()}
        {load < filteredTargets.length ? loadMoreButton : ''}
        {renderCustomTarget()}
      </div>
      <div className='search-wrap'>
        <InputMaterial
          name='target'
          type='search'
          className='bg-white'
          label='Search a specific target'
          stateRef={getStateValue('targetQuery')}
          onChange={updateQuery}
          setRef={setRef}
        />
        <button className='center display-block bg-white azure' onClick={saveInput('target')}>DONE</button>
      </div>
    </div>
  </div>
)
}

ConvoTargets.propTypes = {
  renderTargets: PropTypes.func,
  getStateValue: PropTypes.func,
  loadMoreTargets: PropTypes.func,
  filteredTargets: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool
  ]),
  load: PropTypes.number,
  updateQuery: PropTypes.func,
  renderCustomTarget: PropTypes.func,
  saveInput: PropTypes.func,
  currentIndex: PropTypes.number,
  setRef: PropTypes.func
}

export default ConvoTargets
