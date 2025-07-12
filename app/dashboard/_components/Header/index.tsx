import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";

function Header({ isMobile, onMenuClick }: { isMobile: boolean; onMenuClick: () => void }) {
  return (
    <header>
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          style={{
            fontSize: "16px",
            width: 40,
            height: 40,
            marginRight: 16,
          }}
        />
      )}
      {/* 其他头部内容 */}
    </header>
  );
}

export default Header;
