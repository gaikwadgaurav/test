import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Fade,
  TextField
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
// import classnames from "classnames";

// styles
import styles from "./styles";

// logo
import logo from "./logo.svg";
// import google from "../../images/google.svg";
import {
  signInWithGoogle,
  invitedUserRegister,
  clearMsg,
  updateUserProfile,
  updateInvitedUserProfile
} from "../../Redux/_actions/user.action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLogin from "react-google-login";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { axiosRequest } from "../../Redux/_requests";
import { ValidationHandler } from "../../ValidationHandler/validationHandler";
import qs from "qs";
// import Loader from "react-loader-spinner";
// context
// import { useUserDispatch, loginUser } from "../../context/UserContext";

class InvitedUserRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      password: "",
      confirm_password: "",
      isLoading: "",
      nameValue: "",
      email: "",
      formErrors: { email: "", password: "" },
      emailValid: false,
      passwordValid: false,
      userId: null,
      userToken: null
    };

    toast.configure({
      autoClose: 5000,
      draggable: true
    });
  }

  setValue(e) {
    const response = ValidationHandler(e);
    this.setState({
      formErrors: response.formErrors,
      emailValid: response.emailValid,
      passwordValid: response.passwordValid,
      [e.target.id]: response.name
    });
  }
  async checkTokenIsValid(userToken) {
    const userTokenIsValid = await axiosRequest(
      "POST",
      "/user_invitations/check_invitation/" + userToken + "",
      false,
      undefined,
      undefined,
      undefined,
      undefined
    );
    if (userTokenIsValid && userTokenIsValid.status === 200) {
      const userData = userTokenIsValid.data;
      this.setState({
        email: userData.email,
        nameValue: userData.full_name,
        userId: userData.id,
        userToken: userData.token
      });
    } else {
      toast.error(userTokenIsValid && userTokenIsValid.data);
    }
  }

  componentDidMount() {
    const userToken = this.props.match.params["token"];
    if (userToken) {
      this.checkTokenIsValid(userToken);
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
      localStorage.setItem("token", JSON.stringify(userData.token));
      history.push("/");
      toast.success(userData.successMessage, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.setState({
        isLoading: false
      });
      dispatch(clearMsg());
    }

    if (
      userData.status === ("FAILED" || "SESSION_EXPIRED_SUCCESS") &&
      userData.userData === ""
    ) {
      toast.error(userData.errorMessage, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.setState({
        isLoading: false
      });
      dispatch(clearMsg());
    }
  }

  invitedUserRegister() {
    const { email, nameValue, password, userToken } = this.state;
    const { dispatch } = this.props;
    let userName = nameValue.split(" ");
    const headers = "Bearer " + userToken; 
    const formData = {
      "user[first_name]": userName[0],
      "user[last_name]": userName.length > 1 ? userName[1] :"",
      "user[email]": email,
      "user[password]": password
    };
    dispatch(updateInvitedUserProfile(headers, null, qs.parse(formData),userToken));
  }

  onAuthSuccess = async response => {
    if (response) {
      const { dispatch } = this.props;
      const formData = {
        token: response.tokenId,
        googleid: response.googleId
      };
      dispatch(signInWithGoogle(formData));
    }
  };
  onAuthFailure = response => {
    console.log("google failure response--->", response);
  };

  render() {
    const {
      error,
      isLoading,
      password,
      confirm_password,
      nameValue,
      email,
      formErrors,
      emailValid,
      passwordValid
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
            <React.Fragment>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="nameValue"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={nameValue}
                onChange={e => this.setValue(e)}
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={email}
                onChange={e => this.setValue(e)}
                placeholder="Email Address"
                type="email"
                fullWidth
                disabled
              />
              {emailValid ? null : (
                <span className={"text text-danger"}>{formErrors.email}</span>
              )}
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={password}
                onChange={e => this.setValue(e)}
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() => this.invitedUserRegister()}
                    disabled={!password || !nameValue || !email || !emailValid}
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
                <Typography className={classes.formDividerWord}>or</Typography>
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
  userData: state.userData
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles, { withTheme: true })(InvitedUserRegistration));
