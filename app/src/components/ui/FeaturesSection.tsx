"use client";
import { SparklesText } from "@/components/ui/sparkles-test";
import { MovingBorderButton } from "@/components/ui/MovingBorderButton";
import { Users, Blocks, Code, Video, MessageSquare, Share2, Zap, Globe, Shield, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Edit code with your team, live, with zero lag. See changes as they happen.",
      gradient: "from-blue-500 to-cyan-500",
      glow: "group-hover:shadow-blue-500/25",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Audio & Video Calls",
      description: "Communicate seamlessly with built-in audio and video conferencing.",
      gradient: "from-purple-500 to-pink-500",
      glow: "group-hover:shadow-purple-500/25",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Live Chat",
      description: "Instant messaging with code snippets, file sharing, and emoji reactions.",
      gradient: "from-green-500 to-emerald-500",
      glow: "group-hover:shadow-green-500/25",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Sharable Rooms",
      description: "Invite teammates easily by sharing a unique link to your collaborative coding room.",
      gradient: "from-orange-500 to-red-500",
      glow: "group-hover:shadow-orange-500/25",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Built for Remote Teams",
      description: "Designed for modern developers working remotely — all tools in one collaborative workspace.",
      gradient: "from-indigo-500 to-purple-500",
      glow: "group-hover:shadow-indigo-500/25",
    },
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "Beautiful UI Blocks",
      description: "Remix and use 100+ open-source UI blocks with modern design patterns.",
      gradient: "from-pink-500 to-rose-500",
      glow: "group-hover:shadow-pink-500/25",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized for speed with instant file sync and real-time updates.",
      gradient: "from-yellow-500 to-orange-500",
      glow: "group-hover:shadow-yellow-500/25",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and secure authentication.",
      gradient: "from-teal-500 to-cyan-500",
      glow: "group-hover:shadow-teal-500/25",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Your workspace is always available, with automatic backups and version control.",
      gradient: "from-slate-500 to-gray-500",
      glow: "group-hover:shadow-slate-500/25",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <SparklesText text="Features" />
          <h2 className="text-5xl font-bold mt-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Why Choose Code Collab?
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the future of collaborative development with cutting-edge features designed for modern teams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)`,
              }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${feature.glow}`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <MovingBorderButton className="text-lg px-8 py-4">
            <Code className="w-5 h-5 mr-2" />
            Get Started Free
          </MovingBorderButton>
        </div>
      </div>
    </section>
  );
}