import { Suite } from '@/contexts/BookingContext';
import suite1Image from '@/assets/suite-1.jpg';
import suite2Image from '@/assets/suite-2.jpg';
import suite3Image from '@/assets/suite-3.jpg';
import suite4Image from '@/assets/suite-4.jpg';
import suite5Image from '@/assets/suite-5.jpg';
import suite6Image from '@/assets/suite-6.jpg';

export const suites: Suite[] = [
  {
    id: 'suite-1',
    name: 'Ocean Breeze Suite',
    sleeps: 4,
    pricePerNight: 425,
    description: 'Wake up to breathtaking ocean views in this spacious suite featuring a king bed, elegant sitting area, and floor-to-ceiling windows that flood the space with natural light. The perfect retreat for those seeking luxury and tranquility.',
    amenities: [
      'King size bed with premium linens',
      'Private ocean-view balcony',
      'Marble bathroom with soaking tub',
      'Mini-bar and coffee station',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
      'Flat-screen TV with streaming',
      'Air conditioning'
    ],
    image: suite1Image,
    gallery: [suite1Image, suite2Image, suite3Image]
  },
  {
    id: 'suite-2',
    name: 'Garden Terrace Suite',
    sleeps: 2,
    pricePerNight: 350,
    description: 'A contemporary haven with a private terrace overlooking lush gardens. This suite combines modern comfort with natural beauty, featuring an open-plan design and spa-like amenities for the ultimate relaxation experience.',
    amenities: [
      'Queen size bed with luxury bedding',
      'Private garden terrace',
      'Walk-in shower with rainfall head',
      'Kitchenette with essentials',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
      'Smart TV with streaming',
      'Climate control'
    ],
    image: suite2Image,
    gallery: [suite2Image, suite1Image, suite4Image]
  },
  {
    id: 'suite-3',
    name: 'Mountain View Suite',
    sleeps: 4,
    pricePerNight: 475,
    description: 'Immerse yourself in panoramic mountain vistas from this premium suite. Featuring spacious accommodations with a separate sitting area, this retreat offers the perfect blend of luxury and natural beauty.',
    amenities: [
      'King size bed with mountain views',
      'Separate living area with sofa bed',
      'Jetted tub with mountain views',
      'Full mini-bar service',
      'Complimentary Wi-Fi',
      'Twice-daily housekeeping',
      'Premium entertainment system',
      'Heated floors'
    ],
    image: suite3Image,
    gallery: [suite3Image, suite5Image, suite6Image]
  },
  {
    id: 'suite-4',
    name: 'Serenity Suite',
    sleeps: 2,
    pricePerNight: 325,
    description: 'Find your peace in this elegantly designed suite with garden views. Thoughtfully appointed with modern amenities and calming decor, it\'s the ideal space for couples seeking a romantic getaway.',
    amenities: [
      'Queen size bed with garden views',
      'Spa-inspired bathroom',
      'Private reading nook',
      'Coffee and tea station',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
      'Streaming entertainment',
      'Individual climate control'
    ],
    image: suite4Image,
    gallery: [suite4Image, suite2Image, suite1Image]
  },
  {
    id: 'suite-5',
    name: 'Poolside Paradise Suite',
    sleeps: 6,
    pricePerNight: 525,
    description: 'The largest of our accommodations, this family-friendly suite overlooks the resort pool and features multiple sleeping areas. Perfect for groups or families wanting to stay together while enjoying luxury amenities.',
    amenities: [
      'King bed plus queen sofa bed',
      'Pool and resort views',
      'Two full bathrooms',
      'Kitchenette with dining area',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
      'Multiple entertainment areas',
      'Private pool access'
    ],
    image: suite5Image,
    gallery: [suite5Image, suite3Image, suite4Image]
  },
  {
    id: 'suite-6',
    name: 'Sunset Vista Suite',
    sleeps: 4,
    pricePerNight: 450,
    description: 'Experience magical sunsets from this westward-facing suite. With its elegant furnishings, warm atmosphere, and stunning views, this suite offers an unforgettable retreat for discerning guests.',
    amenities: [
      'King size bed with sunset views',
      'Private sunset-viewing balcony',
      'Luxurious bathroom with dual vanities',
      'Premium mini-bar',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
      'High-end entertainment system',
      'Personalized climate control'
    ],
    image: suite6Image,
    gallery: [suite6Image, suite1Image, suite5Image]
  }
];