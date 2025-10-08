'use client';

import { useEffect, useState } from 'react';
import { Table, Avatar, Tag, Button, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '@/app/lib/axios';
import dayjs from 'dayjs';
import Link from 'next/link';

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
  status: string;
}

export default function RecentAppointments() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

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
        let color: 'default' | 'success' | 'warning' | 'error' = 'default';
        const lower = status.toLowerCase();

        if (['completed', 'confirmed'].includes(lower)) color = 'success';
        else if (['pending', 'in progress', 'scheduled'].includes(lower)) color = 'warning';
        else if (lower === 'urgent') color = 'error';

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        const result = response.data;

        if (result.success && Array.isArray(result.appointments)) {
          // Sort by latest date & time
          const sorted = result.appointments.sort((a: { appointment_date: any; appointment_time: any; }, b: { appointment_date: any; appointment_time: any; }) => {
            const dateA = dayjs(`${a.appointment_date} ${a.appointment_time}`);
            const dateB = dayjs(`${b.appointment_date} ${b.appointment_time}`);
            return dateB.valueOf() - dateA.valueOf();
          });

          // Take only the latest 3
          const latestThree = sorted.slice(0, 3).map((item: { id: { toString: () => any; }; first_name: any; last_name: any; appointment_date: string | number | dayjs.Dayjs | Date | null | undefined; appointment_time: string | any[]; appointment_type: any; doctor_name: any; status: any; }) => ({
            key: item.id.toString(),
            patient: { name: `${item.first_name} ${item.last_name}`.trim() },
            dateTime: `${dayjs(item.appointment_date).format('MMM D, YYYY')} ${item.appointment_time.slice(0, 5)}`,
            type: item.appointment_type,
            doctor: { name: item.doctor_name },
            status: item.status,
          }));

          setAppointments(latestThree);
        } else {
          message.warning('No appointments found.');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        message.error('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="bg-white rounded-lg py-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Appointments</h2>
        <Link href="/appointments">
          <Button type="primary">View All</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={appointments}
          pagination={false}
          rowKey="key"
        />
      )}
    </div>
  );
}
