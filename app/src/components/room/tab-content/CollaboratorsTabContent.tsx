"use client";
import React from "react";
import { useSocket } from "@/providers/SocketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconUser } from "@tabler/icons-react";
import { getUser } from "@/services/auth-services";
import { useSession } from "next-auth/react";

interface IUser {
  _id: string;
  name: string;
  profile: string; // URL to the user's profile picture
}

const CollaboratorsTabContent = () => {
  const { collaborators } = useSocket();
  const user = getUser();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || user?.id;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium">
          Collaborators ({collaborators?.length || 0})
        </h2>
      </div>

      <ScrollArea className="flex-1">
        {collaborators && collaborators.length > 0 ? (
          <div className="p-4 space-y-3">
            {collaborators.filter(user => user && user._id).map((user) => (
              <div
                key={user?._id}
                className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                  user?._id === currentUserId
                    ? "bg-muted/50 border border-border/50"
                    : "hover:bg-muted/30"
                }`}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user?.name} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <IconUser size={14} />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex items-center justify-between">
                  <p className="text-sm capitalize">
                    {user?.name || 'Unknown User'}
                    {user?._id === currentUserId && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-8">
            No one is currently in this room
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CollaboratorsTabContent;
