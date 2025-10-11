'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, App, Spin, notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import FloatingVoiceInput from '@/app/components/FloatingVoiceInput';

const { TextArea } = Input;

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

function AddPrescriptionContent() {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/patients');
      if (response.data.success && Array.isArray(response.data.patients)) {
        setPatients(response.data.patients);
      }
    } catch (error) {
      message.error('Failed to fetch patients');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);

    const payload = {
      patient_id: Number(values.patient_id),
      doctor_name: values.doctor_name,
      medication_name: values.medication_name,
      dosage: values.dosage,
      frequency: values.frequency,
      instructions: values.instructions || '',
    };

    try {
      const response = await api.post('/prescriptions', payload);

      if (response.data.success) {
        notify.success({
          message: 'Prescription Saved',
          description: 'Prescription saved successfully',
          duration: 3,
        });
        form.resetFields();
      } else {
        notify.error({
          message: 'Prescription Failed',
          description: 'Something went wrong adding prescription',
          duration: 3,
        });
        console.error(response.data.message || 'Failed to save prescription');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred while saving the prescription';
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <div className="pb-20">
      {contextHolder}
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/prescriptions')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3"
        >
          <ArrowLeftOutlined />
          <span className="text-sm">Back to Prescriptions</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">New Prescription</h1>
      </div>

      {/* Form */}
      <div className="bg-white">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient */}
            <Form.Item
              label="Patient"
              name="patient_id"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                placeholder="Select Patient"
                showSearch
                size='large'
                loading={loading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={patients.map((patient) => ({
                  value: patient.id,
                  label: `${patient.first_name} ${patient.last_name}`,
                }))}
                notFoundContent={loading ? <Spin size="small" /> : 'No patients found'}
              />
            </Form.Item>

            {/* Doctor Name */}
            <Form.Item
              label="Doctor Name"
              name="doctor_name"
              rules={[{ required: true, message: 'Please enter doctor name' }]}
            >
              <Input
                placeholder="e.g., Dr. John Doe"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication Name */}
            <Form.Item
              label="Medication Name"
              name="medication_name"
              rules={[{ required: true, message: 'Please enter medication name' }]}
            >
              <Input
                placeholder="e.g., Amoxicillin"
                size="large"
              />
            </Form.Item>

            {/* Dosage */}
            <Form.Item
              label="Dosage"
              name="dosage"
              rules={[{ required: true, message: 'Please enter dosage' }]}
            >
              <Input
                placeholder="e.g., 500mg"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frequency */}
            <Form.Item
              label="Frequency"
              name="frequency"
              rules={[{ required: true, message: 'Please enter frequency' }]}
            >
              <Input
                placeholder="e.g., Twice daily"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructions */}
            <Form.Item
              label="Instructions"
              name="instructions"
              rules={[{ required: true, message: 'Please enter instructions' }]}
            >
              <TextArea
                rows={4}
                placeholder="Additional instructions (e.g., Take with food, avoid alcohol...)"
              />
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save Prescription
            </Button>
            <Button size="large" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </Form>
      </div>

      {/* Floating Voice Input Button */}
      <FloatingVoiceInput form={form} />
    </div>
  );
}

export default function AddPrescriptionPage() {
  return (
    <App>
      <AddPrescriptionContent />
    </App>
  );
}