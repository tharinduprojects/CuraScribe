import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Prescription {
  key: string;
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  frequency: string;
  doctor: string;
  date: string;
}

const PrescriptionsPage: React.FC = () => {
  const columns: ColumnsType<Prescription> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      width: 150,
    },
    {
      title: 'Medication',
      dataIndex: 'medication',
      key: 'medication',
      width: 150,
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
      width: 120,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 150,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 130,
    },
  ];

  const data: Prescription[] = [
    {
      key: '1',
      id: '#001',
      patient: 'John smith',
      medication: 'Versed',
      dosage: '3mg',
      frequency: 'N/A',
      doctor: 'John smith',
      date: 'Sep 04, 2025',
    },
    {
      key: '2',
      id: '#005',
      patient: 'Alice Johnson',
      medication: 'Sumatriptan',
      dosage: '50mg',
      frequency: 'As needed',
      doctor: 'Alice Johnson',
      date: 'Sep 05, 2025',
    },
    {
      key: '3',
      id: '#002',
      patient: 'Michael Brown',
      medication: 'Lisinopril',
      dosage: '150mg',
      frequency: 'Once daily',
      doctor: 'Michael Brown',
      date: 'Sep 06, 2025',
    },
    {
      key: '4',
      id: '#003',
      patient: 'John smith',
      medication: 'Zolmitriptan',
      dosage: '200mg',
      frequency: 'Three times a week',
      doctor: 'John smith',
      date: 'Sep 04, 2025',
    },
    {
      key: '5',
      id: '#001',
      patient: 'Christopher Wilson',
      medication: 'Rizatriptan',
      dosage: '100mg',
      frequency: 'Twice daily',
      doctor: 'Christopher Wilson',
      date: 'Sep 08, 2025',
    },
    {
      key: '6',
      id: '#004',
      patient: 'Emily Davis',
      medication: 'Naratriptan',
      dosage: '250mg',
      frequency: 'As needed',
      doctor: 'Emily Davis',
      date: 'Sep 07, 2025',
    },
    {
      key: '7',
      id: '#006',
      patient: 'Sarah Martinez',
      medication: 'Sumatriptan',
      dosage: '50mg',
      frequency: 'Once daily',
      doctor: 'Sarah Martinez',
      date: 'Sep 09, 2025',
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Prescriptions</h1>
        <div className="flex gap-3">
          <Button className="border-gray-300">
            Export
          </Button>
          <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700">
            New Prescription
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
          className="prescriptions-table"
        />
      </div>
    </>
  );
};

export default PrescriptionsPage;