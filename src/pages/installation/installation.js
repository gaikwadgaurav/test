import React, { Fragment } from "react";
import {
  Grid,
  Box,
  Tabs,
  Tab,
  AppBar,
  Select,
  MenuItem
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Widget from "../../components/Widget";
import { Typography, Button } from "../../components/Wrappers";
import useStyles from "../widget/styles";
import Code from "../../components/Code";
import { isAuthenticated } from "../../common/isAuthenticated";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

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

export default function Installation(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [option, setOption] = React.useState(0);
  const user = isAuthenticated();
  toast.configure({
    autoClose: 4000,
    draggable: true
  });
  const actions = [
    {
      id: 0,
      value: "Action"
    },
    {
      id: 1,
      value: "Another action"
    },
    {
      id: 2,
      value: "Something else here"
    },
    {
      id: 4,
      value: "Separated link"
    }
  ];

  const generateTokenCode = [
    {
      id: 0,
      value: `
      raaft_secret = "Action",
      subscription_id = "INSERT_SUBSCRIPTION_ID_HERE"

      OpenSSL::HMAC.hexdigest('sha256'
              raaft_secret,
              subscription_id
      )
  `
    },
    {
      id: 1,
      value: `
      raaft_secret = "Another action",
      subscription_id = "INSERT_SUBSCRIPTION_ID_HERE"

      OpenSSL::HMAC.hexdigest('sha256'
              raaft_secret,
              subscription_id
      )
  `
    },
    {
      id: 2,
      value: `
      raaft_secret = "Something else here",
      subscription_id = "INSERT_SUBSCRIPTION_ID_HERE"

      OpenSSL::HMAC.hexdigest('sha256'
              raaft_secret,
              subscription_id
      )
  `
    },
    {
      id: 4,
      value: `
      raaft_secret = "Separated link",
      subscription_id = "INSERT_SUBSCRIPTION_ID_HERE"

      OpenSSL::HMAC.hexdigest('sha256'
              raaft_secret,
              subscription_id
      )
  `
    }
  ];

  const flowCode = `
      <button onClick="raaft('startCancelFlow', {
            authKey: '<insert-security-token>'      //generated in step 2
            subscriptionId: '<insert-subscription-id>'
      });">Cancel My Account</button>
                      `;
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeSelection(e) {
    setOption(e.target.value);
  }

  return (
    <Grid item md={10}>
      <Widget title="Installation Instructions" disableWidgetMenu inheritHeight>
        <AppBar position="static" color="default" style={{ marginTop: 10 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="1.EMBED CODE" {...a11yProps(0)} />
            <Tab label="2.GENERATE TOKENS" {...a11yProps(1)} />
            <Tab label="3.INITIALIZE FLOW" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Code>
            {`
  <script src="http://localhost:3005/widget/v1/load.js" id="churnLoader"></script>
  <script>
  if (window.ChurnAI) {
    window.ChurnAI.config({
      appId: ${10},                                  //*  App ID provided by ChurnAI
      firstName: ${
        user && user.first_name
      },                           //   Users' First Name
      lastName: ${
        user && user.last_name
      },                              //   Users' Last Name
      email: ${user && user.email},                          //* Users' email address
      account: {
        companyName: ${
          user && user.company_name
        },                  // * Display name of company for end-user facing content
        companyDomain: "acme.com",              //   Used for display and data enrichment
        companyId: ${
          user && user.company_id
        },                          // * Unique company ID
        billingId: "091029130892",              //   Your user's billing ID used in your billing system
        plan: "enterprise",                     //   Plan type name used in your billing system
        value: 1000.0,                          //   Subscription revenue value (monthly or annual)
        createdAt: 1312182000,                  //   Timestamp of account created date
      },
      custom: {
        plan_name: "Platinum",                  //   custom variable 1
        storage_capacity: 15,                   //   custom variable 2
      },
    });
  }
</script>
 `}
          </Code>
          <Box display="flex" justifyContent={"flex-end"}>
            <Box m={1}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => setValue(value + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <span>
            Select your server side language to see example code.Use token in
            step 3.
          </span>
          <Grid item container alignItems={"center"} className="mb-5 mt-2">
            <Select
              id="demo-simple-select"
              value={option}
              onChange={handleChangeSelection}
            >
              {actions.map(c => (
                <MenuItem value={c.id} key={c.id}>
                  {c.value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {generateTokenCode.map(c => {
            if (option === c.id) {
              return (
                <div key={c.id}>
                  <Code>{c.value}</Code>
                  <CopyToClipboard
                    text={c.value}
                    onCopy={() => toast.success("Code copied to clipboard!")}
                  >
                    <span className={classes.pointer}>Copy Code</span>
                  </CopyToClipboard>
                </div>
              );
            }
          })}
          <Box display="flex" justifyContent={"flex-end"}>
            <Box m={1}>
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => setValue(value - 1)}
              >
                Back
              </Button>
            </Box>
            <Box m={1}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => setValue(value + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <span>
            To present the flow to your user,call the 'startCancelFlow'
            javascript action as shown in the example below.For more detail on
            initializing your flow,visit our{" "}
            <u className={classes.pointer}>help center</u>.
          </span>
          <Code>{flowCode}</Code>
          <CopyToClipboard
            text={flowCode}
            onCopy={() => toast.success("Code copied to clipboard!")}
          >
            <span className={classes.pointer}>Copy Code</span>
          </CopyToClipboard>
          <Box display="flex" justifyContent={"flex-end"}>
            <Box m={1}>
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => setValue(value - 1)}
              >
                Back
              </Button>
            </Box>
            <Box m={1}>
              <Button variant={"contained"} color={"primary"}>
                Done
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Widget>
    </Grid>
  );
}
