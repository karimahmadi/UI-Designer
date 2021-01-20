/**
 *
 * Asynchronously loads the component for
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
