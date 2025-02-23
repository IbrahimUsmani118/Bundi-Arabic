const HeroSection = () => {
  return (
    <div 
      className="relative bg-cover bg-center h-[60vh] flex items-center justify-center"
      style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21)',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="text-center text-white z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Miami</h1>
        <p className="text-xl md:text-2xl">Discover the magic of the Magic City</p>
      </div>
    </div>
  );
};

export default HeroSection;