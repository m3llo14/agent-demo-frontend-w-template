'use client';

// material-ui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project-imports
import { header } from 'sections/apps/tables/mui-table/header';
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';

// styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}));

// table data
function createData(roomNumber: string, capacity: number, roomType: string, floor: number, fee: number) {
  return { roomNumber, capacity, roomType, floor, fee };
}

const rows = [
  createData('101', 1, 'Single', 1, 200),
  createData('102', 2, 'Suite', 1, 800),
  createData('201', 4, 'Family', 2, 500),
  createData('202', 2, 'Double', 2, 400),
  createData('301', 1, 'Single', 3, 200)
];

// ==============================|| MUI TABLE - CUSTOMIZED ||============================== //

export default function CustomizedTables() {
  return (
    <MainCard
      content={false}
      title="Rooms"
    >
      <TableContainer>
        <Table sx={{ minWidth: 320 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ pl: 3 }}>Room Number</StyledTableCell>
              <StyledTableCell align="right">Capacity</StyledTableCell>
              <StyledTableCell align="right">Room Type</StyledTableCell>
              <StyledTableCell align="right">Floor</StyledTableCell>
              <StyledTableCell sx={{ pr: 3 }} align="right">
                Price / Night
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow hover key={row.roomNumber}>
                <StyledTableCell sx={{ pl: 3 }} component="th" scope="row">
                  {row.roomNumber}
                </StyledTableCell>
                <StyledTableCell align="right">{row.capacity}</StyledTableCell>
                <StyledTableCell align="right">{row.roomType}</StyledTableCell>
                <StyledTableCell align="right">{row.floor}</StyledTableCell>
                <StyledTableCell sx={{ pr: 3 }} align="right">
                  {row.fee}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
