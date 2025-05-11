import { Children, isValidElement } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const SimpleCarousel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Carousel>
      <CarouselContent>
        {Children.map(children, (child, idx) =>
          isValidElement(child) ? (
            <CarouselItem className="basis-1/3" key={idx}>
              {child}
            </CarouselItem>
          ) : (
            <CarouselItem>Invalid</CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default SimpleCarousel;
