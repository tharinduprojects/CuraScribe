'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Card, Row, Col, Progress, message, notification } from 'antd';
import { PlayCircleOutlined, PauseOutlined, AudioOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import PainAssessmentForm from './painAssesment';

const { TextArea } = Input;
const { Option } = Select;

export default function SOAPNotesForm() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [transcript, setTranscript] = useState('');
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [notify, contextHolder] = notification.useNotification();


  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const router = useRouter();

  const [subjective, setSubjective] = useState({
    chiefComplaint: '',
    hpi: ''
  });

  const [ros, setRos] = useState({
    gi: '',
    heent: '',
    cardio: '',
    msk: '',
    neuro: '',
    skin: '',
    respiratory: ''
  });

  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    pulse: ''
  });

  const [physicalExam, setPhysicalExam] = useState({
    gi: '',
    heent: '',
    cardio: '',
    msk: '',
    neuro: '',
    skin: '',
    respiratory: ''
  });

  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch patients from API
  useEffect(() => {
    fetchPatients();
    initializeSpeechRecognition();

    return () => {
      // Cleanup
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
      const response = await fetch('https://18.188.189.85/api/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched patients data:', data);

        // Handle response format: {success: true, patients: [...]}
        const patientsArray = data.patients || data;

        console.log('Is array?', Array.isArray(patientsArray));
        console.log('Patient count:', patientsArray?.length);

        // Ensure data is an array
        if (Array.isArray(patientsArray)) {
          setPatients(patientsArray);
        } else {
          console.error('Data is not an array:', data);
          setPatients([]);
          message.warning('Invalid data format received');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch patients:', response.status, errorText);
        message.error(`Failed to fetch patients: ${response.status}`);
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error(`Error loading patients: ${error.message}`);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = Array.isArray(patients) ? patients.filter(p => {
    if (!searchPatient) return true; // Show all if no search term

    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase().trim();
    const search = (searchPatient || '').toLowerCase().trim();
    const emailMatch = p.email && p.email.toLowerCase().includes(search);
    const phoneMatch = p.phone && p.phone.includes(search);

    return fullName.includes(search) || emailMatch || phoneMatch;
  }) : [];

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          console.log('Speech recognition started');
          notify.success({
            message: 'Microphone activated',
            description: 'You can now start speaking.',
            duration: 3,
          });
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          // Update transcript with final results
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };

        recognition.onerror = (event) => {
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
          console.log('Speech recognition ended');
          if (isRecording) {
            // Restart if still in recording mode
            recognition.start();
          }
        };

        recognitionRef.current = recognition;
      } else {
        console.warn('Speech recognition not supported');
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
      // Stop recording
      recognitionRef.current.stop();
      stopRecordingTimer();

      // Stop audio recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);
      message.info('Recording stopped');
    } else {
      // Start recording
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start speech recognition
      recognitionRef.current.start();

      // Start audio recording
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

        // Stop all tracks
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
    // Logic to parse transcript to SOAP format
    console.log('Parsing to SOAP...');
  };

  const handleClearConversation = () => {
    setTranscript('');
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
    // Validation
    if (!patient) {
      message.error('Please select a patient');
      return;
    }
    if (!doctor) {
      message.error('Please enter doctor name');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        patient_id: patient,
        doctor_name: doctor,
        vital_hr: vitals.heartRate ? parseInt(vitals.heartRate) : null,
        vital_bp: vitals.bloodPressure || "",
        vital_spo2: vitals.pulse ? parseInt(vitals.pulse) : null,
        pe_gi: physicalExam.gi || "",
        pe_heent: physicalExam.heent || "",
        pe_cardio: physicalExam.cardio || "",
        pe_msk_lower_knee: physicalExam.msk || "",
        pe_neuro: physicalExam.neuro || "",
        pe_skin: physicalExam.skin || "",
        pe_respiratory: physicalExam.respiratory || "",
        assessment: assessment || "",
        plan: plan || "",
        // Subjective data
        chief_complaint: subjective.chiefComplaint || "",
        hpi: subjective.hpi || "",
        // ROS data
        ros_gi: ros.gi || "",
        ros_heent: ros.heent || "",
        ros_cardio: ros.cardio || "",
        ros_msk: ros.msk || "",
        ros_neuro: ros.neuro || "",
        ros_skin: ros.skin || "",
        ros_respiratory: ros.respiratory || "",
        // Transcript and audio
        transcript: transcript || "",
        audio_url: audioURL || "",
        pain_assessment: {
          paTranscript: "",
          "cn-intact": false,
          "dtr-intact": false,
          "biceps-reflex": false,
          "knees-reflex": false,
          "achilles-reflex": false,
          "sensory-lue": "",
          "sensory-rue": "",
          "sensory-lle": "",
          "sensory-rle": "",
          "strength-lue": "",
          "strength-rue": "",
          "strength-lle": "",
          "strength-rle": "",
          "neck-flexion": "",
          "neck-extension": "",
          "neck-rotation-l": "",
          "neck-rotation-r": "",
          "neck-lat-flex-l": "",
          "neck-lat-flex-r": "",
          "spurlings-test": false,
          "shoulder-abd-l": "",
          "shoulder-abd-r": "",
          "shoulder-flex-l": "",
          "shoulder-flex-r": "",
          "shoulder-int-rot-l": "",
          "shoulder-int-rot-r": "",
          "shoulder-ext-rot-l": "",
          "shoulder-ext-rot-r": "",
          "rct-test": false,
          "ext-rotation-test": false,
          "gerber-lift-off": false,
          "ac-joint": false,
          "back-flexion": "",
          "back-extension": "",
          "back-rotation-l": "",
          "back-rotation-r": "",
          "back-lat-flex-l": "",
          "back-lat-flex-r": "",
          "tenderness-spinal": false,
          "tenderness-paraspinal": false,
          "trapezius": false,
          "scm": false,
          "heel-walk-normal": false,
          "heel-walk-painful": false,
          "toe-walk-normal": false,
          "toe-walk-painful": false,
          "surgical-scar": "",
          "knee-l-findings": "",
          "knee-r-findings": "",
          "knee-l-rom": "",
          "knee-r-rom": "",
          "knee-l-extension": "",
          "knee-r-extension": "",
          "knee-tenderness": false,
          "knee-laxity": false,
          "ap-draw": false,
          "mcmurray": false,
          "knee-surgical-scar": "",
          "other-findings": "",
          "ekg-results": "",
          "uds-consistent": false,
          "uds-inconsistent": false,
          "additional-labs": "",
          "cot-yes": false,
          "goals-met": false,
          "goals-not-met": false,
          "narcan-prescribed": false,
          "ga-pdmp-reviewed": false,
          "continue-meds": false,
          "exhausted-non-opioid": false,
          "treatment-plan-1": "",
          "treatment-plan-2": "",
          "treatment-plan-3": "",
          "treatment-plan-4": "",
          "treatment-plan-5": "",
          "treatment-plan-6": "",
          "treatment-plan-7": "",
          "treatment-plan-8": "",
          "exercise-stretching": false,
          "massage-therapy": false,
          "heat-ice": false,
          "tens-unit": false,
          "cbt": false,
          "smoking-cessation": false,
          "weight-loss": false,
          "yoga": false,
          "acupuncture": false,
          "avoid-heavy-machinery": false,
          "safe-keeping": false,
          "opioid-complications": false,
          "pt-understanding": false,
          "followup-2wks": false,
          "followup-4wks": false,
          "followup-other": "",
          "random-uds": false,
          "health-screen": false,
          "ekg-12lead": false,
          "arthritic-panel": false,
          "physician-name": "",
          "assessment-date": ""
        }
      };

      const response = await fetch('https://18.188.189.85/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        // message.success('Medical record saved successfully!');
        notify.success({
          message: 'Record Added',
          description: 'Medical record saved successfully!',
          duration: 3,
        });
        // Optionally reset form or redirect
        handleClearConversation();
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        message.error(`Failed to save medical record: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      notify.error({
        message: 'Save failed',
        description: 'Failed to save medical record',
        duration: 3,
      });
      console.error('Error saving medical record:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      {contextHolder}
      <h1 className="text-2xl font-semibold mb-6">SOAP Notes</h1>

      {/* Conversation Section */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Conversation</h2>

        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <Select
                showSearch
                placeholder="Select patient"
                className="w-full"
                value={patient}
                onChange={setPatient}
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
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <Input
                placeholder="Enter doctor name"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <div className="flex gap-2 mb-4">
          <Button
            type="primary"
            icon={isRecording ? <AudioOutlined className="animate-pulse" /> : <AudioOutlined />}
            onClick={toggleRecording}
            className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            danger={isRecording}
          >
            {isRecording ? 'Stop Recording' : 'Dictate Here'}
          </Button>
        </div>

        {/* Audio Waveform Simulation */}
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

        {/* Audio Playback */}
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
          <TextArea
            rows={6}
            placeholder="live transcript will appear here is supported. Otherwise, paste ,enter the conversation"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Note: Speech-to-text requires a compatible browser (Chrome recommended). Otherwise, type/paste the conversation
          </p>
        </div>

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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">CC (Chief Complaint)</label>
                <TextArea
                  rows={4}
                  placeholder="Primary reason for visit..."
                  value={subjective.chiefComplaint}
                  onChange={(e) => setSubjective({ ...subjective, chiefComplaint: e.target.value })}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">HPI (History of Present Illness)</label>
                <TextArea
                  rows={4}
                  placeholder="Onset, duration, severity, modifying factors..."
                  value={subjective.hpi}
                  onChange={(e) => setSubjective({ ...subjective, hpi: e.target.value })}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Review of Systems */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Review of Systems (ROS)</h3>
          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">GI</label>
                <TextArea
                  rows={3}
                  placeholder="GI ros..."
                  value={ros.gi}
                  onChange={(e) => setRos({ ...ros, gi: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">HEENT</label>
                <TextArea
                  rows={3}
                  placeholder="HEENT ROS..."
                  value={ros.heent}
                  onChange={(e) => setRos({ ...ros, heent: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardio</label>
                <TextArea
                  rows={3}
                  placeholder="Cardio ROS..."
                  value={ros.cardio}
                  onChange={(e) => setRos({ ...ros, cardio: e.target.value })}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">MSK - lower knee</label>
                <TextArea
                  rows={3}
                  placeholder="MSK ROS..."
                  value={ros.msk}
                  onChange={(e) => setRos({ ...ros, msk: e.target.value })}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Neuro</label>
                <TextArea
                  rows={3}
                  placeholder="Neuro ROS..."
                  value={ros.neuro}
                  onChange={(e) => setRos({ ...ros, neuro: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skin</label>
                <TextArea
                  rows={3}
                  placeholder="Skin ROS..."
                  value={ros.skin}
                  onChange={(e) => setRos({ ...ros, skin: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory</label>
                <TextArea
                  rows={3}
                  placeholder="Resp ROS..."
                  value={ros.respiratory}
                  onChange={(e) => setRos({ ...ros, respiratory: e.target.value })}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Objective */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Objective</h3>

          <h4 className="text-sm font-semibold mb-3">Vitals</h4>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart rate (bpm)</label>
                <Input
                  placeholder="e.g exam..."
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood pressure (mmHg)</label>
                <Input
                  placeholder="e.g 120/80"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulse ox (%)</label>
                <Select
                  placeholder="Select pulse"
                  className="w-full"
                  value={vitals.pulse}
                  onChange={(val) => setVitals({ ...vitals, pulse: val })}
                >
                  <Option value="95">95%</Option>
                  <Option value="96">96%</Option>
                  <Option value="97">97%</Option>
                  <Option value="98">98%</Option>
                  <Option value="99">99%</Option>
                  <Option value="100">100%</Option>
                </Select>
              </div>
            </Col>
          </Row>

          <h4 className="text-sm font-semibold mb-3">Physical Examination</h4>
          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">GI</label>
                <TextArea
                  rows={3}
                  placeholder="GI exam..."
                  value={physicalExam.gi}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, gi: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">HEENT</label>
                <TextArea
                  rows={3}
                  placeholder="HEENT exam..."
                  value={physicalExam.heent}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, heent: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardio</label>
                <TextArea
                  rows={3}
                  placeholder="Cardio exam..."
                  value={physicalExam.cardio}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, cardio: e.target.value })}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">MSK - lower knee</label>
                <TextArea
                  rows={3}
                  placeholder="MSK exam..."
                  value={physicalExam.msk}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, msk: e.target.value })}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Neuro</label>
                <TextArea
                  rows={3}
                  placeholder="Neuro exam..."
                  value={physicalExam.neuro}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, neuro: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skin</label>
                <TextArea
                  rows={3}
                  placeholder="Skin exam..."
                  value={physicalExam.skin}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, skin: e.target.value })}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory</label>
                <TextArea
                  rows={3}
                  placeholder="Resp exam..."
                  value={physicalExam.respiratory}
                  onChange={(e) => setPhysicalExam({ ...physicalExam, respiratory: e.target.value })}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Assessment */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Assessment</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment</label>
            <TextArea
              rows={6}
              placeholder="Assessment / diagnoses..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
            />
          </div>
        </div>

        {/* Plan */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Plan</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <TextArea
              rows={6}
              placeholder="Plan, medications, follow-ups..."
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={handleSaveToMedicalRecords}
            className="bg-purple-600 hover:bg-purple-700"
            loading={isSaving}
            disabled={isSaving || !patient || !doctor}
          >
            {isSaving ? 'Saving...' : 'Save to Medical Records'}
          </Button>
          <Button onClick={() => router.push('/medical-records')}>View Records</Button>
        </div>
      </Card>

      <PainAssessmentForm />
    </div>
  );
}