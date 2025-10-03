'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { FileEdit } from 'lucide-react';
import type { GetProps } from 'antd';

type OTPProps = GetProps<typeof Input.OTP>;

export default function VerifyIdentityPage() {
  const [timer, setTimer] = useState(45);
  const [otpValue, setOtpValue] = useState('');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange: OTPProps['onChange'] = (text) => {
    setOtpValue(text);
  };

  const handleVerify = () => {
    console.log('Verification code:', otpValue);
  };

  const handleResendCode = () => {
    setTimer(45);
    setOtpValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/logoLarge.png" className='mx-auto mb-8' alt="" />

        </div>

        <div className=" p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Verify Your Identity
          </h2>
          <p className="text-sm text-gray-500 text-center mb-2">
            We sent a 6-digit code to j***4@gmail.com.
          </p>
          <p className="text-sm text-gray-500 text-center mb-6">
            It will expire in 45 seconds.
          </p>

          <div className="flex justify-center mb-4">
            <style jsx global>{`
              .ant-otp input {
                width: 56px !important;
                height: 56px !important;
                font-size: 20px !important;
                font-weight: 600 !important;
              }
            `}</style>
            <Input.OTP
              length={6}
              value={otpValue}
              onChange={handleChange}
              size="large"
              style={{ gap: '8px' }}
            />
          </div>

          <div className="flex justify-between items-center text-sm mb-6">
            <span className="text-gray-500">
              Expires in 00:{timer.toString().padStart(2, '0')}
            </span>
            <Button
              type="link"
              className="text-purple-600 p-0"
              onClick={handleResendCode}
            >
              Resend Code
            </Button>
          </div>

          <Button
            type="primary"
            size="large"
            block
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleVerify}
            disabled={otpValue.length !== 6}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}