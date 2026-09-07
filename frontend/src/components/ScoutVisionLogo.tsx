import React from "react";

interface ScoutVisionLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
}

export default function ScoutVisionLogo({
  className = "",
  iconSize = 32,
  showText = true,
  textSize = "text-xl"
}: ScoutVisionLogoProps) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div
        className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        <img
          src="/logos/scoutvision_icon.png"
          alt="ScoutVision Logo"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,99,0,0.4)]"
        />
      </div>
      {showText && (
        <span className={`font-bold tracking-tight font-sans ${textSize} text-white`}>
          Scout<span className="text-[#ff6300]">Vision</span>
        </span>
      )}
    </div>
  );
}
