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
import { Schema } from './Schema';

function App() {
  const [schema, setSchema] = useState(Schema);
  const updateSchema = (x,y) => {
    console.log('updateSchema x:', x);
    console.log('updateSchema y:', y);
    // schema.childs.push(item);
    // setSchema({ ...schema });
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
