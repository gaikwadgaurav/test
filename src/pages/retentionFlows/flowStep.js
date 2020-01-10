import React, { useEffect } from "react";
import { Grid, Box, Tabs, Tab, AppBar } from "@material-ui/core";
import Input from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import SwipeableViews from "react-swipeable-views";
import { Phone as PhoneIcon } from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "./styles";
import { useDispatch, connect } from "react-redux";
import qs from "qs";

// components
import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { isAuthenticated } from "../../common/isAuthenticated";
import { axiosRequest } from "../../Redux/_requests";
import {
  updateFlow,
  clearFlowStateMsg,
  setSelectedFlow,
  updateFlowStep
} from "../../Redux/_actions/flow.action";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const FlowStep = props => {
  const theme = useTheme();
  const classes = useStyles();
  const formType = [
    {
      index: 0,
      name: "Intro"
    },
    {
      index: 1,
      name: "Reasons"
    },
    {
      index: 2,
      name: "Feedback"
    },
    {
      index: 3,
      name: "Confirm"
    }
  ];
  const [iconValue, setIconValue] = React.useState(0);
  const [flow, setFlow] = React.useState({ flowName: "", flowEnabled: false });
  const [formName, setFormName] = React.useState(formType[0].name);
  const [flowId, setFlowId] = React.useState(null);
  const user = isAuthenticated();
  const dispatch = useDispatch();
  const [intro, setIntro] = React.useState({
    enabled: false,
    title: "",
    description: "",
    dismissBtn: "",
    proceedBtn: ""
  });
  toast.configure({
    autoClose: 5000,
    draggable: true
  });

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
      const stepIntro = fetchFlowResponse.data.steps[0];
      dispatch(setSelectedFlow(flow));
      setFlow({ flowName: flow.name, flowEnabled: flow.enabled });
      setIntro({
        enabled: stepIntro.enabled ? stepIntro.enabled : false,
        title: stepIntro.title ? stepIntro.title : "",
        description: stepIntro.description ? stepIntro.description : "",
        dismissBtn: stepIntro.dismiss_text ? stepIntro.dismiss_text : "",
        proceedBtn: stepIntro.next_text ? stepIntro.next_text : ""
      });
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
      // toast.success(props.flows.successMessage);
      dispatch(clearFlowStateMsg());
    } else if (
      props &&
      props.flows &&
      props.flows.status === "FAILED" &&
      props.flows.errorMessage &&
      props.flows.errorMessage !== ""
    ) {
      toast.error(props.flows.errorMessage);
      dispatch(clearFlowStateMsg());
    }
  }

  useEffect(() => {
    flowOperationSuccess();
  }, [props.flows]);

  useEffect(() => {
    setFlowId(props.match.params.id);
    if (flowId) {
      fetchFlowById(flowId);
    }
  }, [flowId]);

  function handleChangeIconTab(event, newValue) {
    setIconValue(newValue);
    setFormName(formType[newValue].name);
  }

  function setFlowValue(event) {
    setFlow({
      ...flow,
      [event.target.id]:
        event.target.id === "flowEnabled"
          ? event.target.checked
          : event.target.value
    });
  }

  function setIntroValue(event) {
    setIntro({
      ...intro,
      [event.target.id]:
        event.target.id === "enabled"
          ? event.target.checked
          : event.target.value
    });
  }

  function handleChangeIndexIconTab(index) {
    setIconValue(index);
  }

  function saveFlow(event) {
    const company_id = user.company_id;
    const formData = {
      "flow[name]": flow.flowName,
      "flow[enabled]": flow.flowEnabled,
      "flow[company_id]": company_id
    };
    dispatch(updateFlow(true, flowId, null, qs.parse(formData)));
  }

  function saveStep(event) {
    if (event.target.value) {
      const stepId = props.selectedFlow.steps[0].id;
      const formData = {
        "steps[name]": formName,
        "steps[enabled]": intro.enabled,
        "steps[title]": intro.title,
        "steps[description]": intro.description,
        "steps[next_text]": intro.proceedBtn,
        "steps[dismiss_text]": intro.dismissBtn
      };
      dispatch(
        updateFlowStep(true, stepId, iconValue, null, qs.parse(formData))
      );
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item md={6}>
        <Widget title="Widget Customization" disableWidgetMenu inheritHeight>
          <Grid item container alignItems={"center"} className={"mt-4 mb-5"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Name</Typography>
            </Grid>
            <Grid xs={8} item>
              <Input
                id="flowName"
                style={{ width: "100%" }}
                value={flow.flowName}
                type={"text"}
                onChange={e => setFlowValue(e)}
                onBlur={saveFlow}
              />
            </Grid>

            <Grid item xs={4} className={"mt-3"}>
              <Typography variant={"body1"}>Enabled</Typography>
            </Grid>
            <Grid xs={8} item className={"mt-3"}>
              <Switch
                id="flowEnabled"
                checked={flow.flowEnabled}
                onChange={e => setFlowValue(e)}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                onBlur={saveFlow}
              />
            </Grid>
          </Grid>
          <AppBar position="static" color="default" style={{ marginTop: 10 }}>
            <Tabs
              value={iconValue}
              onChange={handleChangeIconTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {formType &&
                formType.map(form => {
                  return (
                    <Tab
                      key={form.index}
                      label={form.name}
                      icon={<PhoneIcon />}
                      {...a11yProps(form.index)}
                    />
                  );
                })}
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={iconValue}
            onChangeIndex={handleChangeIndexIconTab}
          >
            <TabPanel value={iconValue} index={0} dir={theme.direction}>
              <Grid
                item
                container
                alignItems={"center"}
                className={"mt-4 mb-5"}
              >
                <Grid item xs={4} className={"mt-4"}>
                  <Typography variant={"body1"}>Enabled</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-4"}>
                  <Switch
                    id="enabled"
                    checked={intro.enabled}
                    onChange={e => setIntroValue(e)}
                    color="primary"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Title</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="title"
                    style={{ width: "100%" }}
                    value={intro.title}
                    type={"text"}
                    onChange={e => setIntroValue(e)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-4"}>
                  <Typography variant={"body1"}>Description</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-4"}>
                  <TextareaAutosize
                    id="description"
                    style={{ width: "100%" }}
                    value={intro.description}
                    onChange={e => setIntroValue(e)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Dismiss Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="dismissBtn"
                    style={{ width: "100%" }}
                    value={intro.dismissBtn}
                    type={"text"}
                    onChange={e => setIntroValue(e)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Proceed Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="proceedBtn"
                    style={{ width: "100%" }}
                    value={intro.proceedBtn}
                    type={"text"}
                    onChange={e => setIntroValue(e)}
                    onBlur={saveStep}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={iconValue} index={1} dir={theme.direction}>
              Why don't use Lore Ipsum? I think if some one says don't use lore
              ipsum it's very controversial point. I think the opposite
              actually. Everyone knows what is lore ipsum - it is easy to
              understand if text is lore ipsum.
            </TabPanel>
            <TabPanel value={iconValue} index={2} dir={theme.direction}>
              If you will think too much it will sink in the swamp of never
              implemented plans and ideas or will just go away or will be
              implemented by someone else. 5 months of doing everything to
              achieve nothing. You'll automatically skip - because you know -
              it's just non-informative stub. But what if there some text like
              this one?
            </TabPanel>
            <TabPanel value={iconValue} index={3} dir={theme.direction}>
              If you will think too much it will sink in the swamp of never
              implemented plans and ideas or will just go away or will be
              implemented by someone else. 5 months of doing everything to
              achieve nothing. You'll automatically skip - because you know -
              it's just non-informative stub. But what if there some text like
              this one?
            </TabPanel>
          </SwipeableViews>
        </Widget>
      </Grid>
      <Grid item xs={6}>
        <Widget title="Widget Preview" disableWidgetMenu inheritHeight>
          {iconValue === 0 && (
            <Widget className={classes.paper} disableWidgetMenu>
              <div>
                <div className={classes.widgetTitle + " mb-5"}>
                  {intro.title}
                </div>
                <div className={classes.widgetDescription + " mb-3"}>
                  {intro.description}
                </div>
                <Box display="flex" justifyContent={"space-between"}>
                  {intro.dismissBtn && (
                    <Box m={1}>
                      <Button>{intro.dismissBtn}</Button>
                    </Box>
                  )}
                  {intro.proceedBtn && (
                    <Box m={1}>
                      <Button variant={"contained"} color={"success"}>
                        {intro.proceedBtn}
                      </Button>
                    </Box>
                  )}
                </Box>
              </div>
            </Widget>
          )}
        </Widget>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = state => ({
  flowList: state.flows.flowList,
  flows: state.flows,
  selectedFlow: state.flows.selectedFlow
});

export default connect(mapStateToProps, null)(FlowStep);
