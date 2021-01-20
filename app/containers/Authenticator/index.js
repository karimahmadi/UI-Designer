/**
 *
 * Authenticator
 *
 */

import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {authenticate} from './actions';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { AUTHENTICATE } from './constants';
import saga from './saga';

import {makeSelectUserLoggedIn} from './selectors';
import reducer from './reducer';

export function Authenticator({authentication, userLoggedIn}) {
  const key = 'authenticator';
  useInjectReducer({ key: 'authenticator', reducer });
  useInjectSaga({ key, saga });
  useEffect(()=>{
    if(!userLoggedIn)
        authentication()
  },[])
  return (
    <Fragment />
  );
}

Authenticator.propTypes = {
  authentication: PropTypes.func.isRequired,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  userLoggedIn: makeSelectUserLoggedIn(),
});

function mapDispatchToProps(dispatch) {
  return {
    authentication: () => dispatch(authenticate()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Authenticator);
