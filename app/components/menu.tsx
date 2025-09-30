'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  Settings,
  ClipboardList,
  ClipboardCheck
} from 'lucide-react';

export default function Menu() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Patients', href: '/patients' },
    { icon: Calendar, label: 'Appointments', href: '/appointments' },
    { icon: FileText, label: 'Medical Records', href: '/medical-records' },
    { icon: Pill, label: 'Prescriptions', href: '/prescriptions' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: ClipboardList, label: 'SOAP Notes', href: '/soap-notes' },
    { icon: ClipboardCheck, label: 'Pain Assessment', href: '/pain-assessment' }
  ];

  return (
    <div className="w-64 min-h-screen">
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2 mb-1 text-lg font-medium rounded-lg transition-colors duration-200 ${isActive
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-white/20'
                }`}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}