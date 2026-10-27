export interface StoreSpecialItem {
  id: string;
  storeId: string;
  title: string;
  badgeText: string; // e.g. 'Daily Fresh' | 'Weekend Special' | 'In-Store Deal'
  department: 'Butchery & Meat' | 'Bakery & Injera' | 'Spices & Grains' | 'Coffee & Tea' | 'Deli & Prepared';
  regularPrice?: string;
  specialPrice: string;
  description: string;
  validUntil: string;
  imageUrl: string;
  isLiveOnBoard: boolean;
  postedDate: string;
}

export const INITIAL_STORE_SPECIALS: StoreSpecialItem[] = [
  {
    id: 'sm-special-1',
    storeId: 'salam-lv',
    title: 'Fresh Warm Teff Injera (3-Pack Daily Batch)',
    badgeText: 'Daily Morning Batch',
    department: 'Bakery & Injera',
    regularPrice: '$5.50',
    specialPrice: '$4.25',
    description: '100% pure fermented brown and ivory teff. Baked fresh daily at 7 AM & 2 PM. Soft, spongy, and authentically sour.',
    validUntil: 'Daily Fresh Stock',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Today',
  },
  {
    id: 'sm-special-2',
    storeId: 'salam-lv',
    title: 'Prime Halal Goat & Lamb Meat (Custom Cuts for Tibs/Stew)',
    badgeText: 'Butcher Special',
    department: 'Butchery & Meat',
    regularPrice: '$12.99/lb',
    specialPrice: '$9.99/lb',
    description: 'Hand-slaughtered Zabiha Halal goat and young lamb. Freshly butchered every morning. Free custom trimming and dicing.',
    validUntil: 'This Sunday',
    imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Yesterday',
  },
  {
    id: 'sm-special-3',
    storeId: 'salam-lv',
    title: 'Authentic Imported Ethiopian Berbere (16 oz)',
    badgeText: 'Direct Import',
    department: 'Spices & Grains',
    regularPrice: '$11.00',
    specialPrice: '$8.50',
    description: 'Sun-dried red peppers blended with korarima, cloves, fenugreek, and sacred mountain herbs from Debre Markos.',
    validUntil: 'End of Month',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Oct 14',
  },
  {
    id: 'sm-special-4',
    storeId: 'salam-lv',
    title: 'Handmade Clay Jebena & Cini Cups Coffee Ceremony Set',
    badgeText: 'Store Spotlight',
    department: 'Coffee & Tea',
    regularPrice: '$58.00',
    specialPrice: '$45.00',
    description: 'Traditional terracotta clay coffee pot with woven straw base, frankincense burner, and 6 matching gilt espresso cups.',
    validUntil: 'Limited Stock',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Oct 12',
  },
  {
    id: 'hm-special-1',
    storeId: 'habesha-la',
    title: 'Friday Night Special: Doro Wat & Kitfo Combo Feast',
    badgeText: 'Weekend Special',
    department: 'Deli & Prepared',
    regularPrice: '$24.99',
    specialPrice: '$19.50',
    description: 'Slow-simmered chicken drumstick in rich berbere with hardboiled egg, ayib cheese, seasoned gomen greens, and 3 injeras.',
    validUntil: 'This Weekend Only',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Oct 16',
  },
  {
    id: 'sg-special-1',
    storeId: 'selam-sea',
    title: 'Organic Ethiopian Yirgacheffe Green Coffee Beans (5 lb Bag)',
    badgeText: 'Pantry Deal',
    department: 'Coffee & Tea',
    regularPrice: '$34.00',
    specialPrice: '$28.00',
    description: 'Single-origin washed arabica beans from Yirgacheffe region. Floral bergamot notes, ready for home pan roasting.',
    validUntil: 'While Supplies Last',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    isLiveOnBoard: true,
    postedDate: 'Oct 15',
  },
];
