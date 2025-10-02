'use client';

import { Table, Avatar, Tag, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface AppointmentData {
  key: string;
  patient: {
    name: string;
    avatar?: string;
  };
  dateTime: string;
  type: string;
  doctor: {
    name: string;
    avatar?: string;
  };
  status: 'Completed' | 'In Progress' | 'Urgent';
}

export default function RecentAppointments() {
  const columns: ColumnsType<AppointmentData> = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => (
        <div className="flex items-center gap-3">
          <Avatar src={patient.avatar} icon={<UserOutlined />} />
          <span className="font-medium">{patient.name}</span>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
      render: (doctor) => (
        <div className="flex items-center gap-3">
          <Avatar src={doctor.avatar} icon={<UserOutlined />} size="small" />
          <span>{doctor.name}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        if (status === 'In Progress') color = 'warning';
        if (status === 'Urgent') color = 'error';

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const data: AppointmentData[] = [
    {
      key: '1',
      patient: { name: 'Sarah Johnson' },
      dateTime: 'Today, 10:30am',
      type: 'General Checkup',
      doctor: { name: 'Michael Smith' },
      status: 'Completed',
    },
    {
      key: '2',
      patient: { name: 'Michael Chen' },
      dateTime: 'Today, 11:00am',
      type: 'Follow-up',
      doctor: { name: 'Emily Davis' },
      status: 'In Progress',
    },
    {
      key: '3',
      patient: { name: 'Emma Davis' },
      dateTime: 'Today, 11:30am',
      type: 'Emergency',
      doctor: { name: 'James Brown' },
      status: 'Urgent',
    },
    {
      key: '4',
      patient: { name: 'Liam Johnson' },
      dateTime: 'Today, 12:00pm',
      type: 'General Checkup',
      doctor: { name: 'Olivia Wilson' },
      status: 'Completed',
    },
    {
      key: '5',
      patient: { name: 'Sophia Brown' },
      dateTime: 'Today, 12:30pm',
      type: 'General Checkup',
      doctor: { name: 'William Taylor' },
      status: 'In Progress',
    },
  ];

  return (
    <div className="bg-white rounded-lg py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Appointments</h2>
        <Button type="primary">View All</Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
}