import React, { useEffect, Fragment } from "react";
import { Grid, Box, Tabs, Tab, AppBar } from "@material-ui/core";
import Input from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import SwipeableViews from "react-swipeable-views";
import {
  Phone as PhoneIcon,
  Autorenew as AutoRenewIcon,
  History as HistoryIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as AttachMoneyIcon,
  HelpOutline as HelpOutlineIcon,
  Gavel as GavelIcon,
  Block as BlockIcon,
  CancelScheduleSend as CancelScheduleSendIcon
} from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "./styles";
import { useDispatch, connect } from "react-redux";
import qs from "qs";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";

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

  // { name: "Don't Use It Enough", icon: 'history', enabled: true},
  // { name: 'Missing Features', icon: 'visibility_off', enabled: true},
  // { name: 'Too Expensive', icon: 'attach_money', enabled: true},
  // { name: 'Need More Help', icon: 'help_outline', enabled: true},
  // { name: 'Difficult to Set Up', icon: 'translate', enabled: true},
  // { name: 'Found a Better Solution', icon: 'find_replace', enabled: true},
  // { name: 'Outgrown this Solution', icon: 'timeline', enabled: true},
  // { name: 'Our Needs Have Changed', icon: 'icon-needs', enabled: true},
  // { name: 'Technical Issues', icon: 'icon-bugs', enabled: true},
  // { name: 'Bad Timing', icon: 'timer', enabled: true},
  // { name: 'Not Right For Me', icon: 'healing', enabled: true},
  // { name: 'Other', icon: 'highlight', enabled: true},
  // const reasonList = [
  //   {
  //     id: 1,
  //     name: "Don't Use It Enough",
  //     icon: <HistoryIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 2,
  //     name: "Missing Features",
  //     icon: <VisibilityOffIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 3,
  //     name: "Too Complex",
  //     icon: <GavelIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 4,
  //     name: "Couldn't Get Help",
  //     icon: <CancelScheduleSendIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 5,
  //     name: "Too Expensive",
  //     icon: <AttachMoneyIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 6,
  //     name: "Not Useful",
  //     icon: <BlockIcon className={classes.reasonIcon} />,
  //     value: false
  //   },
  //   {
  //     id: 7,
  //     name: "Need More Help",
  //     icon: <HelpOutlineIcon className={classes.reasonIcon} />,
  //     value: false
  //   }
  // ];
  const [iconValue, setIconValue] = React.useState(0);
  const [flow, setFlow] = React.useState({ flowName: "", enabled: false });
  const [formName, setFormName] = React.useState(formType[0].name);
  const [flowId, setFlowId] = React.useState(null);
  const [selectedStepId, setSelectedStepId] = React.useState(null);
  const user = isAuthenticated();
  const dispatch = useDispatch();
  const [intro, setIntro] = React.useState({
    enabled: false,
    title: "",
    description: "",
    form_type: "",
    dismiss_text: "",
    next_text: ""
  });
  const [reason, setReason] = React.useState({
    enabled: false,
    title: "",
    form_type: "",
    description: "",
    dismiss_text: "",
    lists: []
  });
  const [selectedReasonIconList, setSelectedReasonIconList] = React.useState(
    []
  );

  const [feedBack, setFeedBack] = React.useState({
    enabled: false,
    title: "",
    description: "",
    form_type: "",
    dismiss_text: "",
    next_text: "",
    question: ""
  });
  const [confirm, setConfirm] = React.useState({
    enabled: false,
    title: "",
    description: "",
    form_type: "",
    termsAndCondition: "",
    termsAndConditionChecked: false,
    dismiss_text: "",
    next_text: ""
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
      dispatch(setSelectedFlow(flow));
      setSelectedStepId(flow.steps[0].id);
    }
  }

  function setFormValue(flow) {
    if (Object.keys(flow).length !== 0) {
      const stepIntro = flow.steps[0];
      const stepReason = flow.steps[1];
      const stepFeedBack = flow.steps[2];
      const stepConfirm = flow.steps[3];
      setFlow({ flowName: flow.name, enabled: flow.enabled });
      setIntro({
        enabled: stepIntro.enabled ? stepIntro.enabled : false,
        title: stepIntro.title ? stepIntro.title : "",
        form_type: stepIntro.form_type ? stepIntro.form_type : "",
        description: stepIntro.description ? stepIntro.description : "",
        dismiss_text: stepIntro.dismiss_text ? stepIntro.dismiss_text : "",
        next_text: stepIntro.next_text ? stepIntro.next_text : ""
      });
      setReason({
        enabled: stepReason.enabled ? stepReason.enabled : false,
        title: stepReason.title ? stepReason.title : "",
        form_type: stepReason.form_type ? stepReason.form_type : "",
        description: stepReason.description ? stepReason.description : "",
        dismiss_text: stepReason.dismiss_text ? stepReason.dismiss_text : "",
        lists: stepReason.step_reasons ? stepReason.step_reasons : []
      });
      const selectedReasonList = [];
      stepReason.step_reasons.map(list => {
        return list.enabled
          ? selectedReasonList.push({ icon: list.icon, name: list.name })
          : selectedReasonIconList;
      });
      setSelectedReasonIconList(selectedReasonList);
      setFeedBack({
        enabled: stepFeedBack.enabled ? stepFeedBack.enabled : false,
        title: stepFeedBack.title ? stepFeedBack.title : "",
        description: stepFeedBack.description ? stepFeedBack.description : "",
        form_type: stepFeedBack.form_type ? stepFeedBack.form_type : "",
        dismiss_text: stepFeedBack.dismiss_text
          ? stepFeedBack.dismiss_text
          : "",
        next_text: stepFeedBack.next_text ? stepFeedBack.next_text : ""
      });
      setConfirm({
        ...confirm,
        enabled: stepConfirm.enabled ? stepConfirm.enabled : false,
        title: stepConfirm.title ? stepConfirm.title : "",
        description: stepConfirm.description ? stepConfirm.description : "",
        form_type: stepConfirm.form_type ? stepConfirm.form_type : "",
        dismiss_text: stepConfirm.dismiss_text ? stepConfirm.dismiss_text : "",
        next_text: stepConfirm.next_text ? stepConfirm.next_text : ""
      });
    }
  }

  function flowOperationSuccess() {
    if (props && props.flows && props.flows.status === "SUCCESS") {
      // toast.success(props.flows.successMessage);
      setFormValue(props.flows.selectedFlow);
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
    setSelectedStepId(props.selectedFlow.steps[newValue].id);
  }

  function setValue(event, step, setStep) {
    setStep({
      ...step,
      [event.target.id]:
        event.target.id === "enabled" ||
        event.target.id === "termsAndConditionChecked"
          ? event.target.checked
          : event.target.value
    });
  }
  function handleChangeIndexIconTab(index) {
    setIconValue(index);
  }

  function saveFlow() {
    const company_id = user.company_id;
    const formData = {
      "flow[name]": flow.flowName,
      "flow[enabled]": flow.enabled,
      "flow[company_id]": company_id
    };
    dispatch(updateFlow(true, flowId, null, qs.parse(formData)));
  }

  function saveStep(event) {
    const controlId = event.target.id;
    const controlValue =
      event.target.id === "enabled" ||
      event.target.id === "termsAndConditionChecked"
        ? event.target.checked
        : event.target.value;
    const formData = new FormData();
    formData.append(`steps[name]`, formName);
    formData.append(`steps[${controlId}]`, controlValue);
    dispatch(
      updateFlowStep(true, selectedStepId, iconValue, null, null, formData)
    );
  }

  function selectingReason(reasonIndex, reasonId, event) {
    const stepReason = {
      id: reasonId,
      enabled: event.target.checked
    };
    const formData = {
      "steps[step_reasons_attributes]": stepReason
    };
    dispatch(
      updateFlowStep(
        true,
        selectedStepId,
        iconValue,
        reasonIndex,
        null,
        qs.parse(formData)
      )
    );
    // const lists = reason.lists.slice();
    // lists[reasonIndex].enabled = event.target.checked;
    // const selectedReasonList = [];
    // lists.map(list => {
    //   return list.enabled
    //     ? selectedReasonList.push({ icon: list.icon, name: list.name })
    //     : selectedReasonIconList;
    // });
    // setReason({ ...reason, lists });
    // setSelectedReasonIconList(selectedReasonList);
  }

  return (
    <Grid container spacing={6}>
      <Grid item md={6}>
        <Widget title="Widget Customization" disableWidgetMenu inheritHeight>
          <Grid item container alignItems={"center"} className={"mt-4 mb-5"}>
            <Grid item xs={4}>
              <Typography variant={"body1"}>Name</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                id="flowName"
                style={{ width: "100%" }}
                value={flow.flowName}
                type={"text"}
                onChange={e => setValue(e, flow, setFlow)}
                onBlur={saveFlow}
              />
            </Grid>

            <Grid item xs={4} className={"mt-3"}>
              <Typography variant={"body1"}>Enabled</Typography>
            </Grid>
            <Grid item xs={8} className={"mt-3"}>
              <Switch
                id="enabled"
                checked={flow.enabled}
                onChange={e => setValue(e, flow, setFlow)}
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
                    onChange={e => setValue(e, intro, setIntro)}
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
                    onChange={e => setValue(e, intro, setIntro)}
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
                    onChange={e => setValue(e, intro, setIntro)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Dismiss Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="dismiss_text"
                    style={{ width: "100%" }}
                    value={intro.dismiss_text}
                    type={"text"}
                    onChange={e => setValue(e, intro, setIntro)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Proceed Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="next_text"
                    style={{ width: "100%" }}
                    value={intro.next_text}
                    type={"text"}
                    onChange={e => setValue(e, intro, setIntro)}
                    onBlur={saveStep}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={iconValue} index={1} dir={theme.direction}>
              <Grid container alignItems={"center"} className={"mt-4 mb-5"}>
                <Grid item xs={4} className={"mt-4"}>
                  <Typography variant={"body1"}>Enabled</Typography>
                </Grid>
                <Grid item xs={8} className={"mt-4"}>
                  <Switch
                    id="enabled"
                    checked={reason.enabled}
                    onChange={e => setValue(e, reason, setReason)}
                    color="primary"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Title</Typography>
                </Grid>
                <Grid item xs={8} className={"mt-3"}>
                  <Input
                    id="title"
                    style={{ width: "100%" }}
                    value={reason.title}
                    type={"text"}
                    onChange={e => setValue(e, reason, setReason)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-4"}>
                  <Typography variant={"body1"}>Description</Typography>
                </Grid>
                <Grid item xs={8} className={"mt-4"}>
                  <TextareaAutosize
                    id="description"
                    style={{ width: "100%" }}
                    value={reason.description}
                    onChange={e => setValue(e, reason, setReason)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Dismiss Button</Typography>
                </Grid>
                <Grid item xs={8} className={"mt-3"}>
                  <Input
                    id="dismiss_text"
                    style={{ width: "100%" }}
                    value={reason.dismiss_text}
                    type={"text"}
                    onChange={e => setValue(e, reason, setReason)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={12} className={"mt-3"}>
                  <Divider />
                </Grid>
                {reason.lists &&
                  reason.lists.map((list, reasonIndex) => {
                    return (
                      <Grid container key={reasonIndex} className={"mt-3"}>
                        <Grid item xs={1} className={"mt-2"}>
                          <Checkbox
                            id={"reason" + reasonIndex}
                            color="primary"
                            checked={list.enabled}
                            onChange={e =>
                              selectingReason(reasonIndex, list.id, e)
                            }
                          />
                        </Grid>
                        <Grid item xs={2} className={"mt-3"}>
                          <AutoRenewIcon />
                        </Grid>
                        <Grid item xs={4} className={"mt-3"}>
                          {list.name}
                        </Grid>
                      </Grid>
                    );
                  })}
              </Grid>
            </TabPanel>
            <TabPanel value={iconValue} index={2} dir={theme.direction}>
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
                    checked={feedBack.enabled}
                    onChange={e => setValue(e, feedBack, setFeedBack)}
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
                    value={feedBack.title}
                    type={"text"}
                    onChange={e => setValue(e, feedBack, setFeedBack)}
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
                    value={feedBack.description}
                    onChange={e => setValue(e, feedBack, setFeedBack)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Dismiss Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="dismiss_text"
                    style={{ width: "100%" }}
                    value={feedBack.dismiss_text}
                    type={"text"}
                    onChange={e => setValue(e, feedBack, setFeedBack)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Proceed Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="next_text"
                    style={{ width: "100%" }}
                    value={feedBack.next_text}
                    type={"text"}
                    onChange={e => setValue(e, feedBack, setFeedBack)}
                    onBlur={saveStep}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={iconValue} index={3} dir={theme.direction}>
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
                    checked={confirm.enabled}
                    onChange={e => setValue(e, confirm, setConfirm)}
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
                    value={confirm.title}
                    type={"text"}
                    onChange={e => setValue(e, confirm, setConfirm)}
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
                    value={confirm.description}
                    onChange={e => setValue(e, confirm, setConfirm)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-4"}>
                  <Typography variant={"body1"}>Terms & conditions</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-4"}>
                  <TextareaAutosize
                    id="termsAndCondition"
                    style={{ width: "100%" }}
                    value={confirm.termsAndCondition}
                    onChange={e => setValue(e, confirm, setConfirm)}
                    className={classes.textAreaBorder}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Dismiss Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="dismiss_text"
                    style={{ width: "100%" }}
                    value={confirm.dismiss_text}
                    type={"text"}
                    onChange={e => setValue(e, confirm, setConfirm)}
                    onBlur={saveStep}
                  />
                </Grid>
                <Grid item xs={4} className={"mt-3"}>
                  <Typography variant={"body1"}>Proceed Button</Typography>
                </Grid>
                <Grid xs={8} item className={"mt-3"}>
                  <Input
                    id="next_text"
                    style={{ width: "100%" }}
                    value={confirm.next_text}
                    type={"text"}
                    onChange={e => setValue(e, confirm, setConfirm)}
                    onBlur={saveStep}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </SwipeableViews>
        </Widget>
      </Grid>

      <Grid item xs={6}>
        <Widget title="Widget Preview" disableWidgetMenu inheritHeight>
          <Widget className={classes.paper} disableWidgetMenu>
            {iconValue === 0 && (
              <Fragment>
                <Typography className={classes.widgetTitle + " mb-5"}>
                  {intro.title}
                </Typography>
                <Typography className={classes.widgetDescription + " mb-3"}>
                  {intro.description}
                </Typography>
                <Box display="flex" justifyContent={"space-between"}>
                  {intro.dismiss_text && (
                    <Box m={1}>
                      <Button>{intro.dismiss_text}</Button>
                    </Box>
                  )}
                  {intro.next_text && (
                    <Box m={1}>
                      <Button variant={"contained"} color={"success"}>
                        {intro.next_text}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fragment>
            )}

            {iconValue === 1 && (
              <Fragment>
                <Typography className={classes.widgetTitle + " mb-5"}>
                  {reason.title}
                </Typography>
                <Typography className={classes.widgetDescription + " mb-4"}>
                  {reason.description}
                </Typography>
                <Grid container alignItems="center" justify="center">
                  {selectedReasonIconList &&
                    selectedReasonIconList.map((list, iconIndex) => {
                      return (
                        <Grid
                          item
                          // xs={3}
                          className={"mr-2"}
                          key={iconIndex}
                        >
                          <Typography
                            style={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center"
                            }}
                          >
                            {list.icon === "history" && (
                              <HistoryIcon className={classes.reasonIcon} />
                            )}
                            {list.icon === "visibility_off" && (
                              <VisibilityOffIcon
                                className={classes.reasonIcon}
                              />
                            )}
                            {list.icon === "attach_money" && (
                              <AttachMoneyIcon className={classes.reasonIcon} />
                            )}
                            {list.icon === "help_outline" && (
                              <HelpOutlineIcon className={classes.reasonIcon} />
                            )}
                          </Typography>
                          <Typography className={"mt-1"}>
                            {list.name}
                          </Typography>
                        </Grid>
                      );
                    })}
                </Grid>
                <Box
                  display="flex"
                  justifyContent={"center"}
                  className={"mt-3"}
                >
                  {reason.dismiss_text && (
                    <Box m={1}>
                      <Button>{reason.dismiss_text}</Button>
                    </Box>
                  )}
                </Box>
              </Fragment>
            )}

            {iconValue === 2 && (
              <Fragment>
                <Typography className={classes.widgetTitle + " mb-4"}>
                  {feedBack.title}
                </Typography>
                <Typography className={classes.widgetDescription + " mb-3"}>
                  {feedBack.description}
                </Typography>
                {feedBack.description && (
                  <div className="mb-3">
                    <TextareaAutosize
                      id="question"
                      className={classes.feedBackQuestionBorder}
                      value={feedBack.question}
                      onChange={e => setValue(e, feedBack, setFeedBack)}
                    />
                  </div>
                )}
                <Box display="flex" justifyContent={"center"}>
                  {feedBack.dismiss_text && (
                    <Box m={1}>
                      <Button>{feedBack.dismiss_text}</Button>
                    </Box>
                  )}
                  {feedBack.next_text && (
                    <Box m={1}>
                      <Button variant={"contained"} color={"success"}>
                        {feedBack.next_text}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fragment>
            )}

            {iconValue === 3 && (
              <Fragment>
                <Typography className={classes.widgetTitle + " mb-4"}>
                  {confirm.title}
                </Typography>
                <Typography className={classes.widgetDescription + " mb-3"}>
                  {confirm.description}
                </Typography>
                {confirm.description && confirm.termsAndCondition && (
                  <Divider className="mb-3" />
                )}
                <Grid container>
                  <Grid item xs={1}>
                    {confirm.termsAndCondition && (
                      <Checkbox
                        id="termsAndConditionChecked"
                        checked={confirm.termsAndConditionChecked}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                        onChange={e => setValue(e, confirm, setConfirm)}
                        className={"mr-2"}
                      />
                    )}
                  </Grid>
                  <Grid item xs={11} className={"mt-2"}>
                    <Typography>{confirm.termsAndCondition}</Typography>
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent={"center"}>
                  {confirm.dismiss_text && (
                    <Box m={1}>
                      <Button>{confirm.dismiss_text}</Button>
                    </Box>
                  )}
                  {confirm.next_text && (
                    <Box m={1}>
                      <Button variant={"contained"} color={"success"}>
                        {confirm.next_text}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fragment>
            )}
          </Widget>
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
