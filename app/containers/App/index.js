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

  const updateSchema = (dropTarget, dragItem) => {
    const { name } = dropTarget;
    const newSchema = produce(schema, draft => {
      const parent = findByName(name, draft);
      if (parent) {
        parent.childs = parent.childs || [];
        const { type, value, ...properties } = dragItem;
        parent.childs.push({ type, name: uuid(), value, properties });
      }
    });

    console.log('newSchema:', newSchema);
    setSchema(newSchema);
  };

  const [focusItem, setFocusItem] = useState('');
  const changeFocus = name => {
    setFocusItem(name);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ToolBox />
      <SchemaForm
        mainSchema={schema}
        updateSchema={updateSchema}
        changeFocus={changeFocus}
        focusItem={focusItem}
      />
      <Properties focusItem={findByName(focusItem, schema)} />
    </DndProvider>
  );
}

export default App;
