'use client';

import { Form, Input, Select, Button, Row, Col, Table, DatePicker } from 'antd';
import { ArrowLeft, Search, Trash2, Calendar } from 'lucide-react';
import { MedicineBoxOutlined, ExperimentOutlined, SyncOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface MedicationRow {
  key: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

interface HistoryData {
  key: string;
  dateTime: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

export default function AddPrescriptionsPage() {
  const [form] = Form.useForm();
  const [medications, setMedications] = useState<MedicationRow[]>([
    { key: '1', medicationName: '', dosage: '', frequency: '', instructions: '' },
    { key: '2', medicationName: '', dosage: '', frequency: '', instructions: '' },
  ]);

  const addMedication = () => {
    const newMedication: MedicationRow = {
      key: Date.now().toString(),
      medicationName: '',
      dosage: '',
      frequency: '',
      instructions: '',
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (key: string) => {
    setMedications(medications.filter(med => med.key !== key));
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  const historyColumns: ColumnsType<HistoryData> = [
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: 150,
    },
    {
      title: 'Medication Name',
      dataIndex: 'medicationName',
      key: 'medicationName',
      width: 150,
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
      width: 120,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 150,
    },
    {
      title: 'Instructions',
      dataIndex: 'instructions',
      key: 'instructions',
    },
  ];

  const historyData: HistoryData[] = [
    {
      key: '1',
      dateTime: 'Today, 10:30am',
      medicationName: 'Actos',
      dosage: '500mg',
      frequency: 'Twice daily',
      instructions: 'Outline any follow-up actions or monitoring that may be neces...',
    },
    {
      key: '2',
      dateTime: 'Today, 11:00am',
      medicationName: 'Adderall',
      dosage: '1000mg',
      frequency: 'Once every morning',
      instructions: 'Mention any allergies or contraindications that should be noted.',
    },
    {
      key: '3',
      dateTime: 'Today, 11:30am',
      medicationName: 'Ritalin',
      dosage: '250mg',
      frequency: 'Three times a week',
      instructions: 'Add any special instructions or considerations for the patient\'s...',
    },
    {
      key: '4',
      dateTime: 'Today, 12:00pm',
      medicationName: 'Vyvanse',
      dosage: '750mg',
      frequency: 'Every Friday',
      instructions: 'Include any relevant information that may assist in the prescri...',
    },
    {
      key: '5',
      dateTime: 'Today, 12:30pm',
      medicationName: 'Concerta',
      dosage: '1250mg',
      frequency: 'As needed',
      instructions: 'Please provide any specific details or guidelines that should b...',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/prescriptions" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-3">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Prescriptions</span>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Add New Prescriptions</h1>
          <div className="flex gap-3">
            <Button size="large">Cancel</Button>
            <Button
              type="primary"
              size="large"
              className="bg-purple-600"
              onClick={() => form.submit()}
            >
              Save Prescriptions
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
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

            <Col span={12}>
              <Form.Item
                label="Doctor Name"
                name="doctorName"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Doctor name" prefix={<span className="text-gray-400"><UserOutlined /></span>} />
              </Form.Item>
            </Col>
          </Row>

          {/* Medication Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Medication</h2>

            <div className="space-y-4">
              {medications.map((med) => (
                <Row gutter={16} key={med.key} align="middle">
                  <Col span={5}>
                    <Input
                      placeholder="Enter medication name"
                      prefix={<MedicineBoxOutlined className="text-gray-400" />}
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      placeholder="e.g. 500mg"
                      prefix={<ExperimentOutlined className="text-gray-400" />}
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="E.g. Twice d..."
                      prefix={<SyncOutlined className="text-gray-400" />}
                    />
                  </Col>
                  <Col span={9}>
                    <Input
                      placeholder="Additional notes or instructions"
                      prefix={<EditOutlined className="text-gray-400" />}
                    />
                  </Col>
                  <Col span={1}>
                    <Button
                      type="text"
                      danger
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => removeMedication(med.key)}
                      disabled={medications.length === 1}
                    />
                  </Col>
                </Row>
              ))}
            </div>

            <Button
              type="dashed"
              onClick={addMedication}
              className="mt-4"
            >
              Add Medication
            </Button>
          </div>
        </Form>
      </div>

      {/* Patient Medication History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Patient Medication History</h2>
          <Button type="primary" className="bg-purple-600">
            View All
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            className="w-64"
          />
          <Button icon={<Calendar className="w-4 h-4" />}>
            Date Range
          </Button>
        </div>

        <Table
          columns={historyColumns}
          dataSource={historyData}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            position: ['bottomCenter'],
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') {
                return <Button>Previous</Button>;
              }
              if (type === 'next') {
                return <Button>Next</Button>;
              }
              return originalElement;
            },
          }}
        />
      </div>
    </div>
  );
}