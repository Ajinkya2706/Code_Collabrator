"use client";

export function AboutSection() {
  return (
    <section className="py-24 bg-background" id="about">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Code Collab is on a mission to make real-time collaboration effortless and beautiful for developers and teams. We believe in open source, great design, and empowering people to build together from anywhere in the world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-card p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-indigo-500 text-4xl mb-2">🚀</span>
            <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
            <p className="text-muted-foreground">Empower teams to create, share, and innovate together in real time.</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-indigo-500 text-4xl mb-2">🌍</span>
            <h3 className="font-semibold text-xl mb-2">Global Team</h3>
            <p className="text-muted-foreground">Built by passionate developers and designers from around the world.</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow flex flex-col items-center">
            <span className="text-indigo-500 text-4xl mb-2">💡</span>
            <h3 className="font-semibold text-xl mb-2">Open Source</h3>
            <p className="text-muted-foreground">We believe in transparency, community, and sharing our work with everyone.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 