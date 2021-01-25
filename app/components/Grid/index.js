import React from 'react';
// import {Grid} from '@tatareact/core/Grid';
import Grid from '@material-ui/core/Grid';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndGrid({ children, name, updateSchema, ...other }) {
  const accept = [ItemTypes.INPUT, ItemTypes.GRID];
  const [{ isOverCurrent }, drop] = useDrop({
    accept,
    drop: (item, monitor) => {
      updateSchema({ name }, monitor.getItem());
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <Grid
      {...other}
      ref={drop}
      style={{
        border: '1px solid red',
        padding: '5px',
        minHeight: '25px',
        backgroundColor: isOverCurrent ? 'yellow' : 'gray',
      }}
    >
      {children}
    </Grid>
  );
}

// React.forwardRef((props, ref) => <Component {...props} forwardedRef={ref} />);
export default DndGrid;
