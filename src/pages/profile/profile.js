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

export function Profile(props) {
  const classes = useStyles();
  const user = isAuthenticated();
  var [firstName, setFirstName] = useState(user.first_name);
  var [lastName, setLastName] = useState(user.last_name);
  var [email, setEmail] = useState(user.email);
  var [password, setPassword] = useState("");
  var [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  toast.configure({
    autoClose: 5000,
    draggable: true,
  });
  function updateProfile() {
    const formData = {
      "user[first_name]": firstName,
      "user[last_name]": lastName,
      "user[email]": email,
      "user[password]": password,
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
        position: toast.POSITION.TOP_RIGHT,
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
                type={"text"}
                style={{ width: "100%" }}
                value={firstName}
                type={"text"}
                onChange={e => setFirstName(e.target.value)}
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
                style={{ width: "100%" }}
                value={lastName}
                type={"text"}
                onChange={e => setLastName(e.target.value)}
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
                style={{ width: "100%" }}
                value={email}
                type={"text"}
                onChange={e => setEmail(e.target.value)}
              />
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
                style={{ width: "100%" }}
                value={password}
                type={"password"}
                onChange={e => setPassword(e.target.value)}
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
                style={{ width: "100%" }}
                value={confirmPassword}
                type={"password"}
                onChange={e => setConfirmPassword(e.target.value)}
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
  userData: state.userData,
});

export default connect(mapStateToProps, null)(Profile);
