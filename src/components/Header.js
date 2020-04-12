import React from 'react';
//import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <h1>Worldwide Cases for COVID-19 by Country</h1>
      
        {/* <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2/">Page 2</Link>
          </li>
        </ul> */}
        
      </Container>
    </header>
  );
};

export default Header;
