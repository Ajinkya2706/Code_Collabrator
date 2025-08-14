import { Cog } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  tab: string;
}

interface RoomSideMenuProps {
  menuItems: MenuItem[];
  onTabChange: (tab: string) => void;
}

const RoomSideMenu: React.FC<RoomSideMenuProps> = ({
  menuItems,
  onTabChange,
}) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-16 border-r">
        <div className="flex flex-col items-center py-4 space-y-4">
          {menuItems.map((item, index) => (
            <Tooltip key={index} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 flex items-center justify-center"
                  onClick={() => onTabChange(item.tab)}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex flex-col mt-auto items-center pb-4">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 flex items-center justify-center"
                onClick={() => onTabChange("settings")}
              >
                <Cog className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RoomSideMenu;
