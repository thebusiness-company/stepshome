import { z } from 'zod';

// ─── Contact Form ───────────────────────────────────────────────
export const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(254),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  helpType: z.enum([
    'Teaching / Tutoring',
    'Mentoring',
    'Event Organization',
    'Fundraising',
    'Other',
  ], { message: 'Invalid help type.' }),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
});

export const contactStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['PENDING', 'REVIEWED', 'CONTACTED', 'COMPLETED']),
});

// ─── Donation ───────────────────────────────────────────────────
export const donationSchema = z.object({
  amount: z.number().min(10, 'Minimum donation is ₹10').max(1_000_000, 'Maximum donation is ₹10,00,000'),
  frequency: z.enum(['monthly', 'one-time']),
  designation: z.string().trim().min(1).max(100),
  currency: z.string().default('INR'),
  donorName: z.string().trim().max(200).optional().or(z.literal('')),
  donorEmail: z.string().trim().toLowerCase().email('Invalid email address').max(254).optional().or(z.literal('')),
  donorPhone: z.string().trim().max(20).optional().or(z.literal('')),
});

// ─── Newsletter ─────────────────────────────────────────────────
export const newsletterSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string({ message: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
});




// ─── Gallery ────────────────────────────────────────────────────
export const galleryCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  alt: z.string().trim().max(300).optional().or(z.literal('')),
  url: z.string().trim().min(1, 'Image URL is required').max(2000).refine(
    (val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'URL must be a valid URL or a relative path starting with /' }
  ),
  category: z.enum(['MEMORIES', 'EVENTS', 'DAILY_LIFE']).default('MEMORIES'),
});

export const galleryUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  alt: z.string().trim().max(300).optional(),
  url: z.string().trim().min(1).max(2000).refine(
    (val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'URL must be a valid URL or a relative path starting with /' }
  ).optional(),
  category: z.enum(['MEMORIES', 'EVENTS', 'DAILY_LIFE']).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Admin Login ────────────────────────────────────────────────
export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required').max(128),
});

// ─── Girls ──────────────────────────────────────────────────────
export const girlCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  age: z.number().int().min(1, 'Age must be at least 1').max(120),
  description: z.string().trim().min(1, 'Description is required'),
  img: z.string().trim().min(1, 'Image is required').max(2000).refine(
    (val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'Image must be a valid URL or a relative path starting with /' }
  ),
});

export const girlUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  age: z.number().int().min(1).max(120).optional(),
  description: z.string().trim().min(1).optional(),
  img: z.string().trim().min(1).max(2000).refine(
    (val) => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'Image must be a valid URL or a relative path starting with /' }
  ).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Helper ─────────────────────────────────────────────────────
export function formatZodErrors(error: z.ZodError): string {
  return error.issues.map(i => i.message).join(', ');
}
