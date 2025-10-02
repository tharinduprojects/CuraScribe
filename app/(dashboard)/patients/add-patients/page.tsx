'use client';

import { Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const { TextArea } = Input;

export default function AddPatientForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div>
      {/* Header */}
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
          <Button>Cancel</Button>
          <Button type="primary" className="bg-purple-600" onClick={() => form.submit()}>
            Save Patient
          </Button>
        </div>
      </div>

      <div className='bg-gray-100 p-5 rounded-lg'>
        <div className='flex items-end gap-3'>
          <div className='w-full'>
            <label htmlFor="basic-usage">Select a field and click Start Dictation</label>
            <Input placeholder="Basic usage" />
          </div>
          <div className='flex gap-3'>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              Start Dictation
            </Button>
            <Button>Stop</Button>
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
          {/* Patient Info Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Patient Info</h2>
            </div>

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
                <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                  <Select placeholder="Select gender">
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                  <Input placeholder="(555) 123-4567" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="patient@e.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Street Address" name="streetAddress">
                  <Input placeholder="City" />
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
                <Form.Item label="Address" name="address">
                  <Input placeholder="12345" />
                </Form.Item>
              </Col>
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
                  <Input placeholder="Tobacco use(1, recreational drugs..." />
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
    </div>
  );
}