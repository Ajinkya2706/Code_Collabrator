import React from "react";

type LoadingSpinnerProps = {
  size?: "default" | "sm";
  text?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "default",
  text = "Loading...",
}) => {
  const spinnerSize = size === "sm" ? "h-6 w-6" : "h-12 w-12";
  const textSize = size === "sm" ? "text-sm" : "text-base";
  const spacing = size === "sm" ? "space-y-2" : "space-y-4";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`text-center ${spacing}`}>
        <div
          className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-[#00E87B] border-r-2 mx-auto`}
        ></div>
        <p className={`text-muted-foreground ${textSize}`}>{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
