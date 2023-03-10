/* eslint-disable no-console */
import { bindActionCreators } from 'redux';
import { fetchFileList, updateBreadCrum, currentFolderId } from '../../actions/files';
import { connect, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
// material core
import { Alert } from '@material-ui/lab';
import { Container, Typography, Grid, Breadcrumbs, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import File from './File';
import './FileList.css';
import Loader from './Loader'; 
import MenuAppBar from './MenuAppBar'; 
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
function Home ({ files, fetchFileList, updateBreadCrum }) {
  const classes = useStyles();
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
      <Grid container style={{ padding: 20 }} key={'G1'}>
        {
          files.list && files.list.map((singleFile) => {
            return (
              <Grid item xs={3} key={`G${singleFile._id}`}>
                <File files={files} className={classes.paper}
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
      <MenuAppBar/>
      <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '20px' }}>
        <Link to='#' color="inherit" onClick={() => {
          updateBreadCrum({ list: [] });
          currentFolderId({ fileId: '' });
          fetchFileList({});
        }}>
          Home
        </Link>
        {
          files.breadcrum && files.breadcrum.map((el) => {
            return (
              <Link to='#' color="inherit" onClick={() => {
                // update breakcrum
                let breadcrum = [];
                for (let menu of files.breadcrum) {
                  breadcrum.push(menu);
                  if (menu._id === el._id) {
                    break;
                  }
                }
                updateBreadCrum({ list: breadcrum });
                currentFolderId({ fileId: el._id });
                fetchFileList({
                  parentId: el._id
                });
              }}>
                {el.name}
              </Link>
            );
          })
        }
      </Breadcrumbs>
      <FileListComponent key={'fileList'}/>
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
    fetchFileList,
    updateBreadCrum,
    currentFolderId,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);