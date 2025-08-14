import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LogOut, Moon, Sun, Laptop } from "lucide-react";
import { signOut } from "next-auth/react";

const SettingsTabContent = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-md font-medium">Settings</h2>
      </div>

      <div className="p-4 pt-2">
        <Accordion
          type="single"
          collapsible
          // defaultValue="account"
          className="w-full"
        >
          {/* <AccordionItem value="appearance">
            <AccordionTrigger className="no-underline hover:no-underline">
              Appearance
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Font Size</label>
                    <span className="text-xs text-muted-foreground">14px</span>
                  </div>
                  <Slider defaultValue={[14]} max={24} min={10} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Theme</label>
                  </div>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Catpuccin
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          VS Code Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Laptop className="h-4 w-4 mr-2" />
                          Dracula
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem> */}

          <AccordionItem value="account">
            <AccordionTrigger className="no-underline hover:no-underline cursor-pointer">
              Account
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto text-destructive cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SettingsTabContent;
