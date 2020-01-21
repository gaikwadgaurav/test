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
import cn from "classnames";

// components
import Widget from "../../components/Widget/Widget";
// import Dot from "../../components/Sidebar/components/Dot";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  fetchFlowList,
  selectFlow,
  clearFlowStateMsg,
  deleteFlow,
  addFlow
} from "../../Redux/_actions/flow.action";
import moment from "moment";
import { isAuthenticated } from "../../common/isAuthenticated";
import qs from "qs";

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
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name"
  },
  {
    id: "lastUpdated",
    numeric: true,
    disablePadding: false,
    label: "Last Updated"
  },
  { id: "status", numeric: true, disablePadding: false, label: "Status" },
  { id: "action", numeric: true, disablePadding: false, label: "Action" }
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
          Flows
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
    const text = "You want to delete flows!";
    const buttonText = "Yes, delete it!";
    let formData = new FormData();
    if (selected.length) {
      selected.map(select => {
        return formData.append("ids[]", select);
      });

      sweetAlert(text, buttonText).then(result => {
        if (result.value) {
          dispatch(deleteFlow(true, selected, null, formData));
        }
      });
    }
  }
};

export function RetentionFlowsList(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  const user = isAuthenticated();
  const flows = props && props.flowList;
  toast.configure({
    autoClose: 4000,
    draggable: true
  });

  function fetchRetentionFlowList() {
    dispatch(fetchFlowList(true, null, null));
  }

  function goToCreateFlow() {
    const company_id = user.company_id;
    const formData = {
      "flow[name]": "Flow " + (flows.length + 1),
      "flow[enabled]": false,
      "flow[company_id]": company_id
    };
    dispatch(addFlow(true, null, qs.parse(formData)));
  }

  function editFlow(flowId) {
    props.history.push("/flows/" + flowId + "/edit");
  }

  function showDeletePopUp(flowId) {
    if (flowId) {
      const text = "You want to delete flow!";
      const buttonText = "Yes, delete it!";
      sweetAlert(text, buttonText).then(result => {
        if (result.value) {
          let formData = new FormData();
          formData.append("ids[]", flowId);
          const flowIds = [flowId];
          dispatch(deleteFlow(true, flowIds, null, formData));
        }
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

  function flowOperationSuccess() {
    if (
      props &&
      props.flows &&
      (props.flows.status === "SUCCESS" ||
        props.flows.status === "DELETE_SUCCESS" ||
        props.flows.status === "ADD_FLOW_SUCCESS") &&
      props.flows.successMessage &&
      props.flows.successMessage !== ""
    ) {
      if (props.flows.status === "ADD_FLOW_SUCCESS") {
        props.history.push("/flows/" + props.selectedFlow.id + "/edit");
      }
      toast.success(props.flows.successMessage);
      dispatch(clearFlowStateMsg());
      setSelected([]);
    }
    if (
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
    fetchRetentionFlowList();
  }, []);

  useEffect(() => {
    flowOperationSuccess();
  }, [props && props.flows]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = flows.map(n => n.id);
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
    rowsPerPage - Math.min(rowsPerPage, flows.length - page * rowsPerPage);

  const type = "retentionFlowsTable";
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget
            title="List of Flows"
            subtitle={`(${flows.length} total)`}
            disableWidgetMenu
            searchField
            filterType={type}
          >
            <Box display="flex" justifyContent={"flex-start"}>
              <Box m={1}>
                <Button
                  variant={"contained"}
                  color={"success"}
                  onClick={goToCreateFlow}
                >
                  + New Flow
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
                  rowCount={flows.length}
                />

                <TableBody>
                  {flows && flows.length
                    ? stableSort(flows, getSorting(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((flow, flowIndex) => {
                          const isItemSelected = isSelected(flow.id);
                          const labelId = `enhanced-table-checkbox-${flowIndex}`;

                          return (
                            <TableRow
                              hover
                              // onClick={event => handleClick(event, variable.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              key={flow.id}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={event =>
                                    handleClick(event, flow.id)
                                  }
                                  inputProps={{ "aria-labelledby": labelId }}
                                />
                              </TableCell>
                              <TableCell>{flow.name}</TableCell>
                              <TableCell>
                                {moment(flow.updated_at).format("MMM D, YYYY")}
                              </TableCell>
                              <TableCell>
                                {flow.enabled ? "Active" : "InActive"}
                              </TableCell>
                              <TableCell>
                                <Box display={"flex"} alignItems={"center"}>
                                  <Button
                                    color="success"
                                    size="small"
                                    className={"mr-2"}
                                    variant="contained"
                                    onClick={() => editFlow(flow.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    color="secondary"
                                    size="small"
                                    variant="contained"
                                    onClick={() => showDeletePopUp(flow.id)}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : null}
                  {emptyRows > 0 && !flows.length && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} className={"text text-center"}>
                        No Flow Available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={flows.length}
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
  flowList: state.flows.flowList,
  flows: state.flows,
  selectedFlow: state.flows.selectedFlow
});

export default connect(mapStateToProps, null)(RetentionFlowsList);
