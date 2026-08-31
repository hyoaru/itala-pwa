import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  Children,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@heroui/styles";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  onSelect?: (index: number) => void;
}

export const Carousel = ({ children, ...props }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slideCount = Children.count(children);

  const onSelect = useCallback(
    (api: EmblaCarouselType) => {
      setSelectedIndex(api.selectedScrollSnap());
      props.onSelect?.(api.selectedScrollSnap());
    },
    [props],
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative h-full", props.className)}>
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {Children.map(children, (child) => (
            <div className="min-w-0 shrink-0 basis-full">{child}</div>
          ))}
        </div>
      </div>
      {slideCount > 1 && (
        <div className="bg-accent-soft absolute right-4 bottom-4 flex items-center gap-1.5 rounded-xl p-1.5">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              type="button"
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === selectedIndex
                  ? "bg-foreground/40"
                  : "bg-foreground/20",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
