import { ConfigProvider } from "antd";
import { primaryTheme } from "../theme/themeVariable";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    <ConfigProvider theme={primaryTheme}>

      {children}
    </ConfigProvider>
  </>;
}