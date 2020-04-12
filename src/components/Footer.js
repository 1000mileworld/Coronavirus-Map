import React from 'react';

import Container from 'components/Container';

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>&copy; { new Date().getFullYear() } by Joe Liang - <a href="https://1000mileworld.com" target="_blank">1000 Mile World</a></p>
      </Container>
    </footer>
  );
};

export default Footer;
