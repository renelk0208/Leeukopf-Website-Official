import type { SyntheticEvent } from "react";

type B2BCategoryImageFrameProps = {
  src: string;
  alt: string;
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
  frameClassName?: string;
  imageClassName?: string;
};

export default function B2BCategoryImageFrame({
  src,
  alt,
  onError,
  frameClassName = "",
  imageClassName = "",
}: B2BCategoryImageFrameProps) {
  return (
    <div className={`h-52 w-full bg-grey-100 p-2 ${frameClassName}`.trim()}>
      <img
        src={src}
        alt={alt}
        onError={onError}
        className={`h-full w-full object-contain ${imageClassName}`.trim()}
      />
    </div>
  );
}