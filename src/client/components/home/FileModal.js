/* eslint-disable no-console */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchFileList } from '../../actions/files';
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function FileModal ({ fetchFileList, files}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const submitFolder = (e) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    const token = localStorage.getItem('token');
    let parentId = files.parentId || '';
    let data = new FormData();
    data.append('file', file[0]);
    data.append('parentId', parentId);
    // data.append('user', 'hubot')
    fetch('/api/file/upload', {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`
      },
      body: data
    })
      .then(data => {
        // console.log("data",data);
        if (data.status === 401) {
          try {
            localStorage.removeItem('token');
          } catch (error) {
            console.log('[Unauthorized] Token Remove error');
          }
          // window.location.reload(true);
        }
        return data.json();
      })
      .then(data => {
        fetchFileList({
          parentId: parentId
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="t1" style={{ paddingBottom: '20px' }} > Folder </div>
      <form className={classes.root} noValidate autoComplete="off" style={{ padding: '10px' }}>
        <Grid container alignItems="flex-start" spacing={4} >
          <Grid item xs={12} spacing={2} >
            <input type="file" onChange={ (e) => {
              if (e.target.files) {
                setFile(e.target.files);
              }  
            }} />
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" style={{ marginTop: 30 }}>
          <Grid style={{ marginRight: 10 }} item>
            <Button
              type="button"
              variant="contained"
              onClick={handleClose}
            >
              Close
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={submitFolder}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom onClick={handleOpen}>
        Upload File
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(FileModal);