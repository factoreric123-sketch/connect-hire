import { WorkerProfile, Job, Review, Conversation, Message } from '@/types';

export const COUNTRIES = [
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
];

export const SKILLS = [
  'Virtual Assistant', 'Data Entry', 'Customer Service', 'Social Media',
  'Content Writing', 'Graphic Design', 'Web Development', 'SEO',
  'Bookkeeping', 'Email Marketing', 'Video Editing', 'Transcription',
  'Research', 'Lead Generation', 'WordPress', 'Shopify',
  'Excel', 'PowerPoint', 'Administrative', 'Project Management',
];

export const mockWorkers: WorkerProfile[] = [
  {
    id: 'w1',
    userId: 'u1',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    country: 'Philippines',
    countryCode: 'PH',
    headline: 'Experienced Virtual Assistant & Customer Service Specialist',
    skills: ['Virtual Assistant', 'Customer Service', 'Data Entry', 'Email Marketing'],
    hourlyRateMin: 2,
    hourlyRateMax: 3,
    availabilityHours: 8,
    availabilityType: 'full-time',
    bio: 'Detail-oriented professional with 5+ years of experience in virtual assistance. Skilled in managing calendars, email correspondence, data entry, and customer support.',
    lastActive: new Date().toISOString(),
    isVerified: true,
    reviewCount: 12,
    averageRating: 4.8,
  },
  {
    id: 'w2',
    userId: 'u2',
    name: 'Raj Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    country: 'India',
    countryCode: 'IN',
    headline: 'Full Stack Web Developer & WordPress Expert',
    skills: ['Web Development', 'WordPress', 'Shopify', 'SEO'],
    hourlyRateMin: 3,
    hourlyRateMax: 5,
    availabilityHours: 6,
    availabilityType: 'part-time',
    bio: 'Passionate web developer with expertise in building responsive websites. Specialized in WordPress, Shopify, and custom web applications.',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    reviewCount: 8,
    averageRating: 4.9,
  },
  {
    id: 'w3',
    userId: 'u3',
    name: 'Grace Okafor',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    country: 'Nigeria',
    countryCode: 'NG',
    headline: 'Content Writer & Social Media Manager',
    skills: ['Content Writing', 'Social Media', 'SEO', 'Research'],
    hourlyRateMin: 1,
    hourlyRateMax: 2,
    availabilityHours: 8,
    availabilityType: 'full-time',
    bio: 'Creative content writer with a knack for engaging storytelling. Experienced in managing social media accounts and creating SEO-optimized content.',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isVerified: false,
    reviewCount: 5,
    averageRating: 4.6,
  },
  {
    id: 'w4',
    userId: 'u4',
    name: 'Linh Nguyen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    country: 'Vietnam',
    countryCode: 'VN',
    headline: 'Graphic Designer & Video Editor',
    skills: ['Graphic Design', 'Video Editing', 'Social Media', 'PowerPoint'],
    hourlyRateMin: 2,
    hourlyRateMax: 4,
    availabilityHours: 5,
    availabilityType: 'part-time',
    bio: 'Creative designer with an eye for aesthetics. Proficient in Adobe Creative Suite and video editing software. Love bringing ideas to life.',
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    reviewCount: 15,
    averageRating: 4.7,
  },
  {
    id: 'w5',
    userId: 'u5',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    country: 'Pakistan',
    countryCode: 'PK',
    headline: 'Data Entry Specialist & Bookkeeper',
    skills: ['Data Entry', 'Bookkeeping', 'Excel', 'Administrative'],
    hourlyRateMin: 1,
    hourlyRateMax: 2,
    availabilityHours: 8,
    availabilityType: 'full-time',
    bio: 'Meticulous data entry specialist with strong attention to detail. Experienced in bookkeeping and financial record management.',
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    reviewCount: 20,
    averageRating: 4.5,
  },
  {
    id: 'w6',
    userId: 'u6',
    name: 'Sofia Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    country: 'Colombia',
    countryCode: 'CO',
    headline: 'Lead Generation & Research Specialist',
    skills: ['Lead Generation', 'Research', 'Data Entry', 'Excel'],
    hourlyRateMin: 2,
    hourlyRateMax: 3,
    availabilityHours: 6,
    availabilityType: 'part-time',
    bio: 'Results-driven professional specializing in lead generation and market research. Skilled at finding qualified prospects and analyzing data.',
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isVerified: false,
    reviewCount: 7,
    averageRating: 4.4,
  },
];

export const mockJobs: Job[] = [
  {
    id: 'j1',
    employerId: 'e1',
    employerName: 'TechStart Inc.',
    title: 'Virtual Assistant for E-commerce Business',
    description: 'Looking for a reliable virtual assistant to help manage our e-commerce operations. Tasks include customer service, order processing, and inventory management. Must be detail-oriented and have excellent communication skills.',
    skills: ['Virtual Assistant', 'Customer Service', 'Data Entry'],
    hourlyRateMin: 2,
    hourlyRateMax: 3,
    availabilityHours: 8,
    countryPreference: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: 'j2',
    employerId: 'e2',
    employerName: 'Digital Marketing Co.',
    title: 'Social Media Manager',
    description: 'Seeking a creative social media manager to handle our clients\' accounts. You will create content, schedule posts, engage with followers, and provide analytics reports.',
    skills: ['Social Media', 'Content Writing', 'Graphic Design'],
    hourlyRateMin: 3,
    hourlyRateMax: 5,
    availabilityHours: 4,
    countryPreference: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: 'j3',
    employerId: 'e3',
    employerName: 'WebSolutions Ltd.',
    title: 'WordPress Developer Needed',
    description: 'We need an experienced WordPress developer to build and maintain websites for our clients. Must have experience with popular themes, plugins, and basic SEO.',
    skills: ['WordPress', 'Web Development', 'SEO'],
    hourlyRateMin: 4,
    hourlyRateMax: 6,
    availabilityHours: 6,
    countryPreference: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: 'j4',
    employerId: 'e1',
    employerName: 'TechStart Inc.',
    title: 'Data Entry Clerk',
    description: 'Looking for someone to help with large-scale data entry project. Must be fast, accurate, and able to work with spreadsheets. Project expected to last 2-3 months.',
    skills: ['Data Entry', 'Excel', 'Administrative'],
    hourlyRateMin: 1,
    hourlyRateMax: 2,
    availabilityHours: 8,
    countryPreference: 'Philippines',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    workerId: 'w1',
    employerId: 'e1',
    employerName: 'TechStart Inc.',
    rating: 5,
    comment: 'Maria is exceptional! Very professional, always on time, and goes above and beyond. Highly recommend.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r2',
    workerId: 'w1',
    employerId: 'e2',
    employerName: 'Digital Marketing Co.',
    rating: 5,
    comment: 'Excellent communication skills and attention to detail. Will definitely work with again.',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r3',
    workerId: 'w2',
    employerId: 'e3',
    employerName: 'WebSolutions Ltd.',
    rating: 5,
    comment: 'Raj delivered a beautiful website on time and within budget. Great problem solver.',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r4',
    workerId: 'w4',
    employerId: 'e1',
    employerName: 'TechStart Inc.',
    rating: 4,
    comment: 'Very creative designs. Sometimes needs clarification but overall great work.',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    workerId: 'w1',
    employerId: 'e1',
    workerName: 'Maria Santos',
    employerName: 'TechStart Inc.',
    lastMessage: 'Thank you for your interest! I would love to discuss the position.',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 'e1',
    content: 'Hi Maria, I saw your profile and I think you would be a great fit for our virtual assistant position.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'w1',
    content: 'Thank you for your interest! I would love to discuss the position.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
];

export const getCountryFlag = (countryCode: string): string => {
  return COUNTRIES.find(c => c.code === countryCode)?.flag || '🌍';
};

export const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return 'Online now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};
