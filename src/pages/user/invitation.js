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
  toast.configure({
    autoClose: 4000,
    draggable: true
  });
  var [state, setState] = useState({
    firstName: "",
    lastName: "",
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
        "user_invitation[first_name]": state.firstName,
        "user_invitation[last_name]": state.lastName
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
        props.history.push("/invited-users-list");
      } else {
        toast.error(invitedUserResponse.message);
      }
    }
  }

  function goToInvitedUserList() {
    props.history.push("/invited-users-list");
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget
          title="User Invite"
          disableWidgetMenu
        >
          <Box display={"flex"} flexDirection="column">
            <Box display={"flex"} alignItems={"center"}>
              <Box width={300}>
                <Typography variant={"h6"}>First Name</Typography>
              </Box>
              <Box flexGrow={1}>
                <Input
                  id="firstName"
                  value={state.firstName}
                  onChange={e => setValue(e)}
                  margin="normal"
                  placeholder="Enter First Name"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <Box width={300}>
                <Typography variant={"h6"}>Last Name</Typography>
              </Box>
              <Box flexGrow={1}>
                <Input
                  id="lastName"
                  value={state.lastName}
                  onChange={e => setValue(e)}
                  margin="normal"
                  placeholder="Enter Last Name"
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
                disabled={!state.email || !state.firstName || !state.lastName || !state.emailValid}
              >
                Sent Invitation
              </Button>
              <Button
                variant={"contained"}
                color={"primary"}
                style={{ marginRight: 8, marginTop: 15 }}
                onClick={goToInvitedUserList}
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
