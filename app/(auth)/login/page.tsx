'use client';

import React from 'react';
import { Form, Input, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log('Login values:', values);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">

          </div>
        </div>

        {/* Login Form Card */}
        <div className="p-8">
          <img src="/assets/logoLarge.png" className='mx-auto mb-8' alt="" />
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Log in to your account
            </h2>
            <p className="text-gray-500 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">User Name</span>}
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input
                placeholder="Enter your user name"
                className="rounded"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                placeholder="••••••••"
                className="rounded"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                block
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
