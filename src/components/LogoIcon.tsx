import React, { useState } from "react";

type LogoIconProps = {
  className?: string;
  alt?: string;
};

// Intentamos cargar el favicon desde rutas comunes.
const SOURCES = ["/favicon.svg", "/favicon.ico", "/favicon.png"] as const;

export default function LogoIcon({ className, alt = "Finanz" }: LogoIconProps) {
  const [index, setIndex] = useState(0);
  const src = SOURCES[index] || SOURCES[0];

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setIndex((i) => (i < SOURCES.length - 1 ? i + 1 : i));
      }}
    />
  );
}
