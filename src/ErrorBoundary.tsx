/* eslint-disable */
import React, { Component, Fragment } from 'react';

export class ErrorBoundary extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);

    this.state = {
      isError: false,
    };
  }

  componentDidCatch() {
    this.setState({ isError: true });
  }

  render() {
    // @ts-ignore
    return this.state.isError ? (
      <p className="error">Oops! An error occured.</p>
    ) : (
      <Fragment>{this.props.children}</Fragment>
    );
  }
}

export default ErrorBoundary;
