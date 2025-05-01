import { notification } from "antd";

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      notification.success({
        message: "Copied to clipboard",
      });
    },
    (err) => {
      notification.error({
        message: "Failed to copy " + err,
      });
    }
  );
}
