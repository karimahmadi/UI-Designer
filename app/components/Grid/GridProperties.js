import React, { useState, useEffect } from 'react';
import { Grid } from '@tatareact/core/Grid';
import { NumberInput } from '@tatareact/core/NumberInput';
import { Checkbox } from '@tatareact/core/Checkbox';
import NativeSelect from '@material-ui/core/NativeSelect';

const GridProperties = ({ focusItem, onChange }) => {
  const [state, setState] = useState({ ...focusItem.properties });

  useEffect(() => {
    console.log(focusItem);
    const {container=false,item=false,xs=false,sm=false,md=false,lg=false} = focusItem.properties;
    setState({ ...state, container,item,xs,sm,md,lg});
  }, [focusItem]);

  const handleContainerChange = () => {
    const newState = {
      ...state,
      container: event.target.checked,
    };
    setState(newState);
    onChange(newState);
  };

  const handleItemChange = () => {
    const newState = {
      ...state,
      item: event.target.checked,
    };
    setState(newState);
    onChange(newState);
  };

  const handleChange = event => {
    const { name } = event.target;
    const newState = {
      ...state,
      [name]: 1 * event.target.value,
    };
    setState(newState);
    onChange(newState);
  };

  const handleLeftChange = event => {
    const { name } = event.target;
    const newState = {
      ...state,
      left: event.target.checked,
    };
    setState(newState);
    onChange(newState);
  };

  const generateOptions = () =>
    ['false', 'auto', 'true', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
      item => <option value={item}>{item}</option>,
    );

  return (
    <Grid container>
      <Grid item xs={6} left>
        container
      </Grid>
      <Grid item xs={6} left>
        <Checkbox checked={state.container} onChange={handleContainerChange} />
      </Grid>

      <Grid item xs={6} left>
        item
      </Grid>
      <Grid item xs={6} left>
        <Checkbox checked={state.item} onChange={handleItemChange} />
      </Grid>
      {state.item && (
        <React.Fragment>
          <Grid item xs={6} left>
            xs
          </Grid>
          <Grid item xs={6} left>
            <NativeSelect
              value={state.xs}
              onChange={handleChange}
              inputProps={{
                name: 'xs',
              }}
            >
              {generateOptions()}
            </NativeSelect>
          </Grid>

          <Grid item xs={6} left>
            sm
          </Grid>
          <Grid item xs={6} left>
            <NativeSelect
              value={state.sm}
              onChange={handleChange}
              inputProps={{
                name: 'sm',
              }}
            >
              {generateOptions()}
            </NativeSelect>
          </Grid>

          <Grid item xs={6} left>
            md
          </Grid>
          <Grid item xs={6} left>
            <NativeSelect
              value={state.md}
              onChange={handleChange}
              inputProps={{
                name: 'md',
              }}
            >
              {generateOptions()}
            </NativeSelect>
          </Grid>

          <Grid item xs={6} left>
            lg
          </Grid>
          <Grid item xs={6} left>
            <NativeSelect
              value={state.lg}
              onChange={handleChange}
              inputProps={{
                name: 'lg',
              }}
            >
              {generateOptions()}
            </NativeSelect>
          </Grid>
        </React.Fragment>
      )}

      <Grid item xs={6} left>
        align left
      </Grid>
      <Grid item xs={6} left>
        <Checkbox checked={state.left} onChange={handleLeftChange} />
      </Grid>

    </Grid>
  );
};

export default GridProperties;
