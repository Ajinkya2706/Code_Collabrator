import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ShareModalAtStart = () => {
  const { roomId } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = `${window.location.origin}/room/${roomId}`;

  // Show modal after 2000ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      //   toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
          className="fixed bottom-4 left-4 z-50"
        >
          <Card className="p-8 pb-8 pt-6 shadow-lg flex flex-col gap-2 w-[360px] bg-background border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute top-2 right-2 cursor-pointer"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="flex flex-col gap-2 mt-2">
              <h3 className="font-medium">Share this room</h3>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-grow text-sm"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={copyToClipboard}
                  className={cn(
                    "transition-all cursor-pointer",
                    isCopied ? "bg-green-500 text-white hover:bg-green-600" : ""
                  )}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModalAtStart;
