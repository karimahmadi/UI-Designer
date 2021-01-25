import React from 'react';
import styled from 'styled-components';
import GridProperties from '../Grid/GridProperties';

const Container = styled.div`
  direction: ltr;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background-color: teal;
  padding: 0.5rem 0.5rem;
`;

function Properties({ focusItem }) {
  switch (focusItem.type) {
    case 'grid':
      return (
        <Container>
          <GridProperties {...focusItem.properties} />
        </Container>
      );
    default:
      return <div />;
  }
}

export default Properties;
