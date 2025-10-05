'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, App, Spin, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';


interface MedicalRecord {
  key: string;
  id: number;
  patient_id: number;
  patient_name: string;
  chief_complaint: string;
  assessment: string;
  doctor_name: string;
  created_at: string;
  first_name: string;
  last_name: string;
}

function MedicalRecordsContent() {
  const { message } = App.useApp();
  const router = useRouter();
  const [allRecords, setAllRecords] = useState<MedicalRecord[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = allRecords.filter(
        (record) =>
          record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `#MR${String(record.id).padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRecords(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, allRecords]);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/medical-records');
      const data = response.data;

      if (data.success && Array.isArray(data.records)) {
        const formattedRecords = data.records.map((record: any) => ({
          ...record,
          key: record.id.toString(),
          patient_name: `${record.first_name} ${record.last_name}`.trim(),
        }));

        setAllRecords(formattedRecords);
        setRecords(formattedRecords);
      }
    } catch (error) {
      message.error('Failed to fetch medical records');
      console.error('Error fetching medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (recordId: number) => {
    router.push(`/medical-records/${recordId}`);
  };

  const columns: ColumnsType<MedicalRecord> = [
    {
      title: 'RECORD ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: number) => `#MR${String(id).padStart(3, '0')}`,
    },
    {
      title: 'PATIENT',
      dataIndex: 'patient_name',
      key: 'patient_name',
      width: 150,
    },
    {
      title: 'DATE',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      title: 'DIAGNOSIS',
      dataIndex: 'chief_complaint',
      key: 'chief_complaint',
      ellipsis: true,
    },
    {
      title: 'DOCTOR',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      width: 150,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleView(record.id)}
          className="text-blue-600 hover:text-blue-800"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Medical Records</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by patient, diagnosis, or doctor"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Export</Button>
          <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700">
            Add Record
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="small" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={records}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
              showTotal: (total, range) =>
                `Page ${range[0]} of ${Math.ceil(total / 10)}`,
              itemRender: (page, type, originalElement) => {
                if (type === 'prev') {
                  return <Button>Previous</Button>;
                }
                if (type === 'next') {
                  return <Button>Next</Button>;
                }
                return originalElement;
              },
            }}
            className="medical-records-table"
          />
        )}
      </div>
    </>
  );
}

const MedicalRecordsPage: React.FC = () => {
  return (
    <App>
      <MedicalRecordsContent />
    </App>
  );
};

export default MedicalRecordsPage;