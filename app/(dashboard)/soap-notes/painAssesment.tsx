'use client';

import React, { useState } from 'react';
import { Card, Progress, Button, Input, Select, Checkbox, Radio, Row, Col, Divider, Space } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

export default function PainAssessmentForm() {
  const [transcript, setTranscript] = useState('');

  // Review of Systems
  const [cnIntact, setCnIntact] = useState(false);
  const [dtrIntact, setDtrIntact] = useState(false);
  const [bicepsReflex, setBicepsReflex] = useState(false);
  const [achillesReflex, setAchillesReflex] = useState(false);
  const [sensoryLUE, setSensoryLUE] = useState('');
  const [sensoryRUE, setSensoryRUE] = useState('');
  const [sensoryLLE, setSensoryLLE] = useState('');
  const [sensoryRLE, setSensoryRLE] = useState('');
  const [strengthLUE, setStrengthLUE] = useState('');
  const [strengthRUE, setStrengthRUE] = useState('');
  const [strengthLLE, setStrengthLLE] = useState('');
  const [strengthRLE, setStrengthRLE] = useState('');
  const [spurlingsTest, setSpurlingsTest] = useState(false);

  // Neck Examination
  const [neckFlexion, setNeckFlexion] = useState('');
  const [neckExtension, setNeckExtension] = useState('');
  const [neckRotationL, setNeckRotationL] = useState('');
  const [neckRotationR, setNeckRotationR] = useState('');
  const [neckLatFlexL, setNeckLatFlexL] = useState('');
  const [neckLatFlexR, setNeckLatFlexR] = useState('');

  // Shoulder Examination
  const [shoulderAbdL, setShoulderAbdL] = useState('');
  const [shoulderAbdR, setShoulderAbdR] = useState('');
  const [shoulderFlexL, setShoulderFlexL] = useState('');
  const [shoulderFlexR, setShoulderFlexR] = useState('');
  const [shoulderIntRotL, setShoulderIntRotL] = useState('');
  const [shoulderIntRotR, setShoulderIntRotR] = useState('');
  const [shoulderExtRotL, setShoulderExtRotL] = useState('');
  const [shoulderExtRotR, setShoulderExtRotR] = useState('');
  const [rctTest, setRctTest] = useState(false);
  const [extRotationTest, setExtRotationTest] = useState(false);
  const [gerberTest, setGerberTest] = useState(false);
  const [acJointTest, setAcJointTest] = useState(false);

  // Back Examination
  const [backFlexion, setBackFlexion] = useState('');
  const [backExtension, setBackExtension] = useState('');
  const [backRotationL, setBackRotationL] = useState('');
  const [backRotationR, setBackRotationR] = useState('');
  const [backLatFlexL, setBackLatFlexL] = useState('');
  const [backLatFlexR, setBackLatFlexR] = useState('');
  const [tendernessSpinal, setTendernessSpinal] = useState(false);
  const [tendernessParaspinal, setTendernessParaspinal] = useState(false);
  const [trapezius, setTrapezius] = useState(false);
  const [scm, setScm] = useState(false);

  // Heel/Toe Walk
  const [heelWalk, setHeelWalk] = useState('');
  const [toeWalk, setToeWalk] = useState('');

  // Knee Examination
  const [kneeExamFindings, setKneeExamFindings] = useState('');
  const [kneeInitialFindings, setKneeInitialFindings] = useState('');
  const [kneeExtensionL, setKneeExtensionL] = useState('');
  const [kneeExtensionR, setKneeExtensionR] = useState('');
  const [kneeTenderness, setKneeTenderness] = useState(false);
  const [kneeLaxity, setKneeLaxity] = useState(false);
  const [apDraw, setApDraw] = useState(false);
  const [mcmurray, setMcmurray] = useState(false);
  const [surgicalScar, setSurgicalScar] = useState('');
  const [otherFindings, setOtherFindings] = useState('');

  // Laboratory Tests
  const [ekgResults, setEkgResults] = useState('');
  const [udsResults, setUdsResults] = useState('');
  const [additionalLabs, setAdditionalLabs] = useState('');

  // Assessment & Plan
  const [chronicOpioid, setChronicOpioid] = useState(false);
  const [goalsMet, setGoalsMet] = useState('');
  const [narcanPrescribed, setNarcanPrescribed] = useState(false);
  const [continuedMedication, setContinuedMedication] = useState(false);
  const [exhaustedNonOpioid, setExhaustedNonOpioid] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState(['', '', '', '', '', '', '', '']);

  // Counseling checkboxes
  const [massageTherapy, setMassageTherapy] = useState(false);
  const [incentivePT, setIncentivePT] = useState(false);
  const [chiroUse, setChiroUse] = useState(false);
  const [cbt, setCbt] = useState(false);
  const [weightLoss, setWeightLoss] = useState(false);
  const [yoga, setYoga] = useState(false);
  const [acupuncture, setAcupuncture] = useState(false);
  const [avoidMachinery, setAvoidMachinery] = useState(false);
  const [safeKeeping, setSafeKeeping] = useState(false);
  const [patientUnderstands, setPatientUnderstands] = useState(false);

  const [followup, setFollowup] = useState('');
  const [followupOther, setFollowupOther] = useState('');
  const [randomUDS, setRandomUDS] = useState(false);
  const [ekg12Lead, setEkg12Lead] = useState(false);
  const [withinDose, setWithinDose] = useState(false);
  const [physicianName, setPhysicianName] = useState('');
  const [physicianNPI, setPhysicianNPI] = useState('');

  // Calculate progress dynamically
  const calculateProgress = () => {
    const fields = [
      transcript,
      cnIntact, dtrIntact, bicepsReflex, achillesReflex,
      sensoryLUE, sensoryRUE, sensoryLLE, sensoryRLE,
      strengthLUE, strengthRUE, strengthLLE, strengthRLE,
      spurlingsTest,
      neckFlexion, neckExtension, neckRotationL, neckRotationR, neckLatFlexL, neckLatFlexR,
      shoulderAbdL, shoulderAbdR, shoulderFlexL, shoulderFlexR,
      shoulderIntRotL, shoulderIntRotR, shoulderExtRotL, shoulderExtRotR,
      rctTest, extRotationTest, gerberTest, acJointTest,
      backFlexion, backExtension, backRotationL, backRotationR, backLatFlexL, backLatFlexR,
      tendernessSpinal, tendernessParaspinal, trapezius, scm,
      heelWalk, toeWalk,
      kneeExamFindings, kneeInitialFindings, kneeExtensionL, kneeExtensionR,
      kneeTenderness, kneeLaxity, apDraw, mcmurray,
      surgicalScar, otherFindings,
      ekgResults, udsResults, additionalLabs,
      chronicOpioid, goalsMet, narcanPrescribed,
      continuedMedication, exhaustedNonOpioid,
      ...treatmentPlans,
      massageTherapy, incentivePT, chiroUse, cbt, weightLoss, yoga, acupuncture,
      avoidMachinery, safeKeeping, patientUnderstands,
      followup, followupOther, randomUDS, ekg12Lead, withinDose,
      physicianName, physicianNPI
    ];

    const filledFields = fields.filter(field => {
      if (typeof field === 'boolean') return field === true;
      if (typeof field === 'string') return field.trim() !== '';
      return false;
    }).length;

    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return {
      percentage,
      filledFields,
      totalFields
    };
  };

  const progress = calculateProgress();

  const handleSave = () => {
    console.log('Saving assessment...');
  };

  const handleClear = () => {
    console.log('Clearing form...');
  };

  const handlePrint = () => {
    console.log('Printing form...');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 mb-6 mx-6 pt-6">
        <div className=" mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold">Pain Management Assessment</h1>
            <span className="text-sm font-medium">Progress: {progress.percentage}%</span>
          </div>
          <Progress percent={progress.percentage} strokeColor="#7c3aed" />
          <p className="text-xs text-gray-500 mt-1">{progress.filledFields} out of {progress.totalFields} fields</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">

          <div className="flex gap-2 mb-4">
            <Button type="primary" className="bg-purple-600 hover:bg-purple-700">
              Record Audio
            </Button>
            <Button>Text</Button>
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
              AI Agent to Record
            </Button>
            <Button>Data Prefill</Button>
            <Button>Upload</Button>
          </div>

          <TextArea
            rows={2}
            placeholder="Why is my hair description of data"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">
            Tips: Include phrases like "Strength LUE 5/5 RUE 4/5 LLE 5/5 RLE 5/5", "Sensory LUE intact, RUE diminished", "Biceps and knees reflex normal", "Achilles reflex normal", etc. The AI parser will map these to the checklist. Avoid PHI in tests.
          </p>
        </div>

        {/* Review of Systems */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Review of Systems</h2>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">CRANIAL/STRUCTURAL (CNS/HEENT)</h3>
            <Row gutter={16}>
              <Col span={6}>
                <Checkbox checked={cnIntact} onChange={(e) => setCnIntact(e.target.checked)}>
                  CN I-XII Intact
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox checked={dtrIntact} onChange={(e) => setDtrIntact(e.target.checked)}>
                  DTR Intact
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox checked={bicepsReflex} onChange={(e) => setBicepsReflex(e.target.checked)}>
                  Biceps Reflex Normal
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox checked={achillesReflex} onChange={(e) => setAchillesReflex(e.target.checked)}>
                  Achilles Reflex Normal
                </Checkbox>
              </Col>
            </Row>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">SENSORY (SPINALTHALAMUS)</h3>
            <Row gutter={16}>
              <Col span={6}>
                <label className="block text-sm mb-1">LUE</label>
                <Select className="w-full" value={sensoryLUE} onChange={setSensoryLUE}>
                  <Option value="">Select</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="abnormal">Abnormal</Option>
                </Select>
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">RUE</label>
                <Select className="w-full" value={sensoryRUE} onChange={setSensoryRUE}>
                  <Option value="">Select</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="abnormal">Abnormal</Option>
                </Select>
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">LLE (F)</label>
                <Select className="w-full" value={sensoryLLE} onChange={setSensoryLLE}>
                  <Option value="">Select</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="abnormal">Abnormal</Option>
                </Select>
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">RLE (F)</label>
                <Select className="w-full" value={sensoryRLE} onChange={setSensoryRLE}>
                  <Option value="">Select</Option>
                  <Option value="normal">Normal</Option>
                  <Option value="abnormal">Abnormal</Option>
                </Select>
              </Col>
            </Row>

            <Row gutter={16} className="mt-3">
              <Col span={6}>
                <label className="block text-sm mb-1">STRENGTH LUE</label>
                <Input placeholder="Degrees" value={strengthLUE} onChange={(e) => setStrengthLUE(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">STRENGTH RUE</label>
                <Input placeholder="Degrees" value={strengthRUE} onChange={(e) => setStrengthRUE(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">STRENGTH LLE</label>
                <Input placeholder="Degrees" value={strengthLLE} onChange={(e) => setStrengthLLE(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">STRENGTH RLE</label>
                <Input placeholder="Degrees" value={strengthRLE} onChange={(e) => setStrengthRLE(e.target.value)} />
              </Col>
            </Row>
            <Checkbox className="mt-2" checked={spurlingsTest} onChange={(e) => setSpurlingsTest(e.target.checked)}>
              Spurling's Test (+)
            </Checkbox>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">NECK EXAMINATION</h3>
            <Row gutter={16}>
              <Col span={6}>
                <label className="block text-sm mb-1">FLEXION (0-60°)</label>
                <Input placeholder="Degrees" value={neckFlexion} onChange={(e) => setNeckFlexion(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">EXTENSION (0-60°)</label>
                <Input placeholder="Degrees" value={neckExtension} onChange={(e) => setNeckExtension(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">ROTATION L (0-80°)</label>
                <Input placeholder="Degrees" value={neckRotationL} onChange={(e) => setNeckRotationL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">ROTATION R (0-80°)</label>
                <Input placeholder="Degrees" value={neckRotationR} onChange={(e) => setNeckRotationR(e.target.value)} />
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col span={6}>
                <label className="block text-sm mb-1">LAT FLEXION L</label>
                <Input placeholder="Degrees" value={neckLatFlexL} onChange={(e) => setNeckLatFlexL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">LAT FLEXION R</label>
                <Input placeholder="Degrees" value={neckLatFlexR} onChange={(e) => setNeckLatFlexR(e.target.value)} />
              </Col>
            </Row>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">SHOULDER EXAMINATION</h3>
            <Row gutter={16}>
              <Col span={6}>
                <label className="block text-sm mb-1">ABD L (0-180°)</label>
                <Input placeholder="Degrees" value={shoulderAbdL} onChange={(e) => setShoulderAbdL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">ABD R (0-180°)</label>
                <Input placeholder="Degrees" value={shoulderAbdR} onChange={(e) => setShoulderAbdR(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">FLEXION L (0-180°)</label>
                <Input placeholder="Degrees" value={shoulderFlexL} onChange={(e) => setShoulderFlexL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">FLEXION R (0-180°)</label>
                <Input placeholder="Degrees" value={shoulderFlexR} onChange={(e) => setShoulderFlexR(e.target.value)} />
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col span={6}>
                <label className="block text-sm mb-1">INTERNAL ROTATION L</label>
                <Input placeholder="Degrees" value={shoulderIntRotL} onChange={(e) => setShoulderIntRotL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">INTERNAL ROTATION R</label>
                <Input placeholder="Degrees" value={shoulderIntRotR} onChange={(e) => setShoulderIntRotR(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">EXTERNAL ROTATION L</label>
                <Input placeholder="Degrees" value={shoulderExtRotL} onChange={(e) => setShoulderExtRotL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">EXTERNAL ROTATION R</label>
                <Input placeholder="Degrees" value={shoulderExtRotR} onChange={(e) => setShoulderExtRotR(e.target.value)} />
              </Col>
            </Row>
            <div className="mt-3 flex flex-wrap gap-4">
              <Checkbox checked={rctTest} onChange={(e) => setRctTest(e.target.checked)}>
                RCT: Empty Can Test
              </Checkbox>
              <Checkbox checked={extRotationTest} onChange={(e) => setExtRotationTest(e.target.checked)}>
                Ext-Rotation/Infraspinatus Strength Test
              </Checkbox>
              <Checkbox checked={gerberTest} onChange={(e) => setGerberTest(e.target.checked)}>
                Gerber-Lift-Off Test
              </Checkbox>
              <Checkbox checked={acJointTest} onChange={(e) => setAcJointTest(e.target.checked)}>
                Subacr Decompression / AC Joint Test
              </Checkbox>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">BACK EXAMINATION</h3>
            <Row gutter={16}>
              <Col span={6}>
                <label className="block text-sm mb-1">FLEXION</label>
                <Input placeholder="Degrees" value={backFlexion} onChange={(e) => setBackFlexion(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">EXTENSION</label>
                <Input placeholder="Degrees" value={backExtension} onChange={(e) => setBackExtension(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">ROTATION L</label>
                <Input placeholder="Degrees" value={backRotationL} onChange={(e) => setBackRotationL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">ROTATION R</label>
                <Input placeholder="Degrees" value={backRotationR} onChange={(e) => setBackRotationR(e.target.value)} />
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col span={6}>
                <label className="block text-sm mb-1">LAT FLEXION L</label>
                <Input placeholder="Degrees" value={backLatFlexL} onChange={(e) => setBackLatFlexL(e.target.value)} />
              </Col>
              <Col span={6}>
                <label className="block text-sm mb-1">LAT FLEXION R</label>
                <Input placeholder="Degrees" value={backLatFlexR} onChange={(e) => setBackLatFlexR(e.target.value)} />
              </Col>
            </Row>
            <div className="mt-3 flex gap-4">
              <Checkbox checked={tendernessSpinal} onChange={(e) => setTendernessSpinal(e.target.checked)}>
                Tenderness: Spinal
              </Checkbox>
              <Checkbox checked={tendernessParaspinal} onChange={(e) => setTendernessParaspinal(e.target.checked)}>
                Tenderness: Paraspinal (L/R)
              </Checkbox>
              <Checkbox checked={trapezius} onChange={(e) => setTrapezius(e.target.checked)}>
                Trapezius (L/R)
              </Checkbox>
              <Checkbox checked={scm} onChange={(e) => setScm(e.target.checked)}>
                SCM (L/R)
              </Checkbox>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">HEEL / TOE WALK</h3>
            <Space direction="vertical">
              <Radio.Group value={heelWalk} onChange={(e) => setHeelWalk(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="normal">Heel Walk Normal</Radio>
                  <Radio value="painful">Heel Walk Painful</Radio>
                </Space>
              </Radio.Group>
              <Radio.Group className="mt-2" value={toeWalk} onChange={(e) => setToeWalk(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="normal">Toe Walk Normal</Radio>
                  <Radio value="painful">Toe Walk Painful</Radio>
                </Space>
              </Radio.Group>
            </Space>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-3">KNEE EXAMINATION</h3>
            <Row gutter={16}>
              <Col span={8}>
                <label className="block text-sm mb-1">KNEE EXAM/MANEUVERS</label>
                <TextArea rows={2} placeholder="Initial findings" value={kneeExamFindings} onChange={(e) => setKneeExamFindings(e.target.value)} />
              </Col>
              <Col span={8}>
                <label className="block text-sm mb-1">INITIAL FINDINGS</label>
                <TextArea rows={2} placeholder="Degrees" value={kneeInitialFindings} onChange={(e) => setKneeInitialFindings(e.target.value)} />
              </Col>
              <Col span={8}>
                <label className="block text-sm mb-1">EXTENSION L (0-0°)</label>
                <TextArea rows={2} placeholder="Degrees" value={kneeExtensionL} onChange={(e) => setKneeExtensionL(e.target.value)} />
              </Col>
            </Row>
            <div className="mt-3">
              <label className="block text-sm mb-1">EXTENSION R (0-0°)</label>
              <TextArea rows={2} placeholder="Knee extension" value={kneeExtensionR} onChange={(e) => setKneeExtensionR(e.target.value)} />
            </div>
            <div className="mt-3 flex gap-4">
              <Checkbox checked={kneeTenderness} onChange={(e) => setKneeTenderness(e.target.checked)}>
                Tenderness Swelling
              </Checkbox>
              <Checkbox checked={kneeLaxity} onChange={(e) => setKneeLaxity(e.target.checked)}>
                Laxity (Valgus)
              </Checkbox>
              <Checkbox checked={apDraw} onChange={(e) => setApDraw(e.target.checked)}>
                AP Draw (Sag/Lhr)
              </Checkbox>
              <Checkbox checked={mcmurray} onChange={(e) => setMcmurray(e.target.checked)}>
                McMurray's Sign (Right/Left)
              </Checkbox>
            </div>
            <div className="mt-3">
              <label className="block text-sm mb-1">SURGICAL SCAR</label>
              <Input placeholder="For Left/Right" value={surgicalScar} onChange={(e) => setSurgicalScar(e.target.value)} />
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">OTHER PHYSICAL FINDINGS</h3>
            <TextArea
              rows={3}
              placeholder="ABNORMAL PHYSICAL EXAM DETAILS (PALPABLE Mass, OTHER ABNORMALITIES, Coccyx, etc.)"
              value={otherFindings}
              onChange={(e) => setOtherFindings(e.target.value)}
            />
          </div>
        </Card>

        {/* Laboratory & Diagnostic Tests */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Laboratory & Diagnostic Tests</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">EKG</label>
            <label className="block text-sm mb-1">EKG RESULTS</label>
            <TextArea rows={2} placeholder="Enter EKG findings" value={ekgResults} onChange={(e) => setEkgResults(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">UDS (URINE DRUG SCREEN)</label>
            <Radio.Group value={udsResults} onChange={(e) => setUdsResults(e.target.value)}>
              <Space direction="vertical">
                <Radio value="consistent">Consistent</Radio>
                <Radio value="inconsistent">Inconsistent</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ADDITIONAL LABS</label>
            <label className="block text-sm mb-1">OTHER LABORATORY RESULTS</label>
            <TextArea
              rows={3}
              placeholder="Enter other lab details..."
              value={additionalLabs}
              onChange={(e) => setAdditionalLabs(e.target.value)}
            />
          </div>
        </Card>

        {/* Assessment & Plan */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Assessment & Plan</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">CHRONIC OPIOID THERAPY STATUS</label>
            <Checkbox checked={chronicOpioid} onChange={(e) => setChronicOpioid(e.target.checked)}>
              Chronic Opioid Therapy Yes
            </Checkbox>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">GOALS</label>
            <Radio.Group value={goalsMet} onChange={(e) => setGoalsMet(e.target.value)}>
              <Space direction="vertical">
                <Radio value="met">Goals Met</Radio>
                <Radio value="notmet">Goals Not Met</Radio>
                <Radio value="explained">Goals Are Explained to Patient or Surrogate</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">GA PDMP REVIEW</label>
            <Checkbox checked={narcanPrescribed} onChange={(e) => setNarcanPrescribed(e.target.checked)}>
              Narcan pill Card
            </Checkbox>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">MEDICATION PLAN</label>
            <Space direction="vertical">
              <Checkbox checked={continuedMedication} onChange={(e) => setContinuedMedication(e.target.checked)}>
                Continued Medication Regimen
              </Checkbox>
              <Checkbox checked={exhaustedNonOpioid} onChange={(e) => setExhaustedNonOpioid(e.target.checked)}>
                Exhausted Non-Opioid / Multimodal Treatment Options
              </Checkbox>
            </Space>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">TREATMENT PLAN</label>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="mb-2">
                <label className="block text-xs mb-1">{num}.</label>
                <TextArea
                  rows={2}
                  value={treatmentPlans[num - 1]}
                  onChange={(e) => {
                    const newPlans = [...treatmentPlans];
                    newPlans[num - 1] = e.target.value;
                    setTreatmentPlans(newPlans);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">COUNSELING & GUIDANCE / DIRECTIVES</label>
            <Row gutter={[16, 8]}>
              <Col span={8}><Checkbox checked={massageTherapy} onChange={(e) => setMassageTherapy(e.target.checked)}>Massage Therapy</Checkbox></Col>
              <Col span={8}><Checkbox checked={incentivePT} onChange={(e) => setIncentivePT(e.target.checked)}>Incentive PT</Checkbox></Col>
              <Col span={8}><Checkbox checked={chiroUse} onChange={(e) => setChiroUse(e.target.checked)}>Chiro use</Checkbox></Col>
              <Col span={8}><Checkbox checked={cbt} onChange={(e) => setCbt(e.target.checked)}>Cognitive Behavioral Therapy</Checkbox></Col>
              <Col span={8}><Checkbox checked={weightLoss} onChange={(e) => setWeightLoss(e.target.checked)}>Weight Loss</Checkbox></Col>
              <Col span={8}><Checkbox checked={yoga} onChange={(e) => setYoga(e.target.checked)}>Yoga</Checkbox></Col>
              <Col span={8}><Checkbox checked={acupuncture} onChange={(e) => setAcupuncture(e.target.checked)}>Acupuncture</Checkbox></Col>
              <Col span={8}><Checkbox checked={avoidMachinery} onChange={(e) => setAvoidMachinery(e.target.checked)}>Avoid Heavy Use of Machinery or Equipment</Checkbox></Col>
              <Col span={8}><Checkbox checked={safeKeeping} onChange={(e) => setSafeKeeping(e.target.checked)}>Safe-Keeping and Disposal of Medicine</Checkbox></Col>
              <Col span={8}><Checkbox checked={patientUnderstands} onChange={(e) => setPatientUnderstands(e.target.checked)}>Patient Understands the Goals</Checkbox></Col>
            </Row>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">FOLLOW-UP</label>
            <Radio.Group value={followup} onChange={(e) => setFollowup(e.target.value)}>
              <Space>
                <Radio value="2weeks">2 weeks</Radio>
                <Radio value="4weeks">4 weeks</Radio>
                <Radio value="other">Other</Radio>
              </Space>
            </Radio.Group>
            {followup === 'other' && (
              <Input
                placeholder="Specify follow-up"
                className="mt-2"
                value={followupOther}
                onChange={(e) => setFollowupOther(e.target.value)}
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">NEXT VISIT PLANS</label>
            <Row gutter={16}>
              <Col span={6}>
                <Checkbox checked={randomUDS} onChange={(e) => setRandomUDS(e.target.checked)}>
                  Random UDS
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox checked={ekg12Lead} onChange={(e) => setEkg12Lead(e.target.checked)}>
                  EKG 12 Lead
                </Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox checked={withinDose} onChange={(e) => setWithinDose(e.target.checked)}>
                  Within Dose
                </Checkbox>
              </Col>
            </Row>
          </div>

          <Divider />

          <div>
            <label className="block text-sm font-medium mb-2">PHYSICIAN SIGNATURE</label>
            <Row gutter={16}>
              <Col span={12}>
                <label className="block text-sm mb-1">ELECTRONICALLY SIGNED BY</label>
                <Input
                  placeholder="Enter physician name"
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <label className="block text-sm mb-1">NPI</label>
                <Select className="w-full" value={physicianNPI} onChange={setPhysicianNPI}>
                  <Option value="">Select</Option>
                  <Option value="npi1">NPI-XXX-XX</Option>
                </Select>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button type="primary" onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            Save Assessment
          </Button>
          <Button onClick={handleClear}>Clear Form</Button>
          <Button onClick={handlePrint}>Print Form</Button>
        </div>
      </div>
    </div>
  );
}