import React from 'react';
import { ItemTypes } from 'components/ItemTypes';
import { useDrag } from 'react-dnd';

function GridItem() {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.GRIDITEM, item: true, xs: 2 },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 18,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      grid Item
    </div>
  );
}

export default GridItem;
