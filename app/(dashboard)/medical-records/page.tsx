import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface MedicalRecord {
  key: string;
  id: string;
  patient: string;
  date: string;
  diagnosis: string;
  doctor: string;
}

const MedicalRecordsPage: React.FC = () => {
  const columns: ColumnsType<MedicalRecord> = [
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 150,
    },
  ];

  const data: MedicalRecord[] = [
    {
      key: '1',
      id: '#001',
      patient: 'John smith',
      date: 'Sep 04, 2025',
      diagnosis: 'Persistent cough for about two weeks.',
      doctor: 'John smith',
    },
    {
      key: '2',
      id: '#005',
      patient: 'Alice Johnson',
      date: 'Sep 05, 2025',
      diagnosis: 'Experiencing shortness of breath during physical activities.',
      doctor: 'Alice Johnson',
    },
    {
      key: '3',
      id: '#002',
      patient: 'Michael Brown',
      date: 'Sep 06, 2025',
      diagnosis: 'Noticeable fatigue even after adequate sleep.',
      doctor: 'Michael Brown',
    },
    {
      key: '4',
      id: '#003',
      patient: 'John smith',
      date: 'Sep 04, 2025',
      diagnosis: 'A persistent fever that fluctuates throughout the day.',
      doctor: 'John smith',
    },
    {
      key: '5',
      id: '#001',
      patient: 'Christopher Wilson',
      date: 'Sep 08, 2025',
      diagnosis: 'Unexplained weight loss over the past month.',
      doctor: 'Christopher Wilson',
    },
    {
      key: '6',
      id: '#004',
      patient: 'Emily Davis',
      date: 'Sep 07, 2025',
      diagnosis: 'Increased heart rate without any physical exertion.',
      doctor: 'Emily Davis',
    },
    {
      key: '7',
      id: '#006',
      patient: 'Sarah Martinez',
      date: 'Sep 09, 2025',
      diagnosis: 'Recurrent headaches that seem to worsen in the evenings.',
      doctor: 'Sarah Martinez',
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Medical Records</h1>
        <Button type="primary" size="large" className="bg-indigo-600 hover:bg-indigo-700">
          Add Record
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg ">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
          className="medical-records-table"
        />
      </div>
    </>
  );
};

export default MedicalRecordsPage;