'use client';

import { Table, Button, Tag, Drawer, Descriptions } from 'antd';
import { Calendar, Grid3x3, CalendarDays, X } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import api from '@/app/lib/axios';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AppointmentsCalendarPage from './appointmentCalendar';

dayjs.extend(isBetween);

interface AppointmentData {
  key: string;
  id: number;
  patient_id: number;
  doctor_name: string;
  patient: string;
  type: string;
  status: 'scheduled' | 'pending' | 'confirmed' | 'cancelled';
  date: string;
  time: string;
  rawDate: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month' | null>(null);

  // Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  // Dynamic counts
  const [counts, setCounts] = useState({
    today: 0,
    week: 0,
    month: 0,
  });

  const handleViewAppointment = (record: AppointmentData) => {
    setSelectedAppointment(record);
    setDrawerVisible(true);
  };

  const handleSwitchToCalendar = () => {
    // ✅ Reset filters when switching to calendar
    if (activeFilter) setActiveFilter(null);
    setViewMode('calendar');
  };

  const handleSwitchToList = () => {
    setViewMode('list');
  };

  const columns: ColumnsType<AppointmentData> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 180,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 120,
    },
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color: string = 'default';
        if (status === 'scheduled') color = 'blue';
        if (status === 'pending') color = 'orange';
        if (status === 'confirmed') color = 'green';
        if (status === 'cancelled') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewAppointment(record)}>
          View
        </Button>
      ),
    },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      if (data?.success && Array.isArray(data.appointments)) {
        const formatted = data.appointments.map((item: any) => ({
          key: String(item.id),
          id: item.id,
          patient_id: item.patient_id,
          doctor_name: item.doctor_name,
          patient: `${item.first_name} ${item.last_name}`.trim(),
          type: item.appointment_type,
          status: item.status,
          date: dayjs(item.appointment_date).format('MM-DD-YYYY'),
          time: dayjs(item.appointment_time, 'HH:mm:ss').format('hh:mm A'),
          rawDate: item.appointment_date,
        }));

        setAppointments(formatted);

        const today = dayjs();
        const todayCount = formatted.filter((a: { rawDate: string | number | Date | dayjs.Dayjs | null | undefined; }) =>
          dayjs(a.rawDate).isSame(today, 'day')
        ).length;

        const weekCount = formatted.filter((a: { rawDate: string | number | Date | dayjs.Dayjs | null | undefined; }) =>
          dayjs(a.rawDate).isBetween(today.startOf('week'), today.endOf('week'), null, '[]')
        ).length;

        const monthCount = formatted.filter((a: { rawDate: string | number | dayjs.Dayjs | Date | null | undefined; }) =>
          dayjs(a.rawDate).isSame(today, 'month')
        ).length;

        setCounts({ today: todayCount, week: weekCount, month: monthCount });
      } else {
        console.error('Error fetching appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!activeFilter) return appointments;

    return appointments.filter((appt) => {
      const apptDate = dayjs(appt.rawDate);
      if (activeFilter === 'today') return apptDate.isSame(dayjs(), 'day');
      if (activeFilter === 'week')
        return apptDate.isBetween(dayjs().startOf('week'), dayjs().endOf('week'), null, '[]');
      if (activeFilter === 'month') return apptDate.isSame(dayjs(), 'month');
      return true;
    });
  }, [appointments, activeFilter]);

  const statsCards = [
    {
      key: 'today',
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Today's Appointments",
      value: counts.today,
      bgColor: 'bg-purple-100',
      iconBg: 'bg-purple-600',
    },
    {
      key: 'week',
      icon: <Grid3x3 className="w-8 h-8 text-white" />,
      title: 'This Week',
      value: counts.week,
      bgColor: 'bg-teal-100',
      iconBg: 'bg-teal-500',
    },
    {
      key: 'month',
      icon: <CalendarDays className="w-8 h-8 text-white" />,
      title: 'This Month',
      value: counts.month,
      bgColor: 'bg-blue-100',
      iconBg: 'bg-blue-500',
    },
  ];

  return (
    <div>
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsCards.map((card) => {
          const isActive = activeFilter === card.key;
          const isDisabled = viewMode === 'calendar';

          return (
            <div
              key={card.key}
              onClick={() => {
                if (!isDisabled) setActiveFilter(isActive ? null : (card.key as any));
              }}
              className={`${card.bgColor} rounded-3xl p-6 cursor-pointer transition transform
                ${isActive ? 'ring-4 ring-offset-2 ring-purple-400' : ''}
                ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              <div
                className={`${card.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
              <p className="text-4xl font-bold text-gray-800">{card.value ?? 0}</p>
            </div>
          );
        })}
      </div>

      {/* --- Appointments Section --- */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-800">Appointments</h2>
            {activeFilter && viewMode === 'list' && (
              <Tag
                color="purple"
                className="text-sm cursor-pointer flex items-center"
                onClick={() => setActiveFilter(null)}
              >
                <div className="flex items-center">
                  {activeFilter === 'today' && "Today's"}
                  {activeFilter === 'week' && 'This Week'}
                  {activeFilter === 'month' && 'This Month'}
                  <X className="w-3 h-3 ml-1" />
                </div>
              </Tag>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              icon={<CalendarOutlined />}
              type={viewMode === 'calendar' ? 'primary' : 'default'}
              onClick={handleSwitchToCalendar}
            />
            <Button
              icon={<AppstoreOutlined />}
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={handleSwitchToList}
            />
            <Button
              type="primary"
              onClick={() => router.push('/appointments/add-appointments')}
            >
              Schedule New
            </Button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        ) : (
          <AppointmentsCalendarPage />
        )}
      </div>

      {/* --- Drawer for Appointment Details --- */}
      <Drawer
        title="Appointment Details"
        placement="right"
        width={420}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedAppointment ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Appointment ID">{selectedAppointment.id}</Descriptions.Item>
            <Descriptions.Item label="Patient ID">{selectedAppointment.patient_id}</Descriptions.Item>
            <Descriptions.Item label="Patient Name">{selectedAppointment.patient}</Descriptions.Item>
            <Descriptions.Item label="Doctor">{selectedAppointment.doctor_name}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedAppointment.date}</Descriptions.Item>
            <Descriptions.Item label="Time">{selectedAppointment.time}</Descriptions.Item>
            <Descriptions.Item label="Type">{selectedAppointment.type}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedAppointment.status === 'scheduled'
                    ? 'blue'
                    : selectedAppointment.status === 'pending'
                      ? 'orange'
                      : selectedAppointment.status === 'confirmed'
                        ? 'green'
                        : 'red'
                }
              >
                {selectedAppointment.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No appointment selected</p>
        )}
      </Drawer>
    </div>
  );
}
