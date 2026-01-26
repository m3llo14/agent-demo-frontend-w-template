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
import Tooltip from '@mui/material/Tooltip';

// project-imports
import { deleteService, useGetServices } from 'api/services';
import { openSnackbar } from 'api/snackbar';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ServiceModal from 'sections/services/ServiceModal';
import { getServiceUiConfig, resolveTenantType } from 'sections/services/tenantConfig';
import useLocales from 'utils/locales/useLocales';
import { SnackbarProps } from 'types/snackbar';

// assets
import { Add, Edit, Trash } from '@wandersonalwes/iconsax-react';

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
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { t } = useLocales();

  let tenantOverride: string | null = null;
  if (typeof window !== 'undefined') {
    tenantOverride = new URLSearchParams(window.location.search).get('tenantType');
  }

  const sessionTenantType = (session?.user as { tenantType?: string } | undefined)?.tenantType;
  const tenantType = resolveTenantType(sessionTenantType, tenantOverride);
  const uiConfig = getServiceUiConfig(tenantType);
  const { services, servicesLoading, servicesEmpty } = useGetServices(tenantType);
  const columns = uiConfig.table.columns;
  const selectedService = services?.find((service) => service.id === selectedServiceId) || null;

  const handleAdd = () => {
    setSelectedServiceId(null);
    setServiceModalOpen(true);
  };

  const handleEdit = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setServiceModalOpen(true);
  };

  const handleCloseModal = () => {
    setServiceModalOpen(false);
    setSelectedServiceId(null);
  };

  const handleDelete = async (serviceId: string) => {
    const confirmed = window.confirm(t('servicesPage.confirmDelete'));
    if (!confirmed) return;
    try {
      await deleteService(serviceId, tenantType);
      openSnackbar({
        open: true,
        message: t('servicesPage.messages.deleteSuccess'),
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
    } catch {
      openSnackbar({
        open: true,
        message: t('servicesPage.messages.deleteError'),
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  };

  return (
    <>
      <MainCard
        content={false}
        title={t(uiConfig.listTitleKey)}
        secondary={
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            {t(uiConfig.addButtonLabelKey)}
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
                    {t(column.headerKey)}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="right" sx={{ pr: 3 }}>
                  {t('common.actions')}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesLoading && (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length + 1} sx={{ pl: 3 }}>
                    {t('common.loading')}
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {!servicesLoading && servicesEmpty && (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length + 1} sx={{ pl: 3 }}>
                    {t('servicesPage.empty')}
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
                    <StyledTableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title={t('common.edit')}>
                        <IconButton color="secondary" onClick={() => handleEdit(row.id)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                          <Trash />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
      <ServiceModal open={serviceModalOpen} onClose={handleCloseModal} tenantType={tenantType} service={selectedService} />
    </>
  );
}
