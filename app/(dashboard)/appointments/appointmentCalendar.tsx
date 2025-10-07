'use client';

import { useState, useEffect } from 'react';
import { Calendar, Badge, Button, App, Spin, Tag, Modal, Empty } from 'antd';
import { UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import api from '@/app/lib/axios';

interface Appointment {
  id: number;
  patient_id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  first_name: string;
  last_name: string;
}

function AppointmentsCalendarContent() {
  const { message } = App.useApp();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments');
      if (response.data.success && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      message.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'blue',
      confirmed: 'green',
      pending: 'orange',
      cancelled: 'red',
      completed: 'default',
    };
    return colors[status.toLowerCase()] || 'default';
  };

  const getAppointmentsForDate = (date: Dayjs) => {
    return appointments.filter(
      (apt) => dayjs(apt.appointment_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(value);
    if (dayAppointments.length === 0) return null;

    return (
      <ul className="space-y-1 p-1">
        {dayAppointments.slice(0, 3).map((apt) => (
          <li key={apt.id} className="text-xs truncate">
            <Badge
              status={getStatusColor(apt.status) as any}
              text={
                <span className="truncate">
                  {apt.first_name} {apt.last_name} -{' '}
                  {dayjs(apt.appointment_time, 'HH:mm:ss').format('h:mm A')}
                </span>
              }
            />
          </li>
        ))}
        {dayAppointments.length > 3 && (
          <li className="text-xs text-gray-500">+{dayAppointments.length - 3} more...</li>
        )}
      </ul>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const monthAppointments = appointments.filter(
      (apt) =>
        dayjs(apt.appointment_date).month() === value.month() &&
        dayjs(apt.appointment_date).year() === value.year()
    );

    if (monthAppointments.length === 0) return null;

    return (
      <div className="text-center">
        <div className="text-sm font-semibold text-blue-600">
          {monthAppointments.length} Appointments
        </div>
      </div>
    );
  };

  const onSelect = (date: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(date);
    setSelectedDate(date);
    if (dayAppointments.length > 0) {
      setIsModalVisible(true);
    }
  };

  return (
    <div className='custom-calendar'>
      <div className="bg-white rounded-lg border border-gray-200 px-2.5">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spin />
          </div>
        ) : (
          <Calendar
            value={selectedDate}
            onSelect={onSelect}
            cellRender={(current, info) => {
              if (info.type === 'date') {
                return dateCellRender(current);
              }
              if (info.type === 'month') {
                return monthCellRender(current);
              }
              return info.originNode;
            }}
          />
        )}
      </div>

      {/* Modal for selected date */}
      <Modal
        open={isModalVisible}
        title={`Appointments on ${selectedDate.format('MMMM D, YYYY')}`}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {getAppointmentsForDate(selectedDate).length === 0 ? (
          <Empty description="No appointments for this date" />
        ) : (
          <div className="space-y-3">
            {getAppointmentsForDate(selectedDate).map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  // setIsModalVisible(false);
                  // router.push(`/appointments/${apt.id}`);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 mb-1">
                    {apt.first_name} {apt.last_name}
                  </span>
                  <span className="text-sm text-gray-600">Dr. {apt.doctor_name}</span>
                </div>
                <div className="text-right">
                  <Tag color={getStatusColor(apt.status)} className='!mr-0'>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </Tag>
                  <div className="text-sm font-medium text-gray-900">
                    {dayjs(apt.appointment_time, 'HH:mm:ss').format('h:mm A')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AppointmentsCalendarPage() {
  return (
    <App>
      <AppointmentsCalendarContent />
    </App>
  );
}
