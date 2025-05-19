import { useQuery } from "@tanstack/react-query";
import { Image, Spin } from "antd";
import React from "react";
import { authService } from "../services/auth.service";

type BaseProps = {
  keyFile: string | undefined | null;
  type: "image" | "video" | "audio" | "file";
};

type ProtectedImageProps =
  | (BaseProps & {
      type: "image";
    } & React.ImgHTMLAttributes<HTMLImageElement>)
  | (BaseProps & {
      type: "video";
    } & React.VideoHTMLAttributes<HTMLVideoElement>)
  | (BaseProps & {
      type: "audio";
    } & React.AudioHTMLAttributes<HTMLAudioElement>)
  | (BaseProps & {
      type: "file";
    } & React.HTMLAttributes<HTMLAnchorElement>);

const ProtectedFile = ({ keyFile, type, ...props }: ProtectedImageProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["img", keyFile],
    enabled: !!keyFile,
    queryFn: () => authService.image(keyFile ?? ""),
  });

  if (isLoading) {
    return (
      <div className="h-fit">
        <Spin size="small" />
      </div>
    );
  }

  if (type === "file") {
    return (
      <iframe
        src={data?.presignedUrl}
        {...(props as React.HTMLAttributes<HTMLIFrameElement>)}
      />
    );
  }

  if (type === "audio") {
    return (
      <audio
        src={data?.presignedUrl}
        controls
        {...(props as React.AudioHTMLAttributes<HTMLAudioElement>)}
      />
    );
  }

  if (type === "video") {
    return (
      <video
        src={data?.presignedUrl}
        controls
        {...(props as React.VideoHTMLAttributes<HTMLVideoElement>)}
      />
    );
  }

  return (
    // @ts-expect-error antd image component
    <Image
      src={data?.presignedUrl}
      {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
};

export default ProtectedFile;
