'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Input, Spin, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import dayjs from 'dayjs';

interface PatientData {
  key: string;
  id: string;
  patientId: number;
  name: string;
  age: number | string;
  contact: string;
  lastVisit: string;
}

interface PrescriptionData {
  id: number;
  patient_id: number;
  doctor_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  created_at: string;
}

export default function PatientManagementPage() {
  const router = useRouter();
  const [allPatients, setAllPatients] = useState<PatientData[]>([]);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Prescription modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients');

        if (res.data.success && Array.isArray(res.data.patients)) {
          const mappedData: PatientData[] = res.data.patients.map((p: any) => ({
            key: String(p.id),
            id: `#${p.id}`,
            patientId: p.id,
            name: `${p.first_name} ${p.last_name}`.trim(),
            age: p.date_of_birth
              ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()
              : 'N/A',
            contact: p.phone || p.email || 'N/A',
            lastVisit: p.updated_at
              ? dayjs(p.updated_at).format('MM-DD-YYYY')
              : 'N/A',
          }));
          setAllPatients(mappedData);
          setPatients(mappedData);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = allPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPatients(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, allPatients]);

  const fetchPatientPrescriptions = async (patientId: number) => {
    setLoadingPrescriptions(true);
    setPrescriptions([]);

    try {
      const res = await api.get('/prescriptions');

      if (res.data.success && Array.isArray(res.data.prescriptions)) {
        // Filter prescriptions for the selected patient
        const patientPrescriptions = res.data.prescriptions.filter(
          (prescription: PrescriptionData) => prescription.patient_id === patientId
        );
        setPrescriptions(patientPrescriptions);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const handleRowClick = (record: PatientData) => {
    setSelectedPatient(record);
    setIsModalVisible(true);
    fetchPatientPrescriptions(record.patientId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
    setPrescriptions([]);
  };

  const columns: ColumnsType<PatientData> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Last Visit', dataIndex: 'lastVisit', key: 'lastVisit' },
  ];

  const prescriptionColumns: ColumnsType<PrescriptionData> = [
    {
      title: 'Doctor',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      width: 150
    },
    {
      title: 'Medication',
      dataIndex: 'medication_name',
      key: 'medication_name'
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
      width: 120
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 150
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD-YYYY')
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800 whitespace-nowrap">
          Patient Management
        </h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by name, ID, or contact"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Export</Button>
          <Button
            type="primary"
            onClick={() => router.push('/patients/add-patients')}
          >
            Add New Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="small" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={patients}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
            pagination={{
              pageSize: 20,
              showSizeChanger: false,
              position: ['bottomCenter'],
              showTotal: (total, range) =>
                `Page ${range[0]} of ${Math.ceil(total / 7)}`,
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
        )}
      </div>

      <Modal
        title={`Prescriptions for ${selectedPatient?.name}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={900}
      >
        {loadingPrescriptions ? (
          <div className="flex justify-center py-10">
            <Spin size='small' />
          </div>
        ) : prescriptions.length > 0 ? (
          <Table
            columns={prescriptionColumns}
            dataSource={prescriptions}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            No prescriptions found for this patient.
          </div>
        )}
      </Modal>
    </div>
  );
}