// components/hero/HeroSection.jsx
import { useState, useEffect } from "react";
import Button from "../components/common/Button";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const seasonalOffer = "Holiday Sale: Get 30% OFF on Electronics!";

  const carouselSlides = [
    {
      image: "https://www.getonecard.app/images/blog/Shopping_Electronics.png",
      title: "New Season Collection",
      cta: "Shop Now"
    },
    {
      image: "https://moneylion.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2024/08/16070643/Clothes-Sales.webp",
      title: "Limited Edition Styles",
      cta: "Discover"
    },
    {
      image: "https://static.vecteezy.com/system/resources/previews/020/903/143/non_2x/shoe-sale-banner-vector.jpg",
      title: "Premium Tech Gadgets",
      cta: "Explore"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white h-[40vh] min-h-[200px]">
      {/* Sticky Seasonal Offer */}
      <div className="sticky top-0 bg-amber-300 text-black py-1 px-3 text-sm animate-pulse">
        <p className="text-center font-medium truncate">{seasonalOffer}</p>
      </div>

      {/* Compact Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `translateX(-${activeIndex * 100}vw)`,
            width: `${carouselSlides.length * 100}vw`
          }}
        >
          {carouselSlides.map((slide, index) => (
            <div 
              key={index}
              className="w-screen h-[40vh] min-h-[200px] relative"
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover brightness-75 aspect-[16/9]"
              />
              {/* <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="space-y-2 px-2">
                  <h2 className="text-xl md:text-3xl font-bold drop-shadow">
                    {slide.title}
                  </h2>
                  <Button
                    size="sm"
                    variant="outline-white"
                    className="mt-2 text-xs md:text-sm"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;