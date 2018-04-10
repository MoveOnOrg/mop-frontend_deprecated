import React from 'react'
import PropTypes from 'prop-types'
import Scrollchor from 'react-scrollchor'
import Waypoint from 'react-waypoint'

import { text2paraJsx, splitIntoSpansJsx } from '../../lib'

import {
  PetitionCard,
  Details,
  Container,
  SignColumn,
  InfoColumn,
  MobileSign,
  FloatingSignButton
} from 'GiraffeUI/petition'
import PetitionMessage from 'Theme/petition-message'

import { Share } from './petition-share'
import SignatureAddForm from '../../containers/signature-add-form'
import SignatureList from '../../containers/signature-list'

const Petition = ({
  petition: p,
  query,
  user,
  adminLink,
  petitionBy,
  outOfDate,
  isFloatingSignVisible,
  onClickFloatingSign,
  hideFloatingSign,
  showFloatingSign,
  setRef
}) => (
  <Container>
    <PetitionMessage outOfDate={outOfDate} petition={p} isFwd={query.fwd} />
    <InfoColumn>
      <PetitionCard
        heading={splitIntoSpansJsx(p.title)}
        currentSignatures={p.total_signatures}
        goalSignatures={p.signature_goal}
        renderShare={<Share className='petition-card' user={user} petition={p} />}
        renderSignersButton={({ className, CaretRight }) => (
          <Scrollchor
            className={className}
            to='#comments'
            animate={{ offset: -150 }}
          >
            MOST RECENT SIGNERS <CaretRight />
          </Scrollchor>
        )}
      >
        <p>To be delivered to {p.target.map(t => t.name).join(', ')}</p>

        {adminLink && (
          <a style={{ position: 'absolute', top: 10, right: 10 }} href={adminLink}>
            zoom &#x270e;
          </a>
        )}

        {p.featured_image_url && <PetitionCard.Media imageUrl={p.featured_image_url} />}

        {p.summary && (
          <PetitionCard.Description>
            {text2paraJsx(p.summary)}
          </PetitionCard.Description>
        )}
      </PetitionCard>

      <MobileSign>
        <Waypoint onEnter={hideFloatingSign} onLeave={showFloatingSign} topOffset='57px'>
          <SignatureAddForm
            setRef={setRef({ isMobile: true })}
            petition={p}
            query={query}
          />
        </Waypoint>
      </MobileSign>

      <Details>
        <Details.Narrative heading='Background'>
          <div dangerouslySetInnerHTML={{ __html: p.description }} />
        </Details.Narrative>

        <Details.Comments heading='Most Recent Signers'>
          <SignatureList petition={p} signatureCount={p.total_signatures} />
        </Details.Comments>

        <Details.Author
          name={petitionBy}
          link={`/contact_creator.html?petition_id=${p.petition_id}`}
        />
        <Share className='petition-details' hasLabels user={user} petition={p} />
        <Details.Disclaimer />
      </Details>
    </InfoColumn>
    <SignColumn>
      <Waypoint onEnter={hideFloatingSign} onLeave={showFloatingSign} topOffset='120px'>
        <SignatureAddForm
          setRef={setRef({ isMobile: false })}
          petition={p}
          query={query}
        />
      </Waypoint>
    </SignColumn>

    <FloatingSignButton
      onClick={onClickFloatingSign}
      visible={isFloatingSignVisible}
    />
  </Container>
)

Petition.propTypes = {
  petition: PropTypes.object.isRequired,
  user: PropTypes.object,
  adminLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  query: PropTypes.object,
  petitionBy: PropTypes.string,
  outOfDate: PropTypes.string,
  setRef: PropTypes.func,
  onClickFloatingSign: PropTypes.func,
  isFloatingSignVisible: PropTypes.bool,
  hideFloatingSign: PropTypes.func,
  showFloatingSign: PropTypes.func
}

export default Petition
