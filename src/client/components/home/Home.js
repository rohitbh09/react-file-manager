/* eslint-disable no-console */
import { bindActionCreators } from 'redux';
import { loginUser } from '../../actions/user';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React, { useState } from 'react';
// material core
import { Alert } from '@material-ui/lab';
import { Container, Typography, Grid, InputLabel } from '@material-ui/core';
import FileCard from './Card'
const products = [
  { id: 'aa1', name: 'name1', cover: 'cover1', price: 'price1', colors: 'colors1', status: 'status1', priceSale: 'priceSale1' },
  { id: 'a2', name: 'name2', cover: 'cover2', price: 'price2', colors: 'colors2', status: 'status2', priceSale: 'priceSale2' }
];
function Home ({ user, loginUser }) {
  return (
    <Container component="main">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <FileCard product={product}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    user: state.users
  };
};
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loginUser
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);