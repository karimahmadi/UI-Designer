import React from 'react';
import { Grid } from '@tatareact/core/Grid';
import { NumberInput } from '@tatareact/core/NumberInput';
import { Checkbox } from '@tatareact/core/Checkbox';

const GridProperties = ({ container, item, xs, sm, md, lg }) => (
  <Grid container>
    <Grid item xs={6} left>
      container
    </Grid>
    <Grid item xs={6} left>
      <Checkbox />
    </Grid>

    <Grid item xs={6} left>
      item
    </Grid>
    <Grid item xs={6} left>
      <Checkbox />
    </Grid>

    <Grid item xs={6} left>
      xs
    </Grid>
    <Grid item xs={6} left>
      <NumberInput value={xs} />
    </Grid>

    <Grid item xs={6} left>
      sm
    </Grid>
    <Grid item xs={6} left>
      <NumberInput value={sm} />
    </Grid>

    <Grid item xs={6} left>
      md
    </Grid>
    <Grid item xs={6} left>
      <NumberInput value={md} />
    </Grid>

    <Grid item xs={6} left>
      lg
    </Grid>
    <Grid item xs={6} left>
      <NumberInput value={lg} />
    </Grid>
  </Grid>
);

export default GridProperties;
