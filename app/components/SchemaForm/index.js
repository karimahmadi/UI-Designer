import React from 'react';
import { Section } from '@tatareact/core/Section';
import Grid from 'components/Grid';
import Form from 'components/Form';
import { Input } from '@tatareact/core/Input';
import { InputLabel } from '@tatareact/core/InputLabel';
import { v4 as uuid } from 'uuid';
import { useDrop } from 'react-dnd';
import { ItemTypes } from 'components/ItemTypes';

function SchemaForm({ mainSchema, updateSchema }) {
  const mapper = {
    section: Section,
    grid: Grid,
    input: Input,
    inputLabel: InputLabel,
    form: Form,
  };

  const renderSchema = schema => {
    console.log('schema.type:', schema.type);
    if (schema.type === 'text') return schema.value;
    const Field = mapper[schema.type];
    if (!Field) {
      return null;
    }
    return (
      <Field key={uuid()} {...schema.properties} updateSchema={updateSchema}>
        {schema.childs && schema.childs.map(item => renderSchema(item))}
      </Field>
    );
  };

  return renderSchema(mainSchema);
}

export default SchemaForm;
