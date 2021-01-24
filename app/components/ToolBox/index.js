import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import Grid from './Grid';

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background-color: teal;
  padding: 0.5rem 0.5rem;
`;

const Item = styled.div`
  border: 1px solid black;
  margin: 0.5rem 0.5rem;
  text-align: center;
`;

function ToolBox() {
  return (
    <Container>
      <Input />
      <Grid />
    </Container>
  );
}

export default ToolBox;
