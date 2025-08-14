"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/ui/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MyRooms from "@/components/me/MyRooms";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "unauthenticated") {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [status, router]);

  if (loading || status === "loading") return <LoadingSpinner />;
  if (!session?.user) return null;

  return (
    <>
      <div>
        <Header />
        <div className="container mx-auto max-w-[1080px] px-8 py-12">
          <div className="flex flex-col gap-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold capitalize">{session.user.name}</h1>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            {/* Tabs for different sections */}
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="rooms">My Rooms</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              {/* Projects Tab */}
              <TabsContent value="rooms">
                <MyRooms />
              </TabsContent>
              <TabsContent value="privacy">
                <div>Coming soon..</div>
              </TabsContent>
              <TabsContent value="security">
                <div>Coming soon..</div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
