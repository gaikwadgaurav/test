import React, { useState } from "react";
import useStyles from "../forms/elements/styles";
import Widget from "../../components/Widget/Widget";
import { Button, Typography } from "../../components/Wrappers/Wrappers";
import { toast } from "react-toastify";
import { Box, Grid, TextField as Input } from "@material-ui/core";
import { ValidationHandler } from "../../ValidationHandler/validationHandler";
import { axiosRequest } from "../../Redux/_requests/index";
import qs from "qs";

export function UserInvitation(props) {
  const classes = useStyles();
  toast.configure({
    autoClose: 4000,
    draggable: true
  });
  var [state, setState] = useState({
    fullName: "",
    email: "",
    formErrors: { email: "" },
    emailValid: ""
  });

  function setValue(e) {
    const response = ValidationHandler(e);
    setState({
      ...state,
      formErrors: response.formErrors,
      emailValid: response.emailValid,
      [e.target.id]: response.name
    });
  }

  async function inviteUser() {
    if (state.email) {
      const formData = {
        "user_invitation[email]": state.email,
        "user_invitation[name]": state.fullName
      };
      const invitedUserResponse = await axiosRequest(
        "POST",
        "/user_invitations",
        true,
        undefined,
        qs.parse(formData),
        undefined,
        null
      );
      if (invitedUserResponse && invitedUserResponse.status === 200) {
        toast.success(invitedUserResponse.message);
      } else {
        toast.error(invitedUserResponse.message);
      }
    }
  }

  function goToDashBoard() {
    props.history.push("/");
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget title="Invite User" disableWidgetMenu>
          <Box display={"flex"} flexDirection="column">
            <Box display={"flex"} alignItems={"center"}>
              <Box width={300}>
                <Typography variant={"h6"}>Full Name</Typography>
              </Box>
              <Box flexGrow={1}>
                <Input
                  id="fullName"
                  value={state.fullName}
                  onChange={e => setValue(e)}
                  margin="normal"
                  placeholder="Enter Full Name"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <Box width={300}>
                <Typography variant={"h6"}>Email</Typography>
              </Box>
              <Box flexGrow={1}>
                <Input
                  id="email"
                  value={state.email}
                  onChange={e => setValue(e)}
                  margin="normal"
                  placeholder="Enter Email"
                  variant="outlined"
                />
                {state.emailValid ? null : (
                  <div>
                    <span className={"text text-danger"}>
                      {state.formErrors.email}
                    </span>
                  </div>
                )}
              </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <Button
                variant={"contained"}
                color={"success"}
                style={{ marginRight: 8, marginTop: 15 }}
                onClick={inviteUser}
                disabled={!state.email || !state.fullName || !state.emailValid}
              >
                Sent Invitation
              </Button>
              <Button
                variant={"contained"}
                style={{ marginRight: 8, marginTop: 15 }}
                onClick={goToDashBoard}
              >
                Back
              </Button>
            </Box>
          </Box>
        </Widget>
      </Grid>
    </Grid>
  );
}

export default UserInvitation;
