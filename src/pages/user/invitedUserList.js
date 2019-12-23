import React, { useEffect } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableHead,
  IconButton,
  Checkbox,
  TableSortLabel,
  Tooltip,
  Toolbar,
  Box
} from "@material-ui/core";
import { useDispatch } from "react-redux";
// Material UI icons
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from "@material-ui/icons";
// import { yellow } from "@material-ui/core/colors";
import { lighten, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import useStyles from "../ecommerce/styles";
import { Link } from "react-router-dom";
import cn from "classnames";
import qs from "qs";

// components
import Widget from "../../components/Widget";
// import Dot from "../../components/Sidebar/components/Dot";
import { Typography, Button } from "../../components/Wrappers";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { fetchInvitedUsers } from "../../Redux/_actions/user.action";
import { axiosRequest } from "../../Redux/_requests";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "ID"
  },
  { id: "name", numeric: true, disablePadding: false, label: "User Name" },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email"
  },
  { id: "reSend", numeric: true, disablePadding: false, label: "Re-Send" },
  { id: "delete", numeric: true, disablePadding: false, label: "Delete" }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = ({ dispatch, selected, numSelected }) => {
  const classes = useToolbarStyles();

  // const holders = useSelector(variables);
  return (
    <Toolbar
      className={cn(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
      style={{ marginTop: 8 }}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Users
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => multiUserDeletion(selected, dispatch)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const sweetAlert = (text, buttonText) => {
  return Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    animation: false,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: buttonText
  });
};

const multiUserDeletion = (selected, dispatch) => {
  if (selected) {
    const text = "You want to delete users!";
    const buttonText = "Yes, delete it!";
    let formData = new FormData();
    if (selected.length) {
      selected.map(select => {
        return formData.append("ids[]", select);
      });

      sweetAlert(text, buttonText).then(result => {
        if (result.value) {
          //   dispatch(deleteVariable(true, selected, null, formData));
        }
      });
    }
  }
};

export function InvitedUserList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  const users = props && props.invitedUsersList;
  toast.configure({
    autoClose: 4000,
    draggable: true
  });

  function fetchInvitedUserList() {
    dispatch(fetchInvitedUsers(true, null, null));
  }

  function goToUserInvitation() {
    props.history.push("/invite-user");
  }

  async function inviteUser(index) {
    if (index > -1) {
      const invitedUser = users && users[index];
      if (invitedUser) {
        const formData = {
          "user_invitation[email]": invitedUser.email,
          "user_invitation[name]": invitedUser.name
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
  }

  function showDeletePopUp(userId) {
    if (userId) {
      const text = "You want to delete user!";
      const buttonText = "Yes, delete it!";
      sweetAlert(text, buttonText).then(result => {
        //   if (result.value) {
        //     dispatch(deleteVariable(true, variableIds, null, formData));
        //   }
      });
    }
  }

  function sweetAlert(text, buttonText) {
    return Swal.fire({
      title: "Are you sure?",
      text,
      icon: "warning",
      animation: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: buttonText
    });
  }

  //   function variableOperationSuccess() {
  //     if (
  //       props &&
  //       props.variables &&
  //       (props.variables.status === "SUCCESS" ||
  //         props.variables.status === "DELETE_SUCCESS") &&
  //       props.variables.successMessage &&
  //       props.variables.successMessage !== ""
  //     ) {
  //       toast.success(props.variables.successMessage);
  //       dispatch(clearMsgForVariable());
  //       setSelected([]);
  //     }
  //     if (
  //       props &&
  //       props.variables &&
  //       props.variables.status === "FAILED" &&
  //       props.variables.errorMessage &&
  //       props.variables.errorMessage !== ""
  //     ) {
  //       toast.error(props.variables.errorMessage);
  //       dispatch(clearMsgForVariable());
  //     }
  //   }

  useEffect(() => {
    fetchInvitedUserList(props);
  }, []);

  //   useEffect(() => {
  //     variableOperationSuccess();
  //   }, [props && props.variables]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = users.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  const type = "invitedUserListTable";
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget
            title="List of Users"
            subtitle={`(${users.length} total)`}
            disableWidgetMenu
            searchField
            filterType={type}
          >
            <Box display="flex" justifyContent={"flex-end"}>
              <Box m={1}>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={goToUserInvitation}
                >
                  Invite User
                </Button>
              </Box>
            </Box>
            <EnhancedTableToolbar
              numSelected={selected.length}
              selected={selected}
              dispatch={dispatch}
            />
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={users.length}
                />

                <TableBody>
                  {users && users.length
                    ? stableSort(users, getSorting(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((user, userIndex) => {
                          const isItemSelected = isSelected(user.id);
                          const labelId = `enhanced-table-checkbox-${userIndex}`;

                          return (
                            <TableRow
                              hover
                              // onClick={event => handleClick(event, variable.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              key={user.id}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={event =>
                                    handleClick(event, user.id)
                                  }
                                  inputProps={{ "aria-labelledby": labelId }}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {user.id}
                              </TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Box display={"flex"} alignItems={"center"}>
                                  <Button
                                    color="success"
                                    size="small"
                                    className={"mr-2"}
                                    variant="contained"
                                    onClick={() => inviteUser(userIndex)}
                                  >
                                    Re-send
                                  </Button>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display={"flex"} alignItems={"center"}>
                                  <Button
                                    color="secondary"
                                    size="small"
                                    variant="contained"
                                    onClick={() => showDeletePopUp(user.id)}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : null}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "previous page"
              }}
              nextIconButtonProps={{
                "aria-label": "next page"
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

const mapStateToProps = state => ({
  invitedUsersList: state.userData.invitedUserList
});

export default connect(mapStateToProps, null)(InvitedUserList);
