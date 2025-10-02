'use client';

import { Table, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';

interface PatientData {
  key: string;
  id: string;
  name: string;
  age: number;
  contact: string;
  lastVisit: string;
}

export default function PatientManagementPage() {

  const router = useRouter();
  const columns: ColumnsType<PatientData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
    },
  ];

  const data: PatientData[] = [
    {
      key: '1',
      id: '#001',
      name: 'John smith',
      age: 34,
      contact: '(555) 999-0000',
      lastVisit: 'Sep 04, 2025',
    },
    {
      key: '2',
      id: '#005',
      name: 'Alice Johnson',
      age: 35,
      contact: '(555) 999-0001',
      lastVisit: 'Sep 05, 2025',
    },
    {
      key: '3',
      id: '#002',
      name: 'Michael Brown',
      age: 34,
      contact: '(555) 999-0000',
      lastVisit: 'Sep 06, 2025',
    },
    {
      key: '4',
      id: '#003',
      name: 'John smith',
      age: 37,
      contact: '(555) 999-0003',
      lastVisit: 'Sep 04, 2025',
    },
    {
      key: '5',
      id: '#001',
      name: 'Christopher Wilson',
      age: 36,
      contact: '(555) 999-0002',
      lastVisit: 'Sep 08, 2025',
    },
    {
      key: '6',
      id: '#004',
      name: 'Emily Davis',
      age: 38,
      contact: '(555) 999-0004',
      lastVisit: 'Sep 07, 2025',
    },
    {
      key: '7',
      id: '#006',
      name: 'Sarah Martinez',
      age: 39,
      contact: '(555) 999-0005',
      lastVisit: 'Sep 09, 2025',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Patient Management</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
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

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 7,
            showSizeChanger: false,
            position: ['bottomCenter'],
            showTotal: (total, range) => `Page ${range[0]} of ${Math.ceil(total / 7)}`,
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
      </div>
    </div>
  );
}