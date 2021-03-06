import {
  Paper,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Theme,
  InputLabel,
  Typography,
  Box,
} from "@material-ui/core";
import { createStyles, makeStyles, withStyles } from "@material-ui/styles";
import React from "react";
import { useState } from "react";
import { getColorIndex, rowColor, tranformData } from "./utils";
import { TextInputField } from "../../../Common/HelperInputFields";
import { InvestigationResponse } from "./types";
import moment from "moment";

const useStyle = makeStyles((theme: Theme) => ({
  tableCell: {
    fontSize: "1.1rem",
    // padding: theme.spacing(1.5, 2),
  },
  inputField: {
    // minHeight: 44,
    borderRadius: 0,
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
    borderTop: "0 solid #ddd",
    borderBottom: "0 solid #ddd",
    fontSize: "1rem",
    padding: "0.5rem",
    maxWidth: 128,
    height: "100%",
    textAlign: "right",
    "&:hover": {
      borderTop: "1px #000 solid",
      borderBottom: "1px #000 solid",
    },
    "&::placeholder": {
      color: "#bababa",
      textAlign: "center",
    },
  },
}));

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: "#f7f7f7",
      },
      "&:hover": {
        backgroundColor: "#eeeeee",
      },
    },
  })
)(TableRow);

const ReportRow = ({ data, name, min, max }: any) => {
  const className = useStyle();

  return (
    <StyledTableRow>
      <TableCell
        className={className.tableCell}
        align="right"
        size="medium"
        width="20%"
      >
        {name}
      </TableCell>
      {data.map((d: any) => {
        const color = getColorIndex({
          min: d?.min,
          max: d?.max,
          value: d?.value,
        });
        return (
          <TableCell
            className={className.tableCell}
            align="center"
            style={{
              ...(color >= 0
                ? {
                    backgroundColor: rowColor[color]?.color || "white",
                    color: rowColor[color]?.text || "black",
                  }
                : {}),
              maxWidth: 50,
            }}
          >
            {(d?.value && Math.round((d.value + Number.EPSILON) * 100) / 100) ||
              "---"}
          </TableCell>
        );
      })}
      <TableCell
        className={className.tableCell}
        align="center"
        style={{ maxWidth: 50 }}
      >
        {min || "---"}
      </TableCell>
      <TableCell
        className={className.tableCell}
        align="center"
        style={{ maxWidth: 50 }}
      >
        {max || "---"}
      </TableCell>
    </StyledTableRow>
  );
};

interface ReportTableProps {
  title: string;
  investigationData: InvestigationResponse;
}

const ReportTable: React.FC<ReportTableProps> = ({
  title,
  investigationData,
}) => {
  const { data, sessions } = tranformData(investigationData);
  const [searchFilter, setSearchFilter] = useState("");
  const filterTests = data.filter((i) => {
    const result = !(
      String(i.investigation_object.name).toLowerCase().search(searchFilter) ===
      -1
    );
    return result;
  });

  return (
    <Box padding="1rem" margin="1rem 0">
      {title && (
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      )}
      <br />
      <div className="my-4">
        <span className="inline-block  bg-yellow-200 py-1 m-1 px-6 rounded-full text-yellow-900 font-medium">
          Below Ideal
        </span>

        <span className="inline-block  bg-green-200 py-1 m-1 px-6 rounded-full text-green-900 font-medium">
          Ideal
        </span>

        <span className="inline-block  bg-red-200 py-1 m-1 px-6 rounded-full text-red-900 font-medium">
          Above Ideal
        </span>
      </div>
      <InputLabel>Search Test</InputLabel>
      <TextInputField
        value={searchFilter}
        placeholder="Search test"
        errors=""
        variant="outlined"
        margin="dense"
        onChange={(e) => setSearchFilter(e.target.value)}
      />
      <br />
      <TableContainer component={Paper} style={{ maxHeight: "90vh" }}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">Name</TableCell>
              {sessions.map((session) => (
                <TableCell
                  align="center"
                  key={session.session_external_id}
                  style={{
                    backgroundColor: "#4B5563",
                    color: "#F9FAFB",
                    maxWidth: 50,
                  }}
                >
                  {moment(session.session_created_date).format(
                    "D MMM YYYY h:mm a"
                  )}
                </TableCell>
              ))}
              <TableCell style={{ maxWidth: 50 }} align="center">
                Min
              </TableCell>
              <TableCell style={{ maxWidth: 50 }} align="center">
                Max
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterTests.length > 0 ? (
              filterTests.map((t: any) => {
                return (
                  <ReportRow
                    data={t.sessionValues}
                    key={t.id}
                    min={t.investigation_object.min_value}
                    max={t.investigation_object.max_value}
                    name={t.investigation_object.name}
                    onChange={(e: { target: { value: any } }) => {}}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell component="th" scope="row">
                  No test
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTable;
