'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface PatientData {
  key: string;
  id: string;
  name: string;
  age: number | string;
  contact: string;
  lastVisit: string;
}

export default function PatientManagementPage() {
  const router = useRouter();
  const [allPatients, setAllPatients] = useState<PatientData[]>([]);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/patients`);

        if (res.data.success && Array.isArray(res.data.patients)) {
          const mappedData: PatientData[] = res.data.patients.map((p: any) => ({
            key: String(p.id),
            id: `#${p.id}`,
            name: `${p.first_name} ${p.last_name}`.trim(),
            age: p.date_of_birth
              ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()
              : 'N/A',
            contact: p.phone || p.email || 'N/A',
            lastVisit: p.updated_at
              ? new Date(p.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              : 'N/A',
          }));
          setAllPatients(mappedData);
          setPatients(mappedData); // full list initially
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = allPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPatients(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, allPatients]);

  const columns: ColumnsType<PatientData> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Last Visit', dataIndex: 'lastVisit', key: 'lastVisit' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
          Patient Management
        </h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by name, ID, or contact"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Export</Button>
          <Button
            type="primary"
            onClick={() => router.push('/patients/add-patients')}
          >
            Add New Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={patients}
            pagination={{
              pageSize: 7,
              showSizeChanger: false,
              position: ['bottomCenter'],
              showTotal: (total, range) =>
                `Page ${range[0]} of ${Math.ceil(total / 7)}`,
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
          />
        )}
      </div>
    </div>
  );
}
