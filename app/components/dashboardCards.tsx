'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Hourglass,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '@/app/lib/axios';
import dayjs from 'dayjs';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function DashboardCards() {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [todaysAppointments, setTodaysAppointments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Patients and Appointments
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch Patients Count
        const patientsRes = await api.get('/patients');
        const patients = patientsRes.data?.patients || [];
        setTotalPatients(patients.length);

        // Fetch Appointments and Filter Today’s
        const appointmentsRes = await api.get('/appointments');
        const appointments = appointmentsRes.data?.appointments || [];
        const today = dayjs().format('YYYY-MM-DD');

        const todayCount = appointments.filter(
          (appt: any) => appt.appointment_date === today
        ).length;
        setTodaysAppointments(todayCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: 'Total Patients',
      value: loading ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : totalPatients.toString(),
      percentage: '100%',
      trend: 'up',
      bgColor: 'bg-purple-100',
      iconBg: 'bg-purple-600',
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Today's Appointments",
      value: loading ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : todaysAppointments.toString(),
      percentage: todaysAppointments > 0 ? '100%' : '0%',
      trend: todaysAppointments > 0 ? 'up' : 'down',
      bgColor: 'bg-teal-100',
      iconBg: 'bg-teal-500',
    },
    // {
    //   icon: <Hourglass className="w-8 h-8 text-white" />,
    //   title: 'Pending Lab Results',
    //   value: '18',
    //   percentage: '46%',
    //   trend: 'up',
    //   bgColor: 'bg-blue-100',
    //   iconBg: 'bg-blue-500',
    // },
    // {
    //   icon: <AlertCircle className="w-8 h-8 text-white" />,
    //   title: 'Critical Patients',
    //   value: '6',
    //   percentage: '4%',
    //   trend: 'down',
    //   bgColor: 'bg-red-100',
    //   iconBg: 'bg-red-500',
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-3xl p-6`}>
          <div
            className={`${card.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
          >
            {card.icon}
          </div>

          <h3 className="text-gray-600 text-sm font-medium mb-2">
            {card.title}
          </h3>

          <div className="flex items-end justify-between">
            <div className="text-4xl text-gray-800">{card.value}</div>

            <div
              className={`flex items-center ${card.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}
            >
              {card.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              <span className="text-sm font-semibold">{card.percentage}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
