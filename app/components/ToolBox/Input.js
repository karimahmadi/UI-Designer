import React from 'react';
import { ItemTypes } from 'components/ItemTypes';
import { useDrag } from 'react-dnd';

function Input() {
  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.INPUT },
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
      input
    </div>
  )
}

export default Input;