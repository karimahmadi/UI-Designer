/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Section } from '@tatareact/core/Section';
import { Grid } from '@tatareact/core/Grid';
import { v4 as uuid } from 'uuid';

function SchemaForm({ schema }) {
  const mapper = {
    section: Section,
    grid: Grid,
  };

  return (
    schema.childs &&
    schema.childs.map(item => {
      console.log('item.type:', item.type);
      const Field = mapper[item.type];
      console.log('Field:', Field);
      if (!Field) {
        return null;
      }
      return (
        <Field key={uuid()} {...item.properties}>
          {SchemaForm({ schema: item })}
        </Field>
      );
    })
  );
}
function App() {
  const schema = {
    childs: [
      {
        type: 'section',
        properties: {
          title: 'عنوان',
        },
        childs: [
          {
            type: 'grid',
            properties: {
              container: true,
            },
          },
        ],
      },
    ],
  };
  return (
    <div>
      <SchemaForm schema={schema} />
    </div>
  );
}

export default App;
