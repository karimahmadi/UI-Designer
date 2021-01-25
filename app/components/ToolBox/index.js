import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import InputLabel from './InputLabel';
import Grid from './Grid';
import GridItem from './GridItem';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background-color: teal;
  padding: 0.5rem 0.5rem;
`;

function ToolBox() {
  return (
    <Container>
      <Grid />
      <GridItem />
      <Input />
      <InputLabel />
    </Container>
  );
}

export default ToolBox;
