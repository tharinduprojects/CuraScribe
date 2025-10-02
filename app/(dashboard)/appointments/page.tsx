'use client';

import { Table, Button, Tag } from 'antd';
import { Calendar, Grid3x3, CalendarDays, TrendingUp } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface AppointmentData {
  key: string;
  time: string;
  patient: string;
  type: string;
  duration: string;
  status: 'Scheduled' | 'Pending' | 'Confirmed' | 'Cancelled';
}

export default function AppointmentsPage() {
  const router = useRouter();
  const statsCards = [
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Today's Appointments",
      value: "12",
      percentage: "100%",
      bgColor: "bg-purple-100",
      iconBg: "bg-purple-600"
    },
    {
      icon: <Grid3x3 className="w-8 h-8 text-white" />,
      title: "This Week",
      value: "27",
      percentage: "100%",
      bgColor: "bg-teal-100",
      iconBg: "bg-teal-500"
    },
    {
      icon: <CalendarDays className="w-8 h-8 text-white" />,
      title: "This Month",
      value: "275",
      percentage: "46%",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500"
    }
  ];

  const columns: ColumnsType<AppointmentData> = [
    {
      title: 'Date & Time',
      dataIndex: 'time',
      key: 'time',
      width: 150,
    },
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color = 'default';
        if (status === 'Scheduled') color = 'blue';
        if (status === 'Pending') color = 'orange';
        if (status === 'Confirmed') color = 'green';
        if (status === 'Cancelled') color = 'default';

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: () => (
        <Button type="text" icon={<span>⋮</span>} />
      ),
    },
  ];

  const data: AppointmentData[] = [
    {
      key: '1',
      time: '10:30am',
      patient: 'Sarah Johnson',
      type: 'General Checkup',
      duration: '30 min',
      status: 'Scheduled',
    },
    {
      key: '2',
      time: '11:00am',
      patient: 'Michael Chen',
      type: 'Follow-up',
      duration: '30 min',
      status: 'Pending',
    },
    {
      key: '3',
      time: '11:30am',
      patient: 'Emma Davis',
      type: 'Emergency',
      duration: '30 min',
      status: 'Confirmed',
    },
    {
      key: '4',
      time: '12:00pm',
      patient: 'Liam Johnson',
      type: 'General Checkup',
      duration: '30 min',
      status: 'Cancelled',
    },
    {
      key: '5',
      time: '12:30pm',
      patient: 'Sophia Brown',
      type: 'General Checkup',
      duration: '30 min',
      status: 'Confirmed',
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-3xl p-6`}
          >
            <div className={`${card.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
              {card.icon}
            </div>

            <h3 className="text-gray-600 text-sm font-medium mb-2">
              {card.title}
            </h3>

            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-gray-800">
                {card.value}
              </p>

              <div className="flex items-center text-green-600">
                <TrendingUp className="w-5 h-5 mr-1" />
                <span className="text-sm font-semibold">{card.percentage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
          <div className="flex gap-2">
            <Button icon={<CalendarOutlined />} />
            <Button icon={<AppstoreOutlined />} />
            <Button
              type="primary"
              onClick={() => router.push('/appointments/add-appointments')}
            >
              Add New Patient
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            position: ['bottomCenter'],
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