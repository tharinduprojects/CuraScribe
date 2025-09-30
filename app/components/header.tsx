'use client'

import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";

const Header = () => {
  return (
    <div className="px-4 py-3 flex justify-between sticky top-0 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Input.Search placeholder="Search patients, records, appointments..." variant="filled" width={400} />
      </div>
      <div className="flex items-center gap-4">
        <BellOutlined />
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-full pr-2.5">
          <Avatar size="small" icon={<UserOutlined />} />
          <span>Dr. John Doe</span>
        </div>
      </div>
    </div>
  );
}

export default Header;