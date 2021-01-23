
import React from 'react';
import { Section } from '@tatareact/core/Section';
import Grid from 'components/Grid';
import { Input } from '@tatareact/core/Input';
import { InputLabel } from '@tatareact/core/InputLabel';
import { v4 as uuid } from 'uuid';

function SchemaForm({ schema }) {
    const mapper = {
      section: Section,
      grid: Grid,
      input:Input,
      inputLabel:InputLabel,    
    };

 
    return (
      schema.childs &&
      schema.childs.map(item => {
        if(item.type==='text') return item.value;
        const Field = mapper[item.type];
        if (!Field) {
          return null;
        }
        return (
          <Field key={uuid()} {...item.properties} >
            {SchemaForm({ schema: item })}
          </Field>
        );
      })
    );
  }

  export default SchemaForm;