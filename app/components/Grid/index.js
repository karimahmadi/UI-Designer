import React, { useState, useEffect } from 'react';
// import {Grid} from '@tatareact/core/Grid';
import Grid from '@material-ui/core/Grid';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndGrid({
  children,
  name,
  container,
  focusItem,
  changeFocus,
  updateSchema,
  ...other
}) {
  let accept = [ItemTypes.INPUT, ItemTypes.TEXT];
  if (container) accept = [ItemTypes.GRIDITEM, ItemTypes.GRID];
  const [{ isOverCurrent }, drop] = useDrop({
    accept,
    drop: (item, monitor) => {
      updateSchema({ name }, monitor.getItem());
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const [focus, setFocus] = useState(focusItem === name);

  useEffect(() => {
    setFocus(focusItem === name);
  }, [focusItem]);

  const handleFocus = () => {
    console.log('Focus');
  };
  const handleClick = e => {
    e.stopPropagation();
    console.log('Click');
    setFocus(true);
    changeFocus(name);
  };
  return (
    <Grid
      container={container}
      {...other}
      ref={drop}
      style={{
        border: !focus ? '1px solid black' : '2px dashed red',
        padding: '5px',
        minHeight: '25px',
        backgroundColor: isOverCurrent ? 'yellow' : 'lightgray',
      }}
      onFocus={handleFocus}
      onClick={handleClick}
    >
      {children}
    </Grid>
  );
}

// React.forwardRef((props, ref) => <Component {...props} forwardedRef={ref} />);
export default DndGrid;
