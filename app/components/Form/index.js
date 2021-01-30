import React,{useState,useEffect} from 'react';

function DndForm({ children, name, updateSchema,  ...other }) {
  
  const handleClick = e => {
    e.stopPropagation();
  };

  return (
    <div
      {...other}
      style={{
        border:  '1px solid black',
        padding: '5px',
        position: 'absolute',
        left: '0',
        right: '150px',
        top: '0',
        bottom: '0',
        backgroundColor: 'lightgray',
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default DndForm;
