import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Restaurant() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/restaurants/${id}`)
            .then((res: any) => {
                setRestaurant(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-500">Loading experience...</div>;
    if (!restaurant) return <div className="min-h-screen flex items-center justify-center text-gray-500">Restaurant not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
                {restaurant.images?.[0] ? (
                    <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center">
                        <h1 className="text-9xl font-bold text-white/10">{restaurant.name.charAt(0)}</h1>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                    <span className="bg-indigo-600 self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        {restaurant.type}
                    </span>
                    <h1 className="text-5xl font-black text-white mb-2">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 text-gray-300">
                        <span>⭐ {restaurant.rating}</span>
                        <span>•</span>
                        <span>{restaurant.address}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Experience world-class dining at {restaurant.name}. Located at {restaurant.address},
                            we offer a unique {restaurant.type} atmosphere perfect for any occasion.
                        </p>
                    </section>

                    <section className="grid grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <p className="text-gray-500 text-sm uppercase font-bold mb-1">Opening Hours</p>
                            <p className="text-xl font-semibold text-white">{restaurant.openingTime} - {restaurant.closingTime}</p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-gray-500 text-sm uppercase font-bold mb-1">Contact</p>
                            <p className="text-xl font-semibold text-white">{restaurant.phone}</p>
                        </div>
                    </section>
                </div>

                <div className="md:col-span-1">
                    <div className="glass-card p-8 sticky top-8">
                        <h3 className="text-xl font-bold mb-2">Reserve a Table</h3>
                        <p className="text-gray-400 text-sm mb-6">Secure your spot online and receive instant confirmation.</p>

                        <Link to={`/booking/${id}`} className="block">
                            <button className="btn-primary w-full text-lg">
                                Check Availability
                            </button>
                        </Link>

                        <p className="text-center text-xs text-gray-600 mt-4">No payment required to book.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
