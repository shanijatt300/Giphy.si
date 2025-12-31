import { Category, Gif, User } from './types';

export const MOCK_USER = {
  id: 'u1',
  username: 'CreativeUser',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
  isAdmin: true
};

export const MOCK_USERS_LIST: User[] = [
  MOCK_USER,
  {
    id: 'u2',
    username: 'GiphyOfficial',
    avatarUrl: 'https://picsum.photos/seed/giphy/100/100',
    isAdmin: true,
    bio: 'Official account.'
  },
  {
    id: 'u3',
    username: 'FunnyGuy99',
    avatarUrl: 'https://picsum.photos/seed/funny/100/100',
    isAdmin: false,
    bio: 'I love memes.'
  },
  {
    id: 'u4',
    username: 'ArtistJane',
    avatarUrl: 'https://picsum.photos/seed/jane/100/100',
    isAdmin: false,
    bio: 'Digital artist & animator.'
  }
];

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Reactions', slug: 'reactions', coverUrl: 'https://picsum.photos/seed/react/300/200' },
  { id: 'c2', name: 'Entertainment', slug: 'entertainment', coverUrl: 'https://picsum.photos/seed/ent/300/200' },
  { id: 'c3', name: 'Sports', slug: 'sports', coverUrl: 'https://picsum.photos/seed/sport/300/200' },
  { id: 'c4', name: 'Stickers', slug: 'stickers', coverUrl: 'https://picsum.photos/seed/stick/300/200' },
  { id: 'c5', name: 'Artists', slug: 'artists', coverUrl: 'https://picsum.photos/seed/art/300/200' },
];

// Helper to generate random GIFs
export const generateMockGifs = (count: number, startIndex: number = 0): Gif[] => {
  return Array.from({ length: count }).map((_, i) => {
    const index = startIndex + i;
    const width = Math.random() > 0.5 ? 400 : 300;
    const height = Math.random() > 0.5 ? 300 : 400; // Vary aspect ratio
    const id = `gif-${index}`;
    // Assign a random category for demo purposes
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].name;

    return {
      id,
      title: `Awesome GIF #${index + 1}`,
      url: `https://picsum.photos/seed/${id}/${width}/${height}.webp`,
      fullUrl: `https://picsum.photos/seed/${id}/${width * 2}/${height * 2}.webp`,
      width,
      height,
      username: index % 3 === 0 ? 'GiphyOfficial' : `User_${index}`,
      userAvatar: `https://picsum.photos/seed/avatar${index}/50/50`,
      tags: ['funny', 'cool', 'trending', 'reaction'],
      views: Math.floor(Math.random() * 100000),
      likes: Math.floor(Math.random() * 5000),
      isVerified: index % 3 === 0,
      uploadedAt: new Date().toISOString(),
      status: 'approved',
      category: randomCategory
    };
  });
};

export const TRENDING_GIFS = generateMockGifs(20);