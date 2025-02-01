import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faCube } from "@fortawesome/free-solid-svg-icons";

export default function TopPageFullWidth() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <video 
          className="w-full h-full object-cover"
          src="//mofucraft.net/image/480p.mp4" 
          poster="//mofucraft.net/image/2018-12-28_00.28.27.jpg" 
          playsInline
          autoPlay 
          loop 
          muted
        />
        
        {/* Overlay with dots */}
        <div className="absolute inset-0 bg-black/40">
          <div className="absolute inset-0 bg-[url('/dot.svg')] w-full h-full" />
        </div>
        
        {/* Content */}
        <FontAwesomeIcon 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-24 h-24 opacity-70" 
          icon={faCube} 
        />
        
        {/* Welcome Text */}
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-raleway border-t-2 border-white px-4 py-2">
          Welcome.
        </p>

        {/* Scroll Down Arrow */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={handleScroll}
        >
          <FontAwesomeIcon 
            className="text-white w-16 h-16 opacity-70 animate-bounce hover:opacity-40 transition-opacity duration-300" 
            icon={faAnglesDown} 
          />
        </div>
      </div>

      {/* Feature Section */}
      <div className="text-center my-8 py-4">
        <div className="flex overflow-x-auto whitespace-nowrap px-4 py-2 gap-4">
          {/* Feature cards would go here */}
        </div>
      </div>
    </div>
  );
}