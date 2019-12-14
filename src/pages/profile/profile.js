import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import useStyles from "../forms/elements/styles";
import Input from "@material-ui/core/TextField";
import { useDispatch, connect } from "react-redux";
// components
import Widget from "../../components/Widget/Widget";
import { Button, Typography } from "../../components/Wrappers/Wrappers";
import { isAuthenticated } from "../../common/isAuthenticated";
import { updateUserProfile, clearMsg } from "../../Redux/_actions/user.action";
import qs from "qs";
import { toast } from "react-toastify";
import { ValidationHandler } from "../../ValidationHandler/validationHandler";

export function Profile(props) {
  const classes = useStyles();
  const user = isAuthenticated();
  var [state, setState] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    password: "",
    confirmPassword: "",
    formErrors: { email: "", password: "" },
    emailValid: "",
    passwordValid: ""
  });

  const dispatch = useDispatch();
  toast.configure({
    autoClose: 5000,
    draggable: true
  });

  function setValue(e) {
    const response = ValidationHandler(e);
    setState({
      ...state,
      formErrors: response.formErrors,
      emailValid: response.emailValid,
      passwordValid: response.passwordValid,
      [e.target.id]: response.name
    });
  }

  function updateProfile() {
    const formData = {
      "user[first_name]": state.firstName,
      "user[last_name]": state.lastName,
      "user[email]": state.email,
      "user[password]": state.password
    };
    dispatch(updateUserProfile(true, null, qs.parse(formData)));
  }

  useEffect(() => {
    const { userData } = props;
    if (
      userData.status === "SUCCESS" &&
      (userData.userData !== "" || userData.signUp !== "")
    ) {
      localStorage.setItem("userData", JSON.stringify(userData.userData));
      toast.success(userData.successMessage, {
        position: toast.POSITION.TOP_RIGHT
      });
      dispatch(clearMsg());
    }
  });
  return (
    <Grid item md={8}>
      <Widget
        title="Profile"
        bodyClass={classes.horizontalFormTop}
        disableWidgetMenu
        inheritHeight
      >
        <Grid container direction={"column"} spacing={3} className={"my-4"}>
          <Grid item container alignItems={"center"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>First Name</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="firstName"
                type={"text"}
                style={{ width: "100%" }}
                value={state.firstName}
                onChange={e => setValue(e)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction={"column"} spacing={3} className={"mb-4"}>
          <Grid item container alignItems={"center"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Last Name</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="lastName"
                style={{ width: "100%" }}
                value={state.lastName}
                type={"text"}
                onChange={e => setValue(e)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction={"column"} spacing={3} className={"mb-4"}>
          <Grid item container alignItems={"center"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Email Address</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="email"
                style={{ width: "100%" }}
                value={state.email}
                type={"text"}
                onChange={e => setValue(e)}
                disabled
              />
              {state.emailValid ? null : (
                <span className={"text text-danger"}>
                  {state.formErrors.email}
                </span>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction={"column"} spacing={3} className={"mb-4"}>
          <Grid item container alignItems={"center"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Password</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="password"
                style={{ width: "100%" }}
                value={state.password}
                type={"password"}
                onChange={e => setValue(e)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction={"column"} spacing={3} className={"mb-4"}>
          <Grid item container alignItems={"center"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Confirm Password</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="confirmPassword"
                style={{ width: "100%" }}
                value={state.confirmPassword}
                type={"password"}
                onChange={e => setValue(e)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item container>
          <Grid item>
            <Button
              variant={"contained"}
              color={"primary"}
              style={{ marginRight: 8 }}
              onClick={updateProfile}
            >
              Save
            </Button>
          </Grid>
          {/* <Grid item>
            <Button variant={"contained"} color={"secondary"}>
              Cancel
            </Button>
          </Grid> */}
        </Grid>
      </Widget>
    </Grid>
  );
}

const mapStateToProps = state => ({
  userData: state.userData
});

export default connect(mapStateToProps, null)(Profile);
