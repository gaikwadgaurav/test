import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import classnames from "classnames";

// styles
import styles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";
import { signIn } from "../../Redux/_actions/user.action";

// context
// import { useUserDispatch, loginUser } from "../../context/UserContext";

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabId: 0,
      error: false,
      loginValue: "",
      password: "",
      isLoading: "",
      nameValue: "",
      email: "",
    };
  }

  setValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  loginUser() {
    const { dispatch } = this.props;
    const {
      activeTabId,
      error,
      isLoading,
      nameValue,
      email,
      ...arg
    } = this.state;
    dispatch(signIn(arg));
  }

  componentDidUpdate() {
    const { userData, history } = this.props;
    if (userData.status === "SUCCESS" && userData.userData !== "") {
      localStorage.setItem("userData", JSON.stringify(userData.userData));
      history.push("/app/dashboard");
    }
  }

  render() {
    const {
      activeTabId,
      error,
      isLoading,
      loginValue,
      password,
      nameValue,
      email,
    } = this.state;
    const { classes } = this.props;
    return (
      <Grid container className={classes.container}>
        <div className={classes.logotypeContainer}>
          <img src={logo} alt="logo" className={classes.logotypeImage} />
          <Typography className={classes.logotypeText}>CHURN APP</Typography>
        </div>
        <div className={classes.formContainer}>
          <div className={classes.form}>
            <Tabs
              id="activeTabId"
              value={activeTabId}
              onChange={(e, id) =>
                this.setState({ activeTabId: id, password: "", loginValue: "" })
              }
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Login" classes={{ root: classes.tab }} />
              <Tab label="New User" classes={{ root: classes.tab }} />
            </Tabs>
            {activeTabId === 0 && (
              <React.Fragment>
                <Typography variant="h1" className={classes.greeting}>
                  Good Morning, User
                </Typography>
                <Button size="large" className={classes.googleButton}>
                  <img
                    src={google}
                    alt="google"
                    className={classes.googleIcon}
                  />
                  &nbsp;Sign in with Google
                </Button>
                <div className={classes.formDividerContainer}>
                  <div className={classes.formDivider} />
                  <Typography className={classes.formDividerWord}>
                    or
                  </Typography>
                  <div className={classes.formDivider} />
                </div>
                <Fade in={error}>
                  <Typography
                    color="secondary"
                    className={classes.errorMessage}
                  >
                    Something is wrong with your login or password :(
                  </Typography>
                </Fade>
                <TextField
                  id="loginValue"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={loginValue}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Email Adress"
                  type="email"
                  fullWidth
                />
                <TextField
                  id="password"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={password}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Password"
                  type="password"
                  fullWidth
                />
                <div className={classes.formButtons}>
                  {isLoading ? (
                    <CircularProgress
                      size={26}
                      className={classes.loginLoader}
                    />
                  ) : (
                    <Button
                      disabled={
                        loginValue.length === 0 || password.length === 0
                      }
                      onClick={() => this.loginUser()}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Login
                    </Button>
                  )}
                  <Button
                    color="primary"
                    size="large"
                    className={classes.forgetButton}
                  >
                    Forget Password
                  </Button>
                </div>
              </React.Fragment>
            )}
            {activeTabId === 1 && (
              <React.Fragment>
                <Typography variant="h1" className={classes.greeting}>
                  Welcome!
                </Typography>
                <Typography variant="h2" className={classes.subGreeting}>
                  Create your account
                </Typography>
                <Fade in={error}>
                  <Typography
                    color="secondary"
                    className={classes.errorMessage}
                  >
                    Something is wrong with your login or password :(
                  </Typography>
                </Fade>
                <TextField
                  id="nameValue"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={nameValue}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Full Name"
                  type="email"
                  fullWidth
                />
                <TextField
                  id="email"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={email}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Email Adress"
                  type="email"
                  fullWidth
                />
                <TextField
                  id="password"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={password}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Password"
                  type="password"
                  fullWidth
                />
                <div className={classes.creatingButtonContainer}>
                  {isLoading ? (
                    <CircularProgress size={26} />
                  ) : (
                    <Button
                      // onClick={() => this.loginUser()}
                      disabled={
                        password.length === 0 ||
                        nameValue.length === 0 ||
                        email.length === 0
                      }
                      size="large"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className={classes.createAccountButton}
                    >
                      Create your account
                    </Button>
                  )}
                </div>
                <div className={classes.formDividerContainer}>
                  <div className={classes.formDivider} />
                  <Typography className={classes.formDividerWord}>
                    or
                  </Typography>
                  <div className={classes.formDivider} />
                </div>
                <Button
                  size="large"
                  className={classnames(
                    classes.googleButton,
                    classes.googleButtonCreating,
                  )}
                >
                  <img
                    src={google}
                    alt="google"
                    className={classes.googleIcon}
                  />
                  &nbsp;Sign in with Google
                </Button>

              </React.Fragment>
            )}
          </div>
          <Typography color="primary" className={classes.copyright}>
            © 2014-2019 Flatlogic, LLC. All rights reserved.
          </Typography>
        </div>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles, { withTheme: true })(SignInForm));
