/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SchemaForm from 'components/SchemaForm';
import ToolBox from 'components/ToolBox';
import Properties from 'components/Properties';
import produce from 'immer';
import { v4 as uuid } from 'uuid';
import { Schema } from './Schema';

function App() {
  const [schema, setSchema] = useState(Schema);

  const findByName = (name, parent) => {
    if (parent.name === name) return parent;
    let result = false;
    if (parent.childs)
      for (let i = 0; i < parent.childs.length; i += 1) {
        const item = parent.childs[i];
        const res = findByName(name, item);
        if (res) {
          result = res;
          break;
        }
      }
    return result;
  };

  const findParentByName = (name, parent) => {
    let result = false;
    if (parent.childs)
      for (let i = 0; i < parent.childs.length; i += 1) {
        const item = parent.childs[i];
        if (item.name === name) return parent;
        const res = findParentByName(name, item);
        if (res) {
          result = res;
          break;
        }
      }
    return result;
  };

  const moveItem = (drag, drop) => {
    console.log(drag, drop);
    const newSchema = produce(schema, draft => {
      const dropParent = findParentByName(drop, draft);
      const dragParent = findParentByName(drag, draft);
      if(dropParent.name===dragParent.name){
        const dragItem = findByName(drag,dragParent);
        const childs = dragParent.childs.filter(item => item.name !== drag);
        dragParent.childs = childs;
        const dropIndex = dragParent.childs.findIndex(item=>item.name===drop);
        dragParent.childs.splice(dropIndex,0,dragItem);
      }
    });
    setSchema(newSchema);
  };

  const updateMoveSchema = (dropTarget, dragItem) => {
    const { name: dropName } = dropTarget;
    const { name: dragName } = dragItem;
    if (dropName === dragName) return;
    const newSchema = produce(schema, draft => {
      const dragParent = findParentByName(dragName, draft);

      const dropItem = findByName(dropName, draft);
      const oldItem = findByName(dragName, dragParent);
      /* delete old */
      const childs = dragParent.childs.filter(
        item => item.name !== oldItem.name,
      );
      dragParent.childs = [...childs];

      /* add new */
      dropItem.childs = dropItem.childs || [];
      dropItem.childs.push(oldItem);
    });

    setSchema(newSchema);
  };

  const updateSchema = (dropTarget, dragItem) => {
    if (dragItem.name) updateMoveSchema(dropTarget, dragItem);
    else {
      const { name } = dropTarget;
      const newSchema = produce(schema, draft => {
        const parent = findByName(name, draft);
        if (parent) {
          parent.childs = parent.childs || [];
          const { type, value, childs=[],properties } = dragItem;
          parent.childs.push({ type, name: uuid(), value, properties,childs });
        }
      });

      setSchema(newSchema);
    }
  };

  const [focusItem, setFocusItem] = useState('');
  const changeFocus = name => {
    setFocusItem(name);
  };

  const updateProperties = (focusItem, props) => {
    const { name } = focusItem;
    const newSchema = produce(schema, draft => {
      const parent = findByName(name, draft);
      if (parent) {
        parent.properties = { ...parent.properties, ...props };
      }
    });

    setSchema(newSchema);
  };

  const deleteFocusItem = focusItem => {
    const { name } = focusItem;
    const newSchema = produce(schema, draft => {
      const parent = findParentByName(name, draft);
      if (parent) {
        const childs = parent.childs.filter(item => item.name !== name);
        parent.childs = [...childs];
      }
    });

    setSchema(newSchema);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ToolBox />
      <SchemaForm
        mainSchema={schema}
        updateSchema={updateSchema}
        changeFocus={changeFocus}
        focusItem={focusItem}
        moveItem={moveItem}
      />
      <Properties
        focusItem={findByName(focusItem, schema)}
        updateProperties={updateProperties}
        deleteFocusItem={deleteFocusItem}
      />
    </DndProvider>
  );
}

export default App;
