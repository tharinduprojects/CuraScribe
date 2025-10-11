'use client';

import { Form, Input, Select, DatePicker, Button, Row, Col, App, notification } from 'antd';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import api from '@/app/lib/axios';
import FloatingVoiceInput from '@/app/components/FloatingVoiceInput';
import { useState } from 'react';

const { TextArea } = Input;

export default function AddPatientForm() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        first_name: values.firstName || '',
        last_name: values.lastName || '',
        date_of_birth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
        gender: values.gender || null,
        phone: values.phoneNumber || '',
        email: values.email || '',
        address: values.streetAddress || '',
        city: values.city || '',
        state: values.state || '',
        zip_code: values.zipCode || '',
        medical_history: values.medicalHistory || '',
        chief_complaint: values.chiefComplaint || '',
        hpi: values.historyOfPresentIllness || '',
        medications: values.medications || '',
        allergies: values.allergies || '',
        past_med_history: values.pastMedicationHistory || '',
        other_med_hx: values.otherMedicalHistory || '',
        pain_history: values.pmhHistory || '',
        surgical_hx: values.surgeries || '',
        family_hx: values.familyHistory || '',
        sexual_hx: values.socialHistory || '',
        drug_use: values.workLife || '',
        employment: values.environment || '',
        education: values.provider || '',
        insurance_id: values.insuranceId || '',
        insurance_company: values.insuranceCompany || '',
        pharmacy_name: values.pharmacyName || '',
        pharmacy_phone: values.pharmacyPhone || '',
        pharmacy_address: values.pharmacyAddress || '',
      };

      const res = await api.post('/patients', payload);

      if (res.status === 201 || res.data.success) {
        notify.success({
          message: 'Patient Added Successfully',
          description: 'Can view patients in Patient Management',
          duration: 3,
        });
        form.resetFields();
      } else {
        message.error('Failed to add patient');
        notify.error({
          message: 'Patient adding failed',
          description: 'Something went wrong adding patient',
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error(error);
      notify.error({
        message: 'Patient adding failed',
        description: 'Something went wrong adding patient',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <App>
      <div className="pb-20">
        {contextHolder}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/patients" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="text-sm text-gray-500">Back to Patient Management</div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Patient</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => router.push('/patients')}>Cancel</Button>
            <Button
              type="primary"
              className="bg-purple-600"
              onClick={() => form.submit()}
              loading={loading}
            >
              Save Patient
            </Button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg p-6">
          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">

            {/* Patient Info Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Info</h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true }]}>
                    <DatePicker placeholder="MM/DD/YYYY" className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Gender" name="gender">
                    <Select placeholder="Select gender">
                      <Select.Option value="male">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input placeholder="(555) 123-4567" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Email" name="email">
                    <Input placeholder="patient@e.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Street Address" name="streetAddress">
                    <Input placeholder="Street" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="City" name="city">
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="State" name="state">
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="ZIP Code" name="zipCode">
                    <Input placeholder="12345" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Medical History" name="medicalHistory">
                <TextArea rows={3} placeholder="Enter relevant medical history..." />
              </Form.Item>
            </div>

            {/* Initial Encounter Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Initial Encounter</h2>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="CC (Chief Complaint)" name="chiefComplaint">
                    <TextArea rows={3} placeholder="Primary reason for visit..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="HPI (History of Present Illness)" name="historyOfPresentIllness">
                    <TextArea rows={3} placeholder="Onset, duration, severity, modifying factors..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Medications" name="medications">
                    <TextArea rows={3} placeholder="Current medications and doses..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Allergies" name="allergies">
                    <TextArea rows={3} placeholder="Drug/food/environmental allergies and reactions..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Past Medication History" name="pastMedicationHistory">
                    <TextArea rows={3} placeholder="Prior medications and reaction..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Other Medical Hx" name="otherMedicalHistory">
                    <TextArea rows={3} placeholder="Chronic conditions, hospitalizations, immunizations..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="PMH History" name="pmhHistory">
                    <TextArea rows={3} placeholder="Past previous, exploratory/x-ray, valve, root, bypass and what you..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Surgeries" name="surgeries">
                    <TextArea rows={3} placeholder="Past surgeries and dates..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Family Hx" name="familyHistory">
                    <TextArea rows={3} placeholder="Relevant family and conditions..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Social Hx" name="socialHistory">
                    <TextArea rows={3} placeholder="Alcohol, exercise, smoking, STI history..." />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Social Hx Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Social Hx</h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Work life" name="workLife">
                    <Input placeholder="Tobacco use(1), recreational drugs..." />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Environment" name="environment">
                    <Input placeholder="Occupation, work status" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Provider" name="provider">
                    <Input placeholder="Highest level of education" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Insurance ID" name="insuranceId">
                    <Input placeholder="Minloan Pllzc 45" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Insurance Company" name="insuranceCompany">
                    <Input placeholder="Paper name" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Pharmacy Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Pharmacy Details</h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Pharmacy Name" name="pharmacyName">
                    <Input placeholder="Enter pharmacy name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pharmacy Phone" name="pharmacyPhone">
                    <Input placeholder="(555) 000-0000" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pharmacy Address" name="pharmacyAddress">
                    <Input placeholder="Street, City, State" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </div>

        {/* Floating Voice Input Button */}
        <FloatingVoiceInput form={form} />
      </div>
    </App>
  );
}