import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Box, Grid, TextField as Input } from "@material-ui/core";

//components
import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { useDispatch } from "react-redux";
import {
  addVariable,
  updateVariable,
} from "../../Redux/_actions/variable.action";
import { axiosRequest } from "../../Redux/_requests";
import { toast } from "react-toastify";
import qs from "qs";

const CreateVariable = props => {
  const [variableName, setVariableName] = React.useState("");
  const [defaultValue, setDefaultValue] = React.useState("");
  const [variableId, setVariableId] = React.useState();

  const dispatch = useDispatch();
  
  function goToVariableList() {
    const { history } = props;
    history.push("/variable/list");
  }

  function variableOperation() {
    toast.configure({
      autoClose: 4000,
      draggable: true,
    });
    const formData = {
      "variable[name]": variableName,
      "variable[default]": defaultValue,
    };
    if (variableName && defaultValue) {
      if (variableId) {
        dispatch(
          updateVariable(true, variableId, null, qs.stringify(formData)),
        );
      } else {
        dispatch(addVariable(true, null, qs.stringify(formData)));
      }
    } else {
      toast.error("Please fill all details...!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async function fetchVariableById(variableId) {
    const fetchVariableResponse = await axiosRequest(
      "GET",
      "variables/" + variableId + "",
      true,
      null,
      null,
    );
    if (fetchVariableResponse) {
      setVariableName(fetchVariableResponse.data.name);
      setDefaultValue(fetchVariableResponse.data.default);
    }
  }

  function variableOperationSuccess(props) {
    if (
      props &&
      props.variables &&
      props.variables.status === "SUCCESS" &&
      props.variables.successMessage &&
      props.variables.successMessage !== ""
    ) {
      goToVariableList();
    }
  }

  useEffect(() => {
    setVariableId(props.match.params.id);
    if (variableId) {
      fetchVariableById(variableId);
    }
  }, [variableId]);

  useEffect(() => {
    variableOperationSuccess(props);
  }, [props]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget
            title={
              variableId && variableId ? "Update Variable" : "New Variable"
            }
            disableWidgetMenu
          >
            <Box display={"flex"} flexDirection="column">
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Variable Name</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="variableName"
                    value={variableName}
                    onChange={e => setVariableName(e.target.value)}
                    margin="normal"
                    placeholder="Enter Variable Name"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Default Value</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="defaultValue"
                    value={defaultValue}
                    onChange={e => setDefaultValue(e.target.value)}
                    margin="normal"
                    placeholder="Enter Default Value"
                    variant="outlined"
                  />
                </Box>
              </Box>
              {/* <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Price</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                    value={0.01}
                    type={"number"}
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Discount</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                    value={0}
                    type={"number"}
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Description</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Code</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Hashtag</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Technology</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                    placeholder={"Add Tag"}
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Rating</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="outlined-name"
                    margin="normal"
                    variant="outlined"
                    type={"number"}
                    value={5}
                  />
                </Box>
              </Box> */}
              <Box display={"flex"} alignItems={"center"}>
                <Button
                  variant={"contained"}
                  color={"success"}
                  style={{ marginRight: 8, marginTop: 15 }}
                  onClick={() => variableOperation()}
                >
                  {variableId && variableId ? "Update" : "Save"}
                </Button>
                <Button
                  variant={"contained"}
                  style={{ marginRight: 8, marginTop: 15 }}
                  onClick={() => {
                    goToVariableList();
                  }}
                >
                  Back
                </Button>
              </Box>
            </Box>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = state => ({
  variables: state.variables,
});

export default connect(mapStateToProps, null)(CreateVariable);
