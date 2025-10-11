'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Card, Row, Col, Progress, App, notification, Form } from 'antd';
import { PlayCircleOutlined, PauseOutlined, AudioOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import PainAssessmentForm from './painAssesment';
import FloatingVoiceInput from '@/app/components/FloatingVoiceInput';
import api from '@/app/lib/axios';

const { TextArea } = Input;
const { Option } = Select;

function SOAPNotesContent() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [notify, contextHolder] = notification.useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const router = useRouter();

  useEffect(() => {
    fetchPatients();
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await api.get('/patients');
      const data = response.data;
      const patientsArray = data.patients || (Array.isArray(data) ? data : []);

      if (Array.isArray(patientsArray)) {
        setPatients(patientsArray);
      } else {
        console.error('Data is not an array:', data);
        setPatients([]);
        message.warning('Invalid data format received');
      }
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      message.error(error.response?.data?.message || 'Failed to fetch patients');
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const filteredPatients = Array.isArray(patients) ? patients.filter(p => {
    if (!searchPatient) return true;

    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase().trim();
    const search = (searchPatient || '').toLowerCase().trim();
    const emailMatch = p.email && p.email.toLowerCase().includes(search);
    const phoneMatch = p.phone && p.phone.includes(search);

    return fullName.includes(search) || emailMatch || phoneMatch;
  }) : [];

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          notify.success({
            message: 'Microphone activated',
            description: 'You can now start speaking.',
            duration: 3,
          });
        };

        recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            }
          }

          if (finalTranscript) {
            const currentTranscript = form.getFieldValue('transcript') || '';
            form.setFieldsValue({ transcript: currentTranscript + finalTranscript });
          }
        };

        recognition.onerror = (event: { error: string; }) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            message.error('Microphone access denied. Please allow microphone permissions.');
          } else if (event.error === 'no-speech') {
            message.warning('No speech detected. Please try again.');
          } else {
            message.error(`Speech recognition error: ${event.error}`);
          }
          setIsRecording(false);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        };

        recognition.onend = () => {
          if (isRecording) {
            recognition.start();
          }
        };

        recognitionRef.current = recognition;
      } else {
        message.warning('Speech recognition is not supported in this browser. Please use Chrome.');
      }
    }
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      message.error('Speech recognition not available. Please use Chrome browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      stopRecordingTimer();

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);
      message.info('Recording stopped');
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      recognitionRef.current.start();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      startRecordingTimer();
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      message.error('Failed to start recording. Please allow microphone access.');
    }
  };

  const handleParseToSOAP = () => {
    console.log('Parsing to SOAP...');
  };

  const handleClearConversation = () => {
    form.setFieldsValue({ transcript: '' });
    setRecordingTime(0);
    setAudioURL('');
    setIsPlaying(false);
    if (isRecording) {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      stopRecordingTimer();
      setIsRecording(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioURL) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSaveToMedicalRecords = async () => {
    try {
      const values = await form.validateFields();

      if (!values.patient) {
        message.error('Please select a patient');
        return;
      }
      if (!values.doctor) {
        message.error('Please enter doctor name');
        return;
      }

      setIsSaving(true);

      const payload = {
        patient_id: values.patient,
        doctor_name: values.doctor,
        vital_hr: values.heartRate ? parseInt(values.heartRate) : null,
        vital_bp: values.bloodPressure || "",
        vital_spo2: values.pulse ? parseInt(values.pulse) : null,
        pe_gi: values.pe_gi || "",
        pe_heent: values.pe_heent || "",
        pe_cardio: values.pe_cardio || "",
        pe_msk_lower_knee: values.pe_msk || "",
        pe_neuro: values.pe_neuro || "",
        pe_skin: values.pe_skin || "",
        pe_respiratory: values.pe_respiratory || "",
        assessment: values.assessment || "",
        plan: values.plan || "",
        chief_complaint: values.chiefComplaint || "",
        hpi: values.hpi || "",
        ros_gi: values.ros_gi || "",
        ros_heent: values.ros_heent || "",
        ros_cardio: values.ros_cardio || "",
        ros_msk: values.ros_msk || "",
        ros_neuro: values.ros_neuro || "",
        ros_skin: values.ros_skin || "",
        ros_respiratory: values.ros_respiratory || "",
        transcript: values.transcript || "",
        audio_url: audioURL || "",
        pain_assessment: {}
      };

      const response = await api.post('/medical-records', payload);

      notify.success({
        message: 'Record Added',
        description: 'Medical record saved successfully!',
        duration: 3,
      });

      form.resetFields();
      handleClearConversation();
    } catch (error: any) {
      console.error('Error saving medical record:', error);
      message.error(error.response?.data?.message || 'Failed to save medical record');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {contextHolder}
      <h1 className="text-2xl font-semibold mb-6">SOAP Notes</h1>

      <Form form={form} layout="vertical">
        {/* Conversation Section */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Conversation</h2>

          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Form.Item
                name="patient"
                label="Patient"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select
                  showSearch
                  placeholder="Select patient"
                  onSearch={setSearchPatient}
                  loading={loadingPatients}
                  filterOption={false}
                  optionLabelProp="label"
                >
                  {filteredPatients.map((p) => (
                    <Option
                      key={p.id}
                      value={p.id}
                      label={`${p.first_name} ${p.last_name}`}
                    >
                      <div>
                        <div className="font-medium">
                          {p.first_name} {p.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.email && <span>{p.email}</span>}
                          {p.email && p.phone && <span> • </span>}
                          {p.phone && <span>{p.phone}</span>}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctor"
                label="Doctor"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Enter doctor name" />
              </Form.Item>
            </Col>
          </Row>

          {isRecording && (
            <div className="mb-4 flex items-center gap-3 bg-slate-200 rounded p-3">
              <AudioOutlined className="text-red-600 text-2xl animate-pulse" />
              <div className="flex-1">
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor="#dc2626"
                  trailColor="#fee2e2"
                  status="active"
                />
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {audioURL && !isRecording && (
            <div className="mb-4">
              <div className="flex items-center gap-3 bg-slate-200 p-3 rounded">
                <Button
                  type="text"
                  icon={isPlaying ? <PauseOutlined className="text-purple-600 text-2xl" /> : <PlayCircleOutlined className="text-purple-600 text-2xl" />}
                  onClick={togglePlayPause}
                />
                <div className="flex-1">
                  <audio
                    ref={audioRef}
                    src={audioURL}
                    onEnded={handleAudioEnded}
                    className="w-full"
                    controls
                  />
                </div>
              </div>
            </div>
          )}

          <Form.Item
            name="transcript"
            label="Transcript"
          >
            <TextArea
              rows={6}
              placeholder="Live transcript will appear here if supported. Otherwise, paste or enter the conversation"
              className="resize-none"
            />
          </Form.Item>
          <p className="text-xs text-gray-500 -mt-4 mb-4">
            Note: Speech-to-text requires a compatible browser (Chrome recommended). Otherwise, type/paste the conversation
          </p>

          <div className="flex gap-2">
            <Button type="primary" onClick={handleParseToSOAP} className="bg-purple-600 hover:bg-purple-700">
              Parse to SOAP
            </Button>
            <Button onClick={handleClearConversation}>Clear Conversation</Button>
          </div>
        </Card>

        {/* Report Section */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Report</h2>

          {/* Subjective */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Subjective</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="chiefComplaint" label="CC (Chief Complaint)">
                  <TextArea rows={4} placeholder="Primary reason for visit..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="hpi" label="HPI (History of Present Illness)">
                  <TextArea rows={4} placeholder="Onset, duration, severity, modifying factors..." />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Review of Systems */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Review of Systems (ROS)</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ros_gi" label="GI">
                  <TextArea rows={3} placeholder="GI ROS..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ros_heent" label="HEENT">
                  <TextArea rows={3} placeholder="HEENT ROS..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ros_cardio" label="Cardio">
                  <TextArea rows={3} placeholder="Cardio ROS..." />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ros_msk" label="MSK - lower knee">
                  <TextArea rows={3} placeholder="MSK ROS..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ros_neuro" label="Neuro">
                  <TextArea rows={3} placeholder="Neuro ROS..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ros_skin" label="Skin">
                  <TextArea rows={3} placeholder="Skin ROS..." />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ros_respiratory" label="Respiratory">
                  <TextArea rows={3} placeholder="Resp ROS..." />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Objective */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Objective</h3>

            <h4 className="text-sm font-semibold mb-3">Vitals</h4>
            <Row gutter={16} className="mb-4">
              <Col span={8}>
                <Form.Item name="heartRate" label="Heart rate (bpm)">
                  <Input placeholder="e.g. 72" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="bloodPressure" label="Blood pressure (mmHg)">
                  <Input placeholder="e.g 120/80" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pulse" label="Pulse ox (%)">
                  <Select placeholder="Select pulse">
                    <Option value="95">95%</Option>
                    <Option value="96">96%</Option>
                    <Option value="97">97%</Option>
                    <Option value="98">98%</Option>
                    <Option value="99">99%</Option>
                    <Option value="100">100%</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <h4 className="text-sm font-semibold mb-3">Physical Examination</h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="pe_gi" label="GI">
                  <TextArea rows={3} placeholder="GI exam..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pe_heent" label="HEENT">
                  <TextArea rows={3} placeholder="HEENT exam..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pe_cardio" label="Cardio">
                  <TextArea rows={3} placeholder="Cardio exam..." />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="pe_msk" label="MSK - lower knee">
                  <TextArea rows={3} placeholder="MSK exam..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pe_neuro" label="Neuro">
                  <TextArea rows={3} placeholder="Neuro exam..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pe_skin" label="Skin">
                  <TextArea rows={3} placeholder="Skin exam..." />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="pe_respiratory" label="Respiratory">
                  <TextArea rows={3} placeholder="Resp exam..." />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Assessment */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Assessment</h3>
            <Form.Item name="assessment" label="Assessment">
              <TextArea rows={6} placeholder="Assessment / diagnoses..." />
            </Form.Item>
          </div>

          {/* Plan */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Plan</h3>
            <Form.Item name="plan" label="Plan">
              <TextArea rows={6} placeholder="Plan, medications, follow-ups..." />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={handleSaveToMedicalRecords}
              className="bg-purple-600 hover:bg-purple-700"
              loading={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save to Medical Records'}
            </Button>
            <Button onClick={() => router.push('/medical-records')}>View Records</Button>
          </div>
        </Card>
      </Form>

      <PainAssessmentForm />

      {/* Floating Voice Input Button */}
      <FloatingVoiceInput form={form} />
    </div>
  );
}

export default function SOAPNotesForm() {
  return (
    <App>
      <SOAPNotesContent />
    </App>
  );
}