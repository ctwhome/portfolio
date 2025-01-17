export interface GalleryItem {
  url: string;
  description: string;
}

export interface CarouselProps {
  items?: GalleryItem[];
  currentSlide: number;  // Remove optional flag since we need this to be defined
}
