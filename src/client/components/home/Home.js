/* eslint-disable no-console */
import { bindActionCreators } from 'redux';
import { fetchFileList } from '../../actions/files';
import { connect, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
// material core
import { Alert } from '@material-ui/lab';
import { Container, Typography, Grid, Breadcrumbs, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import File from './File';
import './FileList.css';
import Loader from './Loader'; 
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));
function Home ({ files, fetchFileList }) {
  const classes = useStyles();
  console.log('files', files);
  const selectedId = files.fileId || '';
  // Fetch File List
  useEffect(() => {
    fetchFileList({});
  }, []);

  const FileListComponent = () => {
    if (files.isFetching) {
      return (
        <Loader/>
      );
    }
    if (!files.list || files.list.length === 0) {
      return (
        <div>{ 'No Files' }</div>
      );
    }
    return (
      <Grid container spacing={3} style={{ padding: 20 }}>
        {
          files.list && files.list.map((singleFile) => {
            return (
              <Grid item xs={3}>
                <File className={classes.paper}
                  singleFile={singleFile}
                  key={singleFile._id}
                  isSelected={ selectedId === singleFile._id ? true : false }/>
              </Grid>
            );
          })
        }
      </Grid>
    );
  };
  return (
    <Container component="main">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Files
      </Typography>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/" onClick={() => {
          fetchFileList({});
        }}>
          Home
        </Link>
        <Link color="inherit"  onClick={() => {

        }}>
          Files
        </Link>
      </Breadcrumbs>
      <FileListComponent/>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    files: state.files
  };
};
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchFileList
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);