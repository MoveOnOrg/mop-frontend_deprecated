import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { InputMaterial } from 'GiraffeUI/input-material'

const ReviewTargets = ({
    renderTargets,
    renderSelectedTargets,
    renderCustomTarget,
    targetQuery,
    updateQuery,
    load,
    filteredTargets,
    loadMoreTargets,
    setRef
}) => {
    const loadMoreButton = (
      <div className='col-12'>
        <button type='button' className='xl300 center display-block btn bg-gray' name='load-more' id='review-load-more' onClick={loadMoreTargets}>Show More Suggestions</button>
      </div>
    )
    return (
      <div className='review-targets targets'>
        <div className='selection-pills'>
          <div className='row'>
            {renderSelectedTargets()}
          </div>
        </div>
        <div className='review-targets-search-wrap'>
          <InputMaterial
            name='reviewTarget'
            type='search'
            className='bg-ice-blue'
            label='Search a specific target'
            id='review-target-query'
            stateRef={targetQuery}
            onChange={updateQuery}
            setRef={setRef}
          />
          <div className={cx('col-12', 'targets-dropdown', 'bg-azure', targetQuery ? 'toggled' : '')}>
            {renderTargets()}
            {load < filteredTargets.length ? loadMoreButton : ''}
            <div className='col-12'>
              {renderCustomTarget()}
            </div>
          </div>
        </div>
      </div>
    )
}

ReviewTargets.propTypes = {
    renderTargets: PropTypes.func,
    renderSelectedTargets: PropTypes.func,
    targetQuery: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    updateQuery: PropTypes.func,
    load: PropTypes.number,
    filteredTargets: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array
    ]),
    loadMoreTargets: PropTypes.func,
    setRef: PropTypes.func,
    renderCustomTarget: PropTypes.func
}

export default ReviewTargets
