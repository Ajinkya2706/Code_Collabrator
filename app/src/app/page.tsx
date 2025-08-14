// import { Header } from "@/components/ui/Header";

// // import { Header } from "@/components/Header";
// import { Dot } from "lucide-react";

// export default function Home() {
//   return (
//     <div className="h-screen">
//       <Header />
//       <div className="flex items-center justify-center text-center h-[80vh]">
//         <div>
//           <h1 className="text-9xl font-bold">Code Collab</h1>
//           {/* <div className="flex items-center justify-center">
//           <p>Code Together</p>
//           <Dot />
//           <p>Work Together</p>
//         </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }


// import { HeroSection } from "@/components/ui/hero-section-1"
// import { FloatingDock } from "@/components/ui/floating-dock"
// import { User, Settings } from "lucide-react"
// // import { SparklesText } from "@/components/ui/sparkles-test"

// // export function SparklesTextDemo() {
// //   return <SparklesText text="Magic UI" />;
// // }


// const dockItems = [
//     { title: "Home", icon: <Home />, href: "/" },
//     { title: "Profile", icon: <User />, href: "/me" },
//     { title: "Settings", icon: <Settings />, href: "/settings" },
//   ];
  

// export default function Home() {
//     return (
//         <div>
//             <HeroSection />
//             {/* <FloatingDock items={dockItems}/> */}
//         </div>
//     );
// }

import { HeroSection } from "@/components/ui/hero-section-1";
import { FeaturesSection } from "@/components/ui/FeaturesSection";
import { AboutSection } from "@/components/ui/AboutSection";
import { ContactSection } from "@/components/ui/ContactSection";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}