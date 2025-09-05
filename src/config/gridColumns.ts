import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { format } from 'date-fns';

// Currency formatter
const currencyFormatter = (params: ValueFormatterParams) => {
  if (params.value == null) return '';
  return `$${params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Date formatter
const dateFormatter = (params: ValueFormatterParams) => {
  if (!params.value) return '';
  try {
    const date = new Date(params.value);
    return format(date, 'yyyy/MM/dd');
  } catch {
    return params.value;
  }
};

export const columnDefinitions: ColDef[] = [
  {
    headerName: 'Claim Type',
    field: 'claim_type',
    width: 120,
    // pinned: 'left',
  },
  {
    headerName: 'Status',
    field: 'claim_status',
    width: 100,
    // pinned: 'left',
    cellStyle: (params) => {
      if (params.value === 'Paid') {
        return { backgroundColor: '#dcfce7', color: '#166534' };
      }
      if (params.value === 'Cancelled') {
        return { backgroundColor: '#fee2e2', color: '#dc2626' };
      }
      if (params.value === 'Verified') {
        return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
      }
      return null;
    },
  },
  {
    headerName: 'Episode ID',
    field: 'episode_id',
    width: 110,
    type: 'numericColumn',
  },
  {
    headerName: 'Claim',
    field: 'claim',
    width: 120,
    type: 'numericColumn',
    // pinned: 'left',
  },
  {
    headerName: 'Member Number',
    field: 'member_number',
    width: 140,
    type: 'numericColumn',
  },
  {
    headerName: 'Patient',
    field: 'patient',
    width: 180,
  },
  {
    headerName: 'Sex',
    field: 'sex',
    width: 80,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: 'Hospital',
    field: 'hospital',
    width: 130,
  },
  {
    headerName: 'Provider',
    field: 'provider',
    width: 120,
  },
  {
    headerName: 'Agreement',
    field: 'agreement',
    width: 150,
  },
  {
    headerName: 'Service Date',
    field: 'service_date',
    width: 130,
    valueFormatter: dateFormatter,
    sort: 'desc',
  },
  {
    headerName: 'Admission Date',
    field: 'admission_date',
    width: 140,
    valueFormatter: dateFormatter,
  },
  {
    headerName: 'Discharge Date',
    field: 'discharge_date',
    width: 140,
    valueFormatter: dateFormatter,
  },
  {
    headerName: 'Service',
    field: 'service',
    width: 120,
  },
  {
    headerName: 'Diagnosis',
    field: 'diagnosis',
    width: 250,
    tooltipField: 'diagnosis',
  },
  {
    headerName: 'Cost',
    field: 'cost',
    width: 120,
    type: 'numericColumn',
    valueFormatter: currencyFormatter,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Benefit',
    field: 'benefit',
    width: 120,
    type: 'numericColumn',
    valueFormatter: currencyFormatter,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Payee',
    field: 'payee',
    width: 100,
  },
  {
    headerName: 'Message ID',
    field: 'message_id',
    width: 120,
  },
  {
    headerName: 'Severity',
    field: 'severity',
    width: 100,
  },
  {
    headerName: 'Full Text',
    field: 'full_text',
    width: 200,
    tooltipField: 'full_text',
  },
  {
    headerName: 'Contract Type',
    field: 'contract_type',
    width: 130,
  },
];
