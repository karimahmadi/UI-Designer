import React from 'react';
import { Section } from '@tatareact/core/Section';
import Grid from 'components/Grid';
import Form from 'components/Form';
import Input from 'components/Input';
import { InputLabel } from '@tatareact/core/InputLabel';
import { v4 as uuid } from 'uuid';

function SchemaForm({ mainSchema, updateSchema, changeFocus, focusItem,moveItem }) {
  const mapper = {
    section: Section,
    grid: Grid,
    input: Input,
    inputLabel: InputLabel,
    form: Form,
  };

  const renderSchema = schema => {
    if (schema.type === 'text') return schema.value;
    const Field = mapper[schema.type];
    if (!Field) {
      return null;
    }
    return (
      <Field
        key={uuid()}
        {...schema.properties}
        name={schema.name}
        updateSchema={updateSchema}
        changeFocus={changeFocus}
        focusItem={focusItem}
        moveItem={moveItem}
      >
        {schema.childs && schema.childs.map(item => renderSchema(item))}
      </Field>
    );
  };

  return renderSchema(mainSchema);
}

export default SchemaForm;
