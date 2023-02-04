/* eslint-disable no-console */
import { bindActionCreators } from 'redux';
import { loginUser } from '../../actions/user';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React, { useState } from 'react';
// material core
import { Alert } from '@material-ui/lab';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// material icon
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


// actions
// import { login } from 'actions/auth.action';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignIn ({ user, loginUser }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState('admin@dev.io');
  const [password, setPassword] = useState('Admin@1223');
  console.log('user', user);
  const _onSubmit = (e) => {
    e.preventDefault();
    if (!user.isFetching) {
      loginUser(name, password);
    }
  };
  if (user.isLogin) {
    return (<Redirect to="/home" />);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        { user.isError && <Alert severity="error">Make sure that the username and password are correct </Alert>}
        <form className={classes.form} noValidate onSubmit={_onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="User Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Password"
            name="password"
            autoComplete="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { user.isFetching ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);