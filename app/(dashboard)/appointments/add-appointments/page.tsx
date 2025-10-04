'use client';

import { Form, Input, Select, DatePicker, TimePicker, Button, Row, Col, Spin, message, notification } from 'antd';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import api from '@/app/lib/axios';  // ✅ use axios instance
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';


export type SelectOptionType = {
  value?: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  [x: string]: any;
};

const { TextArea } = Input;

export default function ScheduleAppointmentForm() {
  const [form] = Form.useForm();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients');

      console.log('patients data', data);

      const formattedPatients = data?.patients?.map(
        (patient: { id: number; first_name: string; last_name: string }) => ({
          value: patient.id,
          label: `${patient.first_name} ${patient.last_name}`.trim(),
        })
      );

      setPatients(formattedPatients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create appointment with axios
  const onFinish = async (values: any) => {
    setSubmitting(true);

    const payload = {
      patient_id: values.patient,
      doctor_name: values.doctorName,
      appointment_date: values.appointmentDate.format('YYYY-MM-DD'),
      appointment_time: values.appointmentTime.format('HH:mm'),
      appointment_type: values.appointmentType,
      duration_minutes: parseInt(values.duration, 10),
      status: values.status,
      notes: values.note || null,
    };

    try {
      const { data, status } = await api.post('/appointments', payload);

      if (status === 201 || data.success) {
        notify.success({
          message: 'Appointment Scheduled',
          description: 'Appointment scheduled successfully',
          duration: 3,
        });
        form.resetFields();
        form.setFieldValue('status', 'scheduled');
      } else {
        notify.error({
          message: 'Appointment Failed',
          description: 'Something went wrong adding appointment',
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      notify.error({
        message: 'Appointment Failed',
        description: 'Something went wrong adding appointment',
        duration: 3,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const backToAppointments = () => {
    form.resetFields()
    router.push('/appointments');
  };

  return (
    <div>
      {contextHolder}
      <div className="mb-6">
        <Link
          href="/appointments"
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Appointments</span>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Schedule New Appointment</h1>
          <div className="flex gap-3">
            <Button size="large" onClick={() => backToAppointments()} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-purple-600"
              onClick={() => form.submit()}
              loading={submitting}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            status: 'scheduled',
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Patient"
                name="patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select
                  placeholder="Select patient"
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                  }
                  options={patients as SelectOptionType[]}
                  notFoundContent={loading ? <Spin size="small" /> : 'No patients found'}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Doctor Name"
                name="doctorName"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Enter doctor name" prefix={<span className="text-gray-400"><UserOutlined /></span>} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Appointment Date"
                name="appointmentDate"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker
                  placeholder="MM/DD/YYYY"
                  className="w-full"
                  format="MM/DD/YYYY"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Appointment Time"
                name="appointmentTime"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <TimePicker
                  placeholder="00:00"
                  className="w-full"
                  format="HH:mm"
                  minuteStep={15}
                  suffixIcon={<Clock className="w-4 h-4 text-gray-400" />}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Appointment Type"
                name="appointmentType"
                rules={[{ required: true, message: 'Please select appointment type' }]}
              >
                <Select
                  placeholder="Select type"
                  options={[
                    { value: 'Consultation', label: 'Consultation' },
                    { value: 'Follow-up', label: 'Follow-up' },
                    { value: 'Check-up', label: 'Check-up' },
                    { value: 'Emergency', label: 'Emergency' },
                    { value: 'Routine', label: 'Routine Examination' },
                    { value: 'Surgery', label: 'Surgery' },
                    { value: 'Therapy', label: 'Therapy' },
                    { value: 'Vaccination', label: 'Vaccination' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: 'Please select duration' }]}
              >
                <Select
                  placeholder="30 minutes"
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '45', label: '45 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '90', label: '1.5 hours' },
                    { value: '120', label: '2 hours' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select
                  placeholder="Scheduled"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Note" name="note">
            <TextArea rows={6} placeholder="Additional notes or instructions" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
