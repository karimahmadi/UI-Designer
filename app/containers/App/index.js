/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from 'react';
import SchemaForm from 'components/SchemaForm';
import produce from 'immer';
import { v4 as uuid } from 'uuid';
import { Schema } from './Schema';
import TreeNode from './TreeNode';

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


  // return (
  //     <SchemaForm
  //       mainSchema={schema}
  //       updateSchema={updateSchema}
  //     />      
  // );

  return (
    <div style={{margin:'10px 10px'}}>
      <TreeNode title='root' />      
    </div>
  );
}

export default App;
