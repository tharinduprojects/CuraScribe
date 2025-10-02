'use client';

import { Form, Input, Select, DatePicker, TimePicker, Button, Row, Col } from 'antd';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

const { TextArea } = Input;

export default function ScheduleAppointmentForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/appointments" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Appointments</span>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Schedule New Appointment</h1>
          <div className="flex gap-3">
            <Button size="large">Cancel</Button>
            <Button
              type="primary"
              size="large"
              className="bg-purple-600"
              onClick={() => form.submit()}
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
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: '1', label: 'Sarah Johnson' },
                    { value: '2', label: 'Michael Chen' },
                    { value: '3', label: 'Emma Davis' },
                    { value: '4', label: 'Liam Johnson' },
                    { value: '5', label: 'Sophia Brown' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Doctor Name"
                name="doctorName"
                rules={[{ required: true, message: 'Please select a doctor' }]}
              >
                <Select
                  placeholder="Select doctor"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: '1', label: 'Dr. Michael Smith' },
                    { value: '2', label: 'Dr. Emily Davis' },
                    { value: '3', label: 'Dr. James Brown' },
                    { value: '4', label: 'Dr. Olivia Wilson' },
                    { value: '5', label: 'Dr. William Taylor' },
                  ]}
                  suffixIcon={<span className="text-gray-400">👤</span>}
                />
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
                    { value: 'general', label: 'General Checkup' },
                    { value: 'followup', label: 'Follow-up' },
                    { value: 'emergency', label: 'Emergency' },
                    { value: 'consultation', label: 'Consultation' },
                    { value: 'routine', label: 'Routine Examination' },
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
                initialValue="scheduled"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select
                  placeholder="Scheduled"
                  options={[
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Note" name="note">
            <TextArea
              rows={6}
              placeholder="Additional notes or instructions"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}