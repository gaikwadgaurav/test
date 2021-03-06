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
import useStyles from "./styles";
import { Link } from "react-router-dom";
import cn from "classnames";

// components
import Widget from "../../components/Widget";
// import Dot from "../../components/Sidebar/components/Dot";
import { Typography, Button } from "../../components/Wrappers";
import {
  fetchVariables,
  deleteVariable
} from "../../Redux/_actions/variable.action";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { clearMsgForVariable } from "../../Redux/_actions/variable.action";
import Swal from "sweetalert2";

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

// const headCells = [
//   {
//     id: "id",
//     numeric: true,
//     disablePadding: true,
//     label: "ID"
//   },
//   { id: "image", numeric: true, disablePadding: false, label: "Image" },
//   { id: "title", numeric: true, disablePadding: false, label: "Title" },
//   { id: "subtitle", numeric: true, disablePadding: false, label: "Subtitle" },
//   { id: "price", numeric: true, disablePadding: false, label: "Price" },
//   { id: "rating", numeric: true, disablePadding: false, label: "Rating" },
//   { id: "status", numeric: true, disablePadding: false, label: "Status" },
//   { id: "actions", numeric: true, disablePadding: false, label: "Actions" }
// ];
const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "ID"
  },
  { id: "name", numeric: true, disablePadding: false, label: "Variable Name" },
  {
    id: "defaultValue",
    numeric: true,
    disablePadding: false,
    label: "Default Value"
  },
  { id: "actions", numeric: true, disablePadding: false, label: "Actions" }
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
          Variables
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => multiVariableDeletion(selected, dispatch)}
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

const multiVariableDeletion = (selected, dispatch) => {
  if (selected) {
    const text = "You want to delete variables!";
    const buttonText = "Yes, delete it!";
    let formData = new FormData();
    if (selected.length) {
      selected.map(select => {
        return formData.append("ids[]", select);
      });

      sweetAlert(text, buttonText).then(result => {
        if (result.value) {
          dispatch(deleteVariable(true, selected, null, formData));
        }
      });
    }
  }
};

export function EcommercePage(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch = useDispatch();
  function fetchVariablesList(props) {
    dispatch(fetchVariables(true, null, null));
  }

  function editVariable(variableId) {
    if (variableId) {
      const { history } = props;
      history.push("/variables/" + variableId + "/edit");
    }
  }

  function showDeletePopUp(variableId) {
    if (variableId) {
      const text = "You want to delete variable!";
      const buttonText = "Yes, delete it!";
      let formData = new FormData();
      formData.append("ids[]", variableId);
      const variableIds = [variableId];
      sweetAlert(text, buttonText).then(result => {
        if (result.value) {
          dispatch(deleteVariable(true, variableIds, null, formData));
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

  function variableOperationSuccess() {
    if (
      props &&
      props.variables &&
      (props.variables.status === "SUCCESS" ||
        props.variables.status === "DELETE_SUCCESS") &&
      props.variables.successMessage &&
      props.variables.successMessage !== ""
    ) {
      toast.success(props.variables.successMessage);
      dispatch(clearMsgForVariable());
      setSelected([]);
    }
    if (
      props &&
      props.variables &&
      props.variables.status === "FAILED" &&
      props.variables.errorMessage &&
      props.variables.errorMessage !== ""
    ) {
      toast.error(props.variables.errorMessage);
      dispatch(clearMsgForVariable());
    }
  }

  const variables = props && props.variablesList;

  useEffect(() => {
    fetchVariablesList(props);
  }, [props && props.variableList && !props.variableList.length]);

  useEffect(() => {
    variableOperationSuccess();
  }, [props && props.variables]);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = variables.map(n => n.id);
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
    rowsPerPage - Math.min(rowsPerPage, variables.length - page * rowsPerPage);
  const type = "variableListTable";
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget
            title="List of Variables"
            subtitle={`(${variables.length} total)`}
            disableWidgetMenu
            searchField
            filterType={type}
          >
            <Button
              variant={"contained"}
              component={Link}
              to={"/variables/new"}
              color={"success"}
            >
              Create Variable
            </Button>
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
                  rowCount={variables.length}
                />

                <TableBody>
                  {variables && variables.length
                    ? stableSort(variables, getSorting(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((variable, variableIndex) => {
                          const isItemSelected = isSelected(variable.id);
                          const labelId = `enhanced-table-checkbox-${variableIndex}`;

                          return (
                            <TableRow
                              hover
                              // onClick={event => handleClick(event, variable.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              key={variable.id}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={event =>
                                    handleClick(event, variable.id)
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
                                {variable.id}
                              </TableCell>
                              <TableCell>{variable.name}</TableCell>
                              <TableCell>${variable.default}</TableCell>
                              <TableCell>
                                <Box display={"flex"} alignItems={"center"}>
                                  <Button
                                    color="success"
                                    size="small"
                                    className={"mr-2"}
                                    variant="contained"
                                    onClick={() => editVariable(variable.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    color="secondary"
                                    size="small"
                                    variant="contained"
                                    onClick={() => showDeletePopUp(variable.id)}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : null}
                  {emptyRows > 0 && !variables.length && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      {/* <TableCell colSpan={3} /> */}
                      <TableCell colSpan={6} className={"text text-center"}>
                        No Variable Available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={variables.length}
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
  variablesList: state.variables.variableList,
  variables: state.variables
});

export default connect(mapStateToProps, null)(EcommercePage);
