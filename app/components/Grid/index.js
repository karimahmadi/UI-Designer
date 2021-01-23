import React from 'react';
//import {Grid} from '@tatareact/core/Grid';
import Grid from '@material-ui/core/Grid';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndGrid({children,item,container,...other}){
    let accept=[];
    if(container)
      accept=ItemTypes.GRID
    else
      accept=ItemTypes.INPUT
    const [{ isOver }, drop] = useDrop({
        accept: accept,
        drop: (item,monitor) => {
          console.log('monitor:',monitor);
          return monitor.didDrop()?console.log('drop done before'):console.log('drop item:',item);
        },
        collect: monitor => { 
          console.log('collect monitor:',monitor);
          return({
            isOver: !!monitor.isOver(),
          });
      },
      });

    return (
        <Grid {...other} ref={drop} style={{border:'1px solid red',padding:'0',backgroundColor:isOver ? 'yellow' : 'transparent'}}>{children}</Grid>
    );
}

//React.forwardRef((props, ref) => <Component {...props} forwardedRef={ref} />);
export default DndGrid;