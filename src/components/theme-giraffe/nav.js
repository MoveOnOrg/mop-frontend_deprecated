import React from 'react'
import PropTypes from 'prop-types'

import Logo from 'GiraffeUI/logo'
import { Primary, Secondary, NavLink, Header, MoNav } from 'GiraffeUI/nav'

import DocumentSvg from 'GiraffeUI/svgs/document-add.svg'

const Nav = ({
  toggleOpen,
  close,
  isOpenMobile,
  openSections,
  toggleSection
}) => (
  <Header toggleOpen={toggleOpen}>
    <Logo />
    <MoNav isOpenMobile={isOpenMobile} close={close}>
      <Primary openSections={openSections} toggleSection={toggleSection}>
        <Primary.Section name='Petitions'>
          <NavLink to='/'>Browse Petitions</NavLink>
          <NavLink to='/create_start.html?source=topnav'>
            Start A Petition
          </NavLink>
        </Primary.Section>

        <Primary.Section name='Campaigns'>
          <NavLink to='https://moveon.org/browse-campaigns'>
            Browse Campaigns
          </NavLink>
          <NavLink to='https://moveon.org/campaign-tips'>Campaign Tips</NavLink>
          <NavLink to='https://moveon.org/our-impact'>Our Impact</NavLink>
        </Primary.Section>

        {/* More Top level */}
        <NavLink to='https://moveon.org/events'>Events</NavLink>
        <NavLink to='https://front.moveon.org/about'>About Us</NavLink>
      </Primary>
      <Secondary>
        <Secondary.Top>
          <NavLink to='https://front.moveon.org/blog'>News</NavLink>
          <NavLink to='https://store.moveon.org'>Store</NavLink>
        </Secondary.Top>
        <Secondary.Bottom>
          <NavLink to='https://front.moveon.org/#join'>Join</NavLink>
          <NavLink to='https://act.moveon.org/donate/civ-donation?utm_source=petitions_nav&source=petitions_nav'>
            Donate
          </NavLink>
          <NavLink to='/create_start.html?source=topnav'>
            <DocumentSvg />Start A Petition
          </NavLink>
        </Secondary.Bottom>
      </Secondary>
    </MoNav>
  </Header>
)

Nav.propTypes = {
  user: PropTypes.object,
  nav: PropTypes.object,
  organization: PropTypes.string,
  minimal: PropTypes.bool,
  toggleOpen: PropTypes.func,
  close: PropTypes.func,
  isOpenMobile: PropTypes.bool,
  openSections: PropTypes.arrayOf(PropTypes.string),
  toggleSection: PropTypes.func
}

export default Nav
