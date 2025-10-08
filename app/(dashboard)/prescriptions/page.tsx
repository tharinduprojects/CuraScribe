'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { SortOrder } from 'antd/es/table/interface';
import dayjs from 'dayjs';

interface Prescription {
  id: number;
  first_name: string;
  last_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  doctor_name: string;
  created_at: string;
}

const { Search } = Input;

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/prescriptions');

      if (response.data.success && Array.isArray(response.data.prescriptions)) {
        setPrescriptions(response.data.prescriptions);
      } else {
        console.error('Invalid data format received');
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrescription = () => {
    router.push('/prescriptions/add-prescription');
  };

  const handleExport = () => {
    const headers = ['ID', 'Patient', 'Medication', 'Dosage', 'Frequency', 'Doctor', 'Date'];
    const csvData = prescriptions.map((p) => [
      p.id,
      `${p.first_name} ${p.last_name}`,
      p.medication_name,
      p.dosage,
      p.frequency,
      p.doctor_name,
      dayjs(p.created_at).format('MMM DD, YYYY'),
    ]);

    const csv = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prescriptions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    // message.success('Prescriptions exported successfully');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => `#${String(id).padStart(3, '0')}`,
      sorter: (a: Prescription, b: Prescription) => a.id - b.id,
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 180,
      render: (_: any, record: Prescription) => `${record.first_name} ${record.last_name}`,
      sorter: (a: Prescription, b: Prescription) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Medication',
      dataIndex: 'medication_name',
      key: 'medication_name',
      width: 180,
      sorter: (a: Prescription, b: Prescription) =>
        (a.medication_name || '').localeCompare(b.medication_name || ''),
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
      width: 180,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      width: 180,
      sorter: (a: Prescription, b: Prescription) =>
        (a.doctor_name || '').localeCompare(b.doctor_name || ''),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => dayjs(date).format('MM-DD-YYYY'),
      sorter: (a: Prescription, b: Prescription) =>
        dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      defaultSortOrder: 'descend' as SortOrder,
    },
  ];

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const searchLower = searchText.toLowerCase();
    const patientName = `${prescription.first_name} ${prescription.last_name}`.toLowerCase();
    const medication = (prescription.medication_name || '').toLowerCase();
    const doctor = (prescription.doctor_name || '').toLowerCase();

    return (
      patientName.includes(searchLower) ||
      medication.includes(searchLower) ||
      doctor.includes(searchLower) ||
      prescription.dosage?.toLowerCase().includes(searchLower) ||
      prescription.frequency?.toLowerCase().includes(searchLower) ||
      `#${String(prescription.id).padStart(3, '0')}`.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Prescriptions</h1>
        <Space>
          <Button className="border-gray-300" onClick={handleExport}>
            Export
          </Button>
          <Button
            type="primary"
            onClick={handleNewPrescription}
            className="bg-purple-600 hover:bg-purple-700"
          >
            New Prescription
          </Button>
        </Space>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg">
        <Table
          columns={columns}
          dataSource={filteredPrescriptions}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredPrescriptions.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} prescriptions`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            position: ['bottomCenter'],
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      </div>
    </div>
  );
}
