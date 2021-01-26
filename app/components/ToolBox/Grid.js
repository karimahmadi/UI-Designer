import React from 'react';
import { ItemTypes } from 'components/ItemTypes';
import { useDrag } from 'react-dnd';

function Grid() {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.GRID, properties:{container: true,item:false}, childs:[{type:ItemTypes.GRID,properties:{container:false,item:true,xs:12,sm:12,md:12,lg:12}}] },
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
      grid
    </div>
  );
}

export default Grid;
