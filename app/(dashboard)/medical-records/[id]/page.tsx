'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, App, Spin, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/axios';

interface MedicalRecordDetail {
  id: number;
  patient_id: number;
  doctor_name: string;
  chief_complaint: string;
  hpi?: string;
  ros_gi?: string;
  ros_heent?: string;
  ros_cardio?: string;
  ros_msk_lower_knee?: string;
  ros_neuro?: string;
  ros_skin?: string;
  ros_respiratory?: string;
  vital_hr?: number;
  vital_bp?: string;
  vital_spo2?: number;
  pe_gi?: string;
  pe_heent?: string;
  pe_cardio?: string;
  pe_msk_lower_knee?: string;
  pe_neuro?: string;
  pe_skin?: string;
  pe_respiratory?: string;
  assessment: string;
  plan?: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  patient?: {
    date_of_birth?: string;
    gender?: string;
    phone?: string;
    email?: string;
  };
}

function MedicalRecordDetailContent() {
  const { message } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const recordId = params.id;

  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Suppress Ant Design React 19 warning
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('[antd: compatible]')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (recordId) {
      fetchRecordDetail();
    }
  }, [recordId]);

  const fetchRecordDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/medical-records/${recordId}`);
      const data = response.data;

      if (data.success && data.record) {
        setRecord(data.record);
      } else {
        message.error('Medical record not found');
      }
    } catch (error) {
      message.error('Failed to fetch medical record details');
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable');
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printableContent = printContent.innerHTML;

    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="small" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl text-gray-800 mb-4">Medical record not found</h2>
        <Button type="primary" onClick={() => router.push('/medical-records')}>
          Back to Medical Records
        </Button>
      </div>
    );
  }

  const patientName = `${record.first_name} ${record.last_name}`.trim();

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b mb-6 no-print">
          <button
            onClick={() => router.push('/medical-records')}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-800 mb-3"
          >
            <ArrowLeftOutlined />
            <span className="text-sm">Back to Records</span>
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Medical Record Details</h1>
            <Button
              type="primary"
              size="large"
              icon={<PrinterOutlined />}
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handlePrint}
            >
              Print Record
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6" id="printable">
          {/* Header Section with Medical Center Info */}
          <div className="bg-white  p-8 mb-6 text-center border-b-4 border-indigo-600">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">MediCore Medical Center</h2>
            <p className="text-gray-800 mb-1">Electronic Health Records System</p>
            <p className="text-sm text-gray-500">123 Medical Drive, Healthcare City, HC 12345 | Phone: (555) 123-CARE</p>
          </div>

          {/* Patient and Visit Information */}
          <Row gutter={16} className="mb-6">
            <Col span={12}>
              <Card title="Patient Information" className="h-full">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Name:</span>
                    <span className="text-gray-700 font-semibold">{patientName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Date of Birth:</span>
                    <span className='text-gray-700'>{record.patient?.date_of_birth ? formatDate(record.patient.date_of_birth) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Age:</span>
                    <span className='text-gray-700'>{calculateAge(record.patient?.date_of_birth)} years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Gender:</span>
                    <span className="capitalize text-gray-700">{record.patient?.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Phone:</span>
                    <span className='text-gray-700'>{record.patient?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-800 font-medium">Email:</span>
                    <span className='text-gray-700'>{record.patient?.email || 'N/A'}</span>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Visit Information" className="h-full">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Record ID:</span>
                    <span className="font-semibold text-gray-700">#MR{String(record.id).padStart(3, '0')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Date of Visit:</span>
                    <span className='text-gray-700'>{formatDate(record.created_at)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Attending Physician:</span>
                    <span className="text-gray-700">{record.doctor_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-800 font-medium">Created:</span>
                    <span className="text-sm text-gray-700">{formatDateTime(record.created_at)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-800 font-medium">Last Updated:</span>
                    <span className="text-sm text-gray-700">{formatDateTime(record.created_at)}</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* SUBJECTIVE Section */}
          <Card className="mb-6">
            <h3 className="text-lg font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">SUBJECTIVE</h3>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Chief Complaint (CC):</h4>
              <p className="text-gray-700 pl-4">{record.chief_complaint}</p>
            </div>

            {record.hpi && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">History of Present Illness (HPI):</h4>
                <p className="text-gray-700 pl-4">{record.hpi}</p>
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Review of Systems (ROS):</h4>
              <div className="pl-4 space-y-2 text-gray-800">
                {record.ros_gi && (
                  <p><span className="font-medium">Gastrointestinal:</span> {record.ros_gi}</p>
                )}
                {record.ros_heent && (
                  <p><span className="font-medium">HEENT:</span> {record.ros_heent}</p>
                )}
                {record.ros_cardio && (
                  <p><span className="font-medium">Cardiovascular:</span> {record.ros_cardio}</p>
                )}
                {record.ros_respiratory && (
                  <p><span className="font-medium">Respiratory:</span> {record.ros_respiratory}</p>
                )}
                {record.ros_msk_lower_knee && (
                  <p><span className="font-medium">Musculoskeletal (Lower/Knee):</span> {record.ros_msk_lower_knee}</p>
                )}
                {record.ros_neuro && (
                  <p><span className="font-medium">Neurological:</span> {record.ros_neuro}</p>
                )}
                {record.ros_skin && (
                  <p><span className="font-medium">Dermatological:</span> {record.ros_skin}</p>
                )}
                {!record.ros_gi && !record.ros_heent && !record.ros_cardio && !record.ros_respiratory && !record.ros_msk_lower_knee && !record.ros_neuro && !record.ros_skin && (
                  <p className="italic text-gray-500">No specific findings documented.</p>
                )}
              </div>
            </div>
          </Card>

          <br />
          <br />
          <br />
          {/* OBJECTIVE Section */}
          <Card className="!my-6">
            <h3 className="text-lg font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">OBJECTIVE</h3>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Vital Signs:</h4>
              <Row gutter={16} className="bg-gray-50 p-4 rounded">
                <Col span={8} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">HEART RATE</div>
                  <div className="text-2xl font-bold text-gray-900">{record.vital_hr ? `${record.vital_hr} bpm` : 'N/A'}</div>
                </Col>
                <Col span={8} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">BLOOD PRESSURE</div>
                  <div className="text-2xl font-bold text-gray-900">{record.vital_bp ? `${record.vital_bp} mmHg` : 'N/A'}</div>
                </Col>
                <Col span={8} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">OXYGEN SATURATION</div>
                  <div className="text-2xl font-bold text-gray-900">{record.vital_spo2 ? `${record.vital_spo2}%` : 'N/A'}</div>
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Physical Examination:</h4>
              <div className="pl-4 space-y-2 text-gray-800">
                {record.pe_gi && (
                  <p><span className="font-medium">Gastrointestinal:</span> {record.pe_gi}</p>
                )}
                {record.pe_heent && (
                  <p><span className="font-medium">HEENT:</span> {record.pe_heent}</p>
                )}
                {record.pe_cardio && (
                  <p><span className="font-medium">Cardiovascular:</span> {record.pe_cardio}</p>
                )}
                {record.pe_respiratory && (
                  <p><span className="font-medium">Respiratory:</span> {record.pe_respiratory}</p>
                )}
                {record.pe_msk_lower_knee && (
                  <p><span className="font-medium">Musculoskeletal (Lower/Knee):</span> {record.pe_msk_lower_knee}</p>
                )}
                {record.pe_neuro && (
                  <p><span className="font-medium">Neurological:</span> {record.pe_neuro}</p>
                )}
                {record.pe_skin && (
                  <p><span className="font-medium">Dermatological:</span> {record.pe_skin}</p>
                )}
                {!record.pe_gi && !record.pe_heent && !record.pe_cardio && !record.pe_respiratory && !record.pe_msk_lower_knee && !record.pe_neuro && !record.pe_skin && (
                  <p className="italic text-gray-500">No specific findings documented.</p>
                )}
              </div>
            </div>
          </Card>

          {/* ASSESSMENT Section */}
          <Card className="!my-6">
            <h3 className="text-lg font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">ASSESSMENT</h3>
            <p className="text-gray-700 leading-relaxed">{record.assessment}</p>
          </Card>

          {/* PLAN Section */}
          <Card className="!my-6">
            <h3 className="text-lg font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">PLAN</h3>
            <p className="text-gray-700 leading-relaxed">{record.plan || 'Treatment plan to be determined based on assessment findings.'}</p>
          </Card>

          {/* Signature Section */}
          <Card>
            <Row gutter={16}>
              <Col span={12} className="text-center">
                <Divider />
                <div className="font-semibold mb-1 text-gray-900">Physician Signature</div>
                <div className="text-gray-800">{record.doctor_name}</div>
              </Col>
              <Col span={12} className="text-center">
                <Divider />
                <div className="font-semibold mb-1 text-gray-900">Date</div>
                <div className="text-gray-800">{formatDate(record.created_at)}</div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function MedicalRecordDetailPage() {
  return (
    <App>
      <MedicalRecordDetailContent />
    </App>
  );
}