import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  expansion: {
    backgroundColor: theme.palette.primary.light,
    color: "white "
  },
  textAreaBorder: {
    borderWidth: "0 0 1px",
    "&:focus": {
      outline: "none"
    }
  },
  paper: {
    margin: "24px 0",
    backgroundColor: "#f3f3f3"
  },
  widgetTitle: {
    fontWeight: 800,
    fontSize: "25px",
    textAlign: "center"
  },
  widgetDescription:{
    fontWeight: 400,
    fontSize: "16px",
  }
}));
