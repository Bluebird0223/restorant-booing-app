import { useEffect, useState } from 'react';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/restaurants/all')
            .then((res: any) => {
                setRestaurants(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading fine dining...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    Discover Culinary Excellence
                </h1>
                <p className="text-gray-400 mt-2">Book your table at the city's most exquisite venues.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.map((r: any) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                ))}
            </div>

            {restaurants.length === 0 && (
                <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <p className="text-gray-500">No restaurants found. Try seeding some data.</p>
                </div>
            )}
        </div>
    );
}
