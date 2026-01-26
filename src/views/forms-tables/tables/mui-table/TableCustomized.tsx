'use client';

import { useState } from 'react';

// next
import { useSession } from 'next-auth/react';

// material-ui
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project-imports
import { useGetServices } from 'api/services';
import MainCard from 'components/MainCard';
import ServiceModal from 'sections/services/ServiceModal';
import { getServiceUiConfig, resolveTenantType } from 'sections/services/tenantConfig';

// assets
import { Add } from '@wandersonalwes/iconsax-react';

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

// ==============================|| MUI TABLE - CUSTOMIZED ||============================== //

export default function CustomizedTables() {
  const { data: session } = useSession();
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  let tenantOverride: string | null = null;
  if (typeof window !== 'undefined') {
    tenantOverride = new URLSearchParams(window.location.search).get('tenantType');
  }

  const tenantType = resolveTenantType(session?.user?.tenantType, tenantOverride);
  const uiConfig = getServiceUiConfig(tenantType);
  const { services, servicesLoading, servicesEmpty } = useGetServices(tenantType);
  const columns = uiConfig.table.columns;

  return (
    <>
      <MainCard
        content={false}
        title={uiConfig.listTitle}
        secondary={
          <Button variant="contained" startIcon={<Add />} onClick={() => setServiceModalOpen(true)}>
            {uiConfig.addButtonLabel}
          </Button>
        }
      >
        <TableContainer>
          <Table sx={{ minWidth: 320 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    sx={{ ...(index === 0 && { pl: 3 }), ...(index === columns.length - 1 && { pr: 3 }) }}
                  >
                    {column.header}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesLoading && (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length} sx={{ pl: 3 }}>
                    Loading...
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {!servicesLoading && servicesEmpty && (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length} sx={{ pl: 3 }}>
                    No services yet.
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {!servicesLoading &&
                !servicesEmpty &&
                services?.map((row) => (
                  <StyledTableRow hover key={row.id}>
                    {columns.map((column, index) => (
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        sx={{ ...(index === 0 && { pl: 3 }), ...(index === columns.length - 1 && { pr: 3 }) }}
                      >
                        {column.value(row)}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
      <ServiceModal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} tenantType={tenantType} />
    </>
  );
}
