import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndForm({ children, name, updateSchema, ...other }) {
  const accept = [ItemTypes.INPUT, ItemTypes.GRID];
  const [{ isOverCurrent, connectDropTarget }, drop] = useDrop({
    accept,
    drop: (item, monitor) => {
      updateSchema({ name }, monitor.getItem());
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      {...other}
      ref={drop}
      style={{
        border: '1px solid red',
        padding: '5px',
        position: 'absolute',
        left: '0',
        right: '100px',
        top: '0',
        bottom: '0',
        backgroundColor: isOverCurrent ? 'yellow' : 'gray',
      }}
    >
      {children}
    </div>
  );
}

export default DndForm;
