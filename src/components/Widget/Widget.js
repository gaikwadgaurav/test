import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TextField as Input,
  InputAdornment,
  Box
} from "@material-ui/core";
import { MoreVert as MoreIcon, Search as SearchIcon } from "@material-ui/icons";
import classnames from "classnames";
import { useDispatch } from "react-redux";

//components
import { Typography } from "../../components/Wrappers";

// styles
import useStyles from "./styles";
import { filterInvitedUserList } from "../../Redux/_actions/user.action";
import { filterVariableList } from "../../Redux/_actions/variable.action";
import { filterRetentionFlowList } from "../../Redux/_actions/flow.action";

export default function Widget({
  children,
  title,
  subtitle,
  noBodyPadding,
  bodyClass,
  disableWidgetMenu,
  header,
  inheritHeight,
  searchField,
  filterType,
  className,
  style,
  ...props
}) {
  var classes = useStyles(props);

  // local
  var [moreButtonRef, setMoreButtonRef] = useState(null);
  var [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  const dispatch = useDispatch();

  function filterSearch(value) {
    switch (filterType) {
      case "invitedUserListTable":
        dispatch(filterInvitedUserList(value));
        break;
      case "variableListTable":
        dispatch(filterVariableList(value));
        break;
      case "retentionFlowsTable":
        dispatch(filterRetentionFlowList(value));
        break;

      default:
        break;
    }
  }
  return (
    <div
      className={classnames(
        {
          [classes.inheritHeight]: inheritHeight,
          [classes.widgetWrapper]: !inheritHeight
        },
        className
      )}
      style={style}
    >
      <Paper
        className={classnames(classes.paper, {
          [props.className]: props.className
        })}
        classes={{ root: classes.widgetRoot }}
      >
        {!title ? (
          <>
            {header ? (
              <div className={classes.widgetHeader}>{header}</div>
            ) : null}
          </>
        ) : (
          <div className={classes.widgetHeader}>
            <React.Fragment>
              <Box display={"flex"}>
                <Typography
                  variant="h6"
                  color="text"
                  colorBrightness={"secondary"}
                >
                  {title}
                </Typography>
                <Box alignSelf={"flex-end"} ml={1}>
                  <Typography
                    color="text"
                    colorBrightness={"hint"}
                    variant={"caption"}
                  >
                    {subtitle}
                  </Typography>
                </Box>
              </Box>
              {searchField && (
                <Input
                  id="search-field"
                  className={classes.textField}
                  label="Search"
                  margin="dense"
                  variant="outlined"
                  onChange={e => filterSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className={classes.searchIcon} />
                      </InputAdornment>
                    )
                  }}
                />
              )}
              {!disableWidgetMenu && (
                <IconButton
                  color="primary"
                  classes={{ root: classes.moreButton }}
                  aria-owns="widget-menu"
                  aria-haspopup="true"
                  onClick={() => setMoreMenuOpen(true)}
                  buttonRef={setMoreButtonRef}
                >
                  <MoreIcon />
                </IconButton>
              )}
            </React.Fragment>
          </div>
        )}
        <div
          className={classnames(classes.widgetBody, {
            [classes.noPadding]: noBodyPadding,
            [classes.paddingTop]: !title && !noBodyPadding,
            [bodyClass]: bodyClass
          })}
        >
          {children}
        </div>
      </Paper>
      <Menu
        id="widget-menu"
        open={isMoreMenuOpen}
        anchorEl={moreButtonRef}
        onClose={() => setMoreMenuOpen(false)}
        disableAutoFocusItem
      >
        <MenuItem>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Copy</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Delete</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Print</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
