'use client';

import { ConfigProvider } from 'antd';
import Header from '../components/header';
import Menu from '../components/menu';
import Image from "next/image";
import { primaryTheme } from '../theme/themeVariable';
import mLogo from '../../public/assets/mLogo.png';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={primaryTheme}>
      <div className="w-[300px] h-[100vh] fixed top-0 left-0 p-4 bg-primary">
        <Image
          src={mLogo}
          alt="CuraScribe Logo"
          className="h-8 object-contain pl-3 mb-5 mt-3"
        />
        <Menu />
      </div>
      <div className="ml-[300px] h-[80vh]">
        <Header />
        <div className="p-6">
          {children}
        </div>
      </div>
    </ConfigProvider>
  );
}