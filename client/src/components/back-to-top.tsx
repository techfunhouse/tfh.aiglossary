import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-12 h-12 rounded-full shadow-lg",
            "bg-primary-500 hover:bg-primary-600 text-white",
            "transition-all duration-300 ease-in-out",
            "animate-in slide-in-from-bottom-2",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
    </>
  );
} 