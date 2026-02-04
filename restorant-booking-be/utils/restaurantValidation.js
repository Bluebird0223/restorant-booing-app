const z = require('zod');

const restaurantSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    type: z.enum(['restaurant', 'cafe', 'bar', 'lounge', 'pub', 'hotel', 'club']),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(1, 'Phone is required'),
    rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').optional(),
    reviews: z.number().min(0, 'Reviews must be at least 0').optional(),
    images: z.array(z.string()).optional(),
    openingTime: z.string().min(1, 'Opening time is required').optional(),
    closingTime: z.string().min(1, 'Closing time is required').optional(),
});

module.exports = restaurantSchema;
