
export interface HotelListType {
  id: number;
  imagePath: string;
  titleTxt: string;
  subTxt: string;
  dist: number;
  reviews: number;
  rating: number;
  perNight: number;
}

export const HOTEL_LIST: HotelListType[] = [
  // 1st item dummy for 'stickyHeaderIndices'
  {
    id: 0,
    imagePath: '',
    titleTxt: '',
    subTxt: '',
    dist: 0,
    reviews: 0,
    rating: 0,
    perNight: 0,
  },
  {
    id: 1,
    imagePath: "https://www.otempobetim.com.br/adobe/dynamicmedia/deliver/dm-aid--51d1e28d-0fc2-4e01-b947-08f81b6f3461/betim-live-puc-minas-em-betim-1739316414.png?quality=90&preferwebp=true&width=1200",
    titleTxt: 'Grand Royal Hotel',
    subTxt: 'Wembley, London',
    dist: 2.0,
    reviews: 80,
    rating: 4.4,
    perNight: 180,
  },
  {
    id: 2,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    titleTxt: 'Queen Hotel',
    subTxt: 'Wembley, London',
    dist: 4.0,
    reviews: 74,
    rating: 4.5,
    perNight: 200,
  },
  {
    id: 3,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    titleTxt: 'Grand Royal Hotel',
    subTxt: 'Wembley, London',
    dist: 3.0,
    reviews: 62,
    rating: 4.0,
    perNight: 60,
  },
  {
    id: 4,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    titleTxt: 'Queen Hotel',
    subTxt: 'Wembley, London',
    dist: 7.0,
    reviews: 90,
    rating: 4.4,
    perNight: 170,
  },
  {
    id: 5,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    titleTxt: 'Grand Royal Hotel',
    subTxt: 'Wembley, London',
    dist: 2.0,
    reviews: 240,
    rating: 4.5,
    perNight: 200,
  },
];
