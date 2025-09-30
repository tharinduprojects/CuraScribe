import "@ant-design/v5-patch-for-react-19";  // React 19 compatibility patch for antd v5
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { ConfigProvider } from "antd";
import { primaryTheme } from "./theme/themeVariable";
import Header from "./components/header";
import Image from "next/image";
import Menu from "./components/menu";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={primaryTheme}>
      <html lang="en">
        <body>
          <AntdRegistry>
            <div className="w-[300px] bg-primary h-[100vh] fixed top-0 left-0 p-4">
              <img className="h-8 object-contain pl-3.5 mb-5 mt-3" src="/assets/Mlogo.png" alt="" />
              <Menu />
            </div>
            <div className="ml-[300px] h-[200vh]">
              <Header />
              {children}
            </div>
          </AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
