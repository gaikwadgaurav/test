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
  Fade,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
// import classnames from "classnames";

// styles
import styles from "./styles";

// logo
import logo from "./logo.svg";
// import google from "../../images/google.svg";
import {
  signIn,
  signUp,
  clearMsg,
  signInWithGoogle,
} from "../../Redux/_actions/user.action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLogin from "react-google-login";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { axiosRequest } from "../../Redux/_requests";
// import Loader from "react-loader-spinner";
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
      confirm_password: "",
      isLoading: "",
      companyNameValue: "",
      nameValue: "",
      email: "",
      showForgetPasswordForm: false,
      showNewPasswordForm: false,
      resetPasswordToken: "",
    };

    toast.configure({
      autoClose: 5000,
      draggable: true,
    });
  }

  componentDidMount() {
    let url = new URLSearchParams(window.location.search);
    const resetPasswordToken = url.get("reset_password_token");
    if (resetPasswordToken) {
      this.setState({ showNewPasswordForm: true, resetPasswordToken });
    }
  }

  setValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  loginUser() {
    const { dispatch } = this.props;
    this.setState({
      isLoading: true,
    });
    const { loginValue, password } = this.state;
    let formData = new FormData();
    formData.append("sign_in[email]", loginValue);
    formData.append("sign_in[password]", password);
    dispatch(signIn(formData));
  }

  registerUser() {
    const { dispatch } = this.props;
    const { companyNameValue, nameValue, email, password } = this.state;
    this.setState({ isLoading: true });
    let formData = new FormData();
    formData.append("company[name]", companyNameValue);
    formData.append("user[name]", nameValue);
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    dispatch(signUp(formData));
  }

  async forgetPassword() {
    const { loginValue } = this.state;
    this.setState({ isLoading: true });
    try {
      const response = await axiosRequest(
        "POST",
        `forgot_password?email=${loginValue}`,
        false,
        null,
        null,
      );
      if (response.is_success) {
        toast.success(response.messages, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.setState({
          activeTabId: 0,
          showForgetPasswordForm: false,
          showNewPasswordForm: false,
          loginValue: "",
          isLoading: false,
        });
      }
    } catch (error) {
      toast.error(error.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({
        isLoading: false,
      });
    }
  }

  async resetPassword() {
    const { resetPasswordToken, password } = this.state;
    this.setState({ isLoading: true });
    const formData = {
      token: resetPasswordToken,
      new_password: password,
    };
    try {
      const response = await axiosRequest(
        "POST",
        "reset_password",
        false,
        null,
        formData,
      );
      if (response.is_success) {
        toast.success(response.messages, {
          position: toast.POSITION.TOP_RIGHT,
        });
        this.setState({
          activeTabId: 0,
          showForgetPasswordForm: false,
          showNewPasswordForm: false,
          resetPasswordToken: "",
          password: "",
          isLoading: false,
        });
        window.location.replace("/login");
      }
    } catch (error) {
      toast.error(error.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({
        isLoading: false,
      });
    }
  }

  componentDidUpdate() {
    this.logInSuccessAction();
  }

  logInSuccessAction() {
    const { userData, history, dispatch } = this.props;
    if (
      userData.status === "SUCCESS" &&
      (userData.userData !== "" || userData.signUp !== "")
    ) {
      localStorage.setItem("userData", JSON.stringify(userData.userData));
      history.push("/");
      toast.success(userData.successMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({
        isLoading: false,
      });
      dispatch(clearMsg());
    }

    if (userData.status === "FAILED" && userData.userData === "") {
      toast.error(userData.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({
        isLoading: false,
      });
      dispatch(clearMsg());
    }
  }

  onAuthSuccess = async response => {
    if (response) {
      const { dispatch } = this.props;
      const formData = {
        token: response.tokenId,
        googleid: response.googleId,
      };
      dispatch(signInWithGoogle(formData));
    }
  };
  onAuthFailure = response => {
    console.log("google failure response--->", response);
  };

  render() {
    const {
      activeTabId,
      error,
      isLoading,
      loginValue,
      password,
      confirm_password,
      companyNameValue,
      nameValue,
      email,
      showForgetPasswordForm,
      showNewPasswordForm,
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
            {!showForgetPasswordForm && !showNewPasswordForm && (
              <Tabs
                id="activeTabId"
                value={activeTabId}
                onChange={(e, id) =>
                  this.setState({
                    activeTabId: id,
                    password: "",
                    loginValue: "",
                  })
                }
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Login" classes={{ root: classes.tab }} />
                <Tab label="New User" classes={{ root: classes.tab }} />
              </Tabs>
            )}

            {activeTabId === 0 &&
              !showForgetPasswordForm &&
              !showNewPasswordForm && (
                <React.Fragment>
                  <Typography variant="h1" className={classes.greeting}>
                    Good Morning, User
                  </Typography>
                  <GoogleLogin
                    size="large"
                    className={classes.googleButton}
                    clientId={process.env.REACT_APP_GOOGLE_APP_ID}
                    buttonText="Sign in with Google"
                    onSuccess={this.onAuthSuccess}
                    onFailure={this.onAuthFailure}
                    cookiePolicy={"single_host_origin"}
                  />

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
                    placeholder="Email Address"
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
                      onClick={() =>
                        this.setState({ showForgetPasswordForm: true })
                      }
                    >
                      Forget Password
                    </Button>
                  </div>
                </React.Fragment>
              )}

            {activeTabId === 1 &&
              !showForgetPasswordForm &&
              !showNewPasswordForm && (
                <React.Fragment>
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
                    id="companyNameValue"
                    InputProps={{
                      classes: {
                        underline: classes.textFieldUnderline,
                        input: classes.textField,
                      },
                    }}
                    value={companyNameValue}
                    onChange={e => this.setValue(e)}
                    margin="normal"
                    placeholder="Company Name"
                    type="text"
                    fullWidth
                  />
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
                    placeholder="Email Address"
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
                        onClick={() => this.registerUser()}
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
                  <GoogleLogin
                    size="large"
                    className={classes.googleButton}
                    clientId={process.env.REACT_APP_GOOGLE_APP_ID}
                    buttonText="Sign in with Google"
                    onSuccess={this.onAuthSuccess}
                    onFailure={this.onAuthFailure}
                    cookiePolicy={"single_host_origin"}
                  />
                </React.Fragment>
              )}

            {showForgetPasswordForm && !showNewPasswordForm && (
              <React.Fragment>
                <Typography variant="h3" className={classes.greeting}>
                  Forget your password
                </Typography>

                <div className={classes.formDividerContainer}>
                  <div className={classes.formDivider} />
                </div>

                <TextField
                  id="loginValue"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  className="mt-5 pt-5"
                  value={loginValue}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Email Adress"
                  type="email"
                  fullWidth
                />
                <div className={classes.formButtons}>
                  {isLoading ? (
                    <CircularProgress
                      size={26}
                      className={classes.loginLoader}
                    />
                  ) : (
                    <div>
                      <Button
                        disabled={loginValue.length === 0}
                        onClick={() => this.forgetPassword()}
                        variant="contained"
                        color="primary"
                        size="medium"
                      >
                        Reset Password
                      </Button>

                      <Button
                        className={classes.cancelButton}
                        onClick={() =>
                          this.setState({
                            showForgetPasswordForm: false,
                            loginValue: "",
                            password: "",
                            activeTabId: 0,
                          })
                        }
                        variant="contained"
                        color="secondary"
                        size="medium"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}

            {showNewPasswordForm && (
              <React.Fragment>
                <Typography variant="h3" className={classes.greeting}>
                  Reset Password
                </Typography>

                <div className={classes.formDividerContainer}>
                  <div className={classes.formDivider} />
                </div>

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
                  placeholder="Enter new password"
                  type="password"
                  fullWidth
                />

                <TextField
                  id="confirm_password"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={confirm_password}
                  onChange={e => this.setValue(e)}
                  margin="normal"
                  placeholder="Re-enter new password"
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
                    <div>
                      <Button
                        disabled={
                          password.length === 0 || confirm_password.length === 0
                        }
                        onClick={() => this.resetPassword()}
                        variant="contained"
                        color="primary"
                        size="medium"
                      >
                        Save
                      </Button>

                      <Button
                        className={classes.cancelButton}
                        onClick={() =>
                          this.setState({
                            showNewPasswordForm: false,
                            showForgetPasswordForm: true,
                            password: "",
                          })
                        }
                        variant="contained"
                        color="secondary"
                        size="medium"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}
            <Typography color="primary" className={classes.copyright}>
              © 2019 ChurnAI, LLC. All rights reserved.
            </Typography>
          </div>
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
