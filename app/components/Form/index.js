import React,{useState,useEffect} from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function DndForm({ children, name, updateSchema,focusItem,changeFocus,  ...other }) {
  const accept = [ItemTypes.GRID];
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

  const handleClick = e => {
    e.stopPropagation();
    setFocus(true);
    changeFocus(name);
  };

  return (
    <div
      {...other}
      ref={drop}
      style={{
        border: !focus ? '1px solid black' : '2px dashed red',
        padding: '5px',
        position: 'absolute',
        left: '0',
        right: '150px',
        top: '0',
        bottom: '0',
        backgroundColor: isOverCurrent ? 'yellow' : 'lightgray',
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default DndForm;
