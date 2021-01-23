/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import SchemaForm from 'components/SchemaForm';
import {Schema} from './Schema';
import ToolBox from 'components/ToolBox';
import Grid from 'components/Grid';


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ToolBox/>            
      {/* <SchemaForm schema={Schema} /> */}
      <Grid container>
        <Grid item xs={6}>test</Grid>
        <Grid item xs={6}>test</Grid>
      </Grid>
    </DndProvider>
  );
}

export default App;
