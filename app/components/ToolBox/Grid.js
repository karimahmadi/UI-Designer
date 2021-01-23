import React from 'react';
import { ItemTypes } from 'components/ItemTypes';
import { useDrag } from 'react-dnd';

function Grid() {
  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.GRID },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      grid
    </div>
  )
}

export default Grid;