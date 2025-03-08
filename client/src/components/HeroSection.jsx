// components/hero/HeroSection.jsx
import { useState, useEffect } from "react";
import Button from "../components/common/Button";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const seasonalOffer = "Holiday Sale: Get 30% OFF on Electronics!";

  const carouselSlides = [
    {
      image: "https://www.pcworld.com/wp-content/uploads/2023/08/back-to-school-laptop-accessories-header.jpg?quality=50&strip=all",
      title: "New Season Collection",
      cta: "Shop Now"
    },
    {
      image: "https://th.bing.com/th/id/OIP.ijfRHGh2Vqzh8nJSPhRd4AHaEK?rs=1&pid=ImgDetMain",
      title: "Limited Edition Styles",
      cta: "Discover"
    },
    {
      image: "https://www.bing.com/images/search?view=detailV2&id=4969527F2131C1E9A51EF6DF647BE5C29C00655B&thid=OIP.a2-Lm9_JVUZnTlLm_5pKlwHaE8&mediaurl=https%3a%2f%2fs3.amazonaws.com%2fcdn.designcrowd.com%2fblog%2f40-Famous-Shoe-Logos%2fHeader-40-Famous-Shoe-Logos.png&exph=720&expw=1080&q=footwear+brands&simid=608034754448547117&ck=3FC616F52D816E97F3C9DA0A5E0875ED&itb=0&FORM=IVCLIG",
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
    <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white h-[30vh] min-h-[200px]">
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
              className="w-screen h-[30vh] min-h-[200px] relative"
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;