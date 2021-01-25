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
import Grid from 'components/Grid';
import produce from 'immer';
import { v4 as uuid } from 'uuid';
import { Schema } from './Schema';

function App() {
  const [schema, setSchema] = useState(Schema);
  const findByName = (name, schema) => {
    if (schema.name === name) return schema;
    schema.childs.forEach(item => {
      const res = findByName(name, item);
      if (res) return res;
    });

    return false;
  };
  const updateSchema = (dropTarget, dragItem) => {
    console.log('dropTarget:', dropTarget);
    console.log('dragItem:', dragItem);
    const { name } = dropTarget;
    const newSchema = produce(schema, draft => {
      const parent = findByName(name, draft);
      if (parent) {
        dragItem.name = uuid();
        parent.childs.push(dragItem);
      }
    });

    setSchema(newSchema);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <ToolBox />
      <SchemaForm mainSchema={schema} updateSchema={updateSchema} />
      {/* <Grid container> */}
      {/* <Grid item xs={6}>test</Grid> */}
      {/* <Grid item xs={6}>test</Grid> */}
      {/* </Grid> */}
    </DndProvider>
  );
}

export default App;
