import React from 'react';
import { ItemTypes } from 'components/ItemTypes';
import { useDrag } from 'react-dnd';

function InputLabel() {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.TEXT, value: 'Label' },
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
      InputLabel
    </div>
  );
}

export default InputLabel;
