import React, { useState, useEffect, useRef } from 'react';
// import {Grid} from '@tatareact/core/Grid';
import Grid from '@material-ui/core/Grid';
import {Resizable} from 'react-resizable'; 

function DndGrid({
  children,
  name,
  container,
  item,    
  updateSchema,
  ...other
}) {
  
  const [hover,setHover]=useState(false);

  const handleClick = e => {
    e.stopPropagation();

  };

  const handleMouseOver = e => {
    e.stopPropagation();
    e.preventDefault();
    setHover(true);
  };
  const handleMouseOut = e => {
    e.stopPropagation();
    e.preventDefault();
    setHover(false);
  };
  const renderGrid = () => {
    return (
      <Grid
      container={container}
      {...other}
      style={{
        border:  '1px solid black',
        padding: '5px',
        minHeight: '25px',
        backgroundColor: !hover?'lightgray':'yellow',
      }}      
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </Grid>
    );
  };

  if(item)
  return 
    <Resizable height={20} width={500} >
           <Grid
      container={container}
      {...other}
      style={{
        border:  '1px solid black',
        padding: '5px',
        minHeight: '25px',
        backgroundColor: !hover?'lightgray':'yellow',
      }}      
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </Grid>
    </Resizable>;

  return       <Grid
  container={container}
  {...other}
  style={{
    border:  '1px solid black',
    padding: '5px',
    minHeight: '25px',
    backgroundColor: !hover?'lightgray':'yellow',
  }}      
  onClick={handleClick}
  onMouseOver={handleMouseOver}
  onMouseOut={handleMouseOut}
>
  {children}
</Grid>;
}

export default DndGrid;
