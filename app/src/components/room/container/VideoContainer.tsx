import { Video } from "lucide-react";
import React from "react";

const VideoContainer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Video size={112} className="text-[#171717]" />
      {/* <p className="text-white/50 text-xs uppercase">Coming Soon!</p> */}
    </div>
  );
};

export default VideoContainer;
