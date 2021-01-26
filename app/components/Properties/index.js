import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@tatareact/core/Button';
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

const ApplyButton = styled(Button)`
  position: absolute !important;
  bottom: 0;
  right: 0;
  padding: 0 !important;
  margin: 5px !important;
`;

const DeleteButton = styled(Button)`
  position: absolute !important;
  bottom: 0;
  left: 0;
  padding: 0 !important;
  margin: 5px !important;
  background-color: red !important;
`;

function Properties({ focusItem, updateProperties,deleteFocusItem }) {
  const [props, setProps] = useState({ ...focusItem.properties });
  const handleApplyClick = () => {
    updateProperties(focusItem, props);
  };

  const handleChange = props => {
    setProps({ ...props });
  };

  const handleDeleteClick = () => {
    deleteFocusItem(focusItem);
  };

  switch (focusItem.type) {
    case 'grid':
      return (
        <Container>
          <GridProperties focusItem={focusItem} onChange={handleChange} />
          <ApplyButton onClick={handleApplyClick}>Apply</ApplyButton>
          <DeleteButton onClick={handleDeleteClick}>Delete</DeleteButton>
        </Container>
      );
    default:
      return <div />;
  }
}

export default Properties;
