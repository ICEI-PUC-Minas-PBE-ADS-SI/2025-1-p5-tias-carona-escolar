export interface RideListType {
  id: number;
  imagePath: string;
  driverName: string;
  driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
  carModel: string;
  seatsAvailable: number;
  dist: number;
  reviews: number;
  rating: number;
  pricePerSeat: number;
  departureLocation: string;
  // Novos campos para o layout atualizado
  departureTime: string;
  duration: string;
  availableSeats: number;
  isFavorite?: boolean;
  destination?: string;
}

export const RIDE_LIST: RideListType[] = [
  // 1st item dummy for 'stickyHeaderIndices'
  {
    id: 0,
    imagePath: '',
    driverName: '',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: '',
    seatsAvailable: 0,
    dist: 0,
    reviews: 0,
    rating: 0,
    pricePerSeat: 0,
    departureLocation: '',
    departureTime: '',
    duration: '',
    availableSeats: 0,
    destination: '',
    isFavorite: false
  },
  {
    id: 1,
    imagePath: "https://www.otempobetim.com.br/adobe/dynamicmedia/deliver/dm-aid--51d1e28d-0fc2-4e01-b947-08f81b6f3461/betim-live-puc-minas-em-betim-1739316414.png?quality=90&preferwebp=true&width=1200",
    driverName: 'Carlos Silva',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: 'Ford Focus',
    seatsAvailable: 3,
    dist: 2.0,
    reviews: 80,
    rating: 4.4,
    pricePerSeat: 20,
    departureLocation: 'Puc Minas, Betim',
    departureTime: '08:00',
    duration: '25 min',
    availableSeats: 3,
    destination: 'Centro, Contagem',
    isFavorite: false
  },
  {
    id: 2,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    driverName: 'Maria Oliveira',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: 'Honda Civic',
    seatsAvailable: 2,
    dist: 4.0,
    reviews: 74,
    rating: 4.5,
    pricePerSeat: 25,
    departureLocation: 'Centro, Betim',
    departureTime: '07:30',
    duration: '35 min',
    availableSeats: 2,
    destination: 'UFMG, Belo Horizonte',
    isFavorite: true
  },
  {
    id: 3,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    driverName: 'João Pereira',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: 'Chevrolet Cruze',
    seatsAvailable: 4,
    dist: 3.0,
    reviews: 62,
    rating: 4.0,
    pricePerSeat: 18,
    departureLocation: 'Shopping, Betim',
    departureTime: '12:15',
    duration: '20 min',
    availableSeats: 4,
    destination: 'Puc Minas, Betim',
    isFavorite: false
  },
  {
    id: 4,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    driverName: 'Paula Costa',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: 'Toyota Corolla',
    seatsAvailable: 1,
    dist: 7.0,
    reviews: 90,
    rating: 4.4,
    pricePerSeat: 30,
    departureLocation: 'Aeroporto, Belo Horizonte',
    departureTime: '17:45',
    duration: '45 min',
    availableSeats: 1,
    destination: 'Puc Minas, Betim',
    isFavorite: true
  },
  {
    id: 5,
    imagePath: "https://revista.pucminas.br/revista/wp-content/uploads/IMG_1629-2-600x400.jpg",
    driverName: 'Ricardo Almeida',
    driverImage: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    carModel: 'Volkswagen Golf',
    seatsAvailable: 2,
    dist: 2.0,
    reviews: 240,
    rating: 4.5,
    pricePerSeat: 22,
    departureLocation: 'Rodoviária, Belo Horizonte',
    departureTime: '16:30',
    duration: '30 min',
    availableSeats: 2,
    destination: 'Centro, Contagem',
    isFavorite: false
  },
];