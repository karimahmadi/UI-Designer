import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import InputLabel from './InputLabel';
import Grid from './Grid';

const Container = styled.div`
  direction:ltr;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 150px;
  background-color: teal;
  padding: 0.5rem 0.5rem;
`;

function ToolBox() {
  return (
    <Container>
      <Grid />
      <Input />
      <InputLabel />
    </Container>
  );
}

export default ToolBox;
