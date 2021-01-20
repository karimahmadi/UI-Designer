/**
 *
 * GlobalServices
 *
 */

import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectUserLoggedIn } from '../Authenticator/selectors';
import reducer from './reducer';
import saga from './saga';

import { FETCH_CURRENT_USER } from './constants';

export function GlobalServices({ userLoggedIn, fetchCurrentUser }) {
  useInjectReducer({ key: 'globalServices', reducer });
  useInjectSaga({ key: 'globalServices', saga });
  useEffect(() => {
    if (userLoggedIn) {
      fetchCurrentUser();
    }
  }, [userLoggedIn]);

  return <Fragment />;
}

GlobalServices.propTypes = {
  fetchCurrentUser: PropTypes.func.isRequired,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  userLoggedIn: makeSelectUserLoggedIn(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchCurrentUser: () => dispatch({ type: FETCH_CURRENT_USER }),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GlobalServices);
