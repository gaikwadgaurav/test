import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Box, Grid, TextField as Input, Checkbox } from "@material-ui/core";

//components
import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { useDispatch } from "react-redux";
import { axiosRequest } from "../../Redux/_requests";
import { toast } from "react-toastify";
import qs from "qs";
import { isAuthenticated } from "../../common/isAuthenticated";
import { addFlow, updateFlow } from "../../Redux/_actions/flow.action";

const CreateFlow = props => {
  const [flowId, setFlowId] = React.useState("");
  const [flowName, setFlowName] = React.useState("");
  const [enabled, setEnabled] = React.useState(false);
  const [style, setStyle] = React.useState("");
  const user = isAuthenticated();
  const dispatch = useDispatch();

  function goToFlowList() {
    const { history } = props;
    history.push("/flows/flows-list");
  }

  function flowOperation() {
    toast.configure({
      autoClose: 4000,
      draggable: true
    });
    const company_id = user.company_id;
    const formData = {
      "flow[name]": flowName,
      "flow[enabled]": enabled,
      "flow[company_id]": company_id,
      "flow[style]": style
    };
    if (flowName) {
      if (flowId) {
        dispatch(
          updateFlow(true, flowId, null, qs.parse(formData))
        );
      } else {
        dispatch(addFlow(true, null, qs.parse(formData)));
      }
    } else {
      toast.error("Please fill all details...!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  async function fetchFlowById(flowId) {
    const fetchFlowResponse = await axiosRequest(
      "GET",
      "flows/" + flowId + "",
      true,
      null,
      null
    );
    if (fetchFlowResponse.status === 200) {
      const flow = fetchFlowResponse.data;
      setFlowName(flow.name);
      setEnabled(flow.enabled);
      setStyle(flow.style);
    }
  }

  function flowOperationSuccess() {
    if (
      props &&
      props.flows &&
      props.flows.status === "SUCCESS" &&
      props.flows.successMessage &&
      props.flows.successMessage !== ""
    ) {
      goToFlowList();
    }
  }

  useEffect(() => {
    setFlowId(props.match.params.id);
    if (flowId) {
      fetchFlowById(flowId);
    }
  }, [flowId]);

  useEffect(() => {
    flowOperationSuccess();
  }, [props.flows]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget title={flowId ? "Update Flow" : "New Flow"} disableWidgetMenu>
            <Box display={"flex"} flexDirection="column">
              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Flow Name</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="flowName"
                    value={flowName}
                    onChange={e => setFlowName(e.target.value)}
                    margin="normal"
                    placeholder="Enter Flow Name"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Style</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Input
                    id="style"
                    value={style}
                    onChange={e => setStyle(e.target.value)}
                    margin="normal"
                    placeholder="Set Style"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box display={"flex"} alignItems={"center"}>
                <Box width={300}>
                  <Typography variant={"h6"}>Enabled</Typography>
                </Box>
                <Box flexGrow={1}>
                  <Checkbox
                    className={"mt-2"}
                    checked={enabled}
                    onChange={e => setEnabled(e.target.checked)}
                  />
                </Box>
              </Box>

              <Box display={"flex"} alignItems={"center"}>
                <Button
                  variant={"contained"}
                  color={"success"}
                  style={{ marginRight: 8, marginTop: 15 }}
                  onClick={() => flowOperation()}
                >
                  {flowId ? "Update" : "Save"}
                </Button>
                <Button
                  variant={"contained"}
                  style={{ marginRight: 8, marginTop: 15 }}
                  onClick={() => {
                    goToFlowList();
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
  flowList: state.flows.flowList,
  flows: state.flows
});

export default connect(mapStateToProps, null)(CreateFlow);
