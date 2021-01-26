import React, { useState, useEffect, useRef } from 'react';
// import {Grid} from '@tatareact/core/Grid';
import Grid from '@material-ui/core/Grid';
import { useDrop, useDrag } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndGrid({
  children,
  name,
  container,
  item,
  focusItem,
  changeFocus,
  updateSchema,
  moveItem,
  ...other
}) {
  const ref = useRef(null);
  const accept = [ItemTypes.GRID];
  if (item) {
    [ItemTypes.INPUT, ItemTypes.TEXT].forEach(it => accept.push(it));
  }

  const [{ isOverCurrent }, drop] = useDrop({
    accept,
    hover: (item, monitor) => {
      // if (!ref.current) {
      //   return;
      // }
      // const dragName = item.name;
      // const hoverName = name;
      // // Don't replace items with themselves
      // if (dragName === hoverName) {
      //   return;
      // }
      // // Determine rectangle on screen
      // const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // // Get vertical middle
      // const hoverMiddleY =
      //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset();
      // // Get pixels to the top
      // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%
      //
      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return;
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return;
      // }

      // Time to actually perform the action
      moveItem(dragName, hoverName);
    },
    drop: (item, monitor) => {
      updateSchema({ name }, monitor.getItem());
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.GRID, children, container, item, name, ...other },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const [focus, setFocus] = useState(focusItem === name);

  useEffect(() => {
    setFocus(focusItem === name);
  }, [focusItem]);

  const handleFocus = () => {
    console.log('Focus');
  };
  const handleClick = e => {
    e.stopPropagation();
    setFocus(true);
    changeFocus(name);
  };
  return (
    <Grid
      container={container}
      {...other}
      ref={ref}
      style={{
        border: !focus ? '1px solid black' : '2px dashed red',
        padding: '5px',
        minHeight: '25px',
        backgroundColor: isOverCurrent ? 'yellow' : 'lightgray',
        opacity: isDragging ? 0 : 1,
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
