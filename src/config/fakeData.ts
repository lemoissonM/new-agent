export const fakeNames = [
  'Amani', 'Bahati', 'Chiku', 'Dalila', 'Eshe', 'Faraji', 'Grace', 'Habiba',
  'Imani', 'Jabari', 'Kamau', 'Lumusi', 'Makena', 'Naima', 'Olu', 'Pendo',
  'Rafiki', 'Sanaa', 'Themba', 'Uzuri', 'Waseme', 'Yara', 'Zuri',
  'Koffi', 'Malaika', 'Neema', 'Asha', 'Baraka', 'Chantel', 'Dieudonne'
];

export const fakePlaces = [
  'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Matadi',
  'Kananga', 'Likasi', 'Kolwezi', 'Mbuji-Mayi', 'Kalemie', 'Mbandaka',
  'Bunia', 'Uvira', 'Beni', 'Tshikapa', 'Bandundu', 'Gemena',
  'Kindu', 'Isiro', 'Gbadolite'
];

export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}