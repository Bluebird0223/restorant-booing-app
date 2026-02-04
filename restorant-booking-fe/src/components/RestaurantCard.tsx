import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
    return (
        <Link to={`/restaurants/${restaurant.id}`}>
            <div className="glass-card p-6 h-full flex flex-col group">
                <div className="w-full h-48 bg-gray-800 rounded-xl mb-4 overflow-hidden">
                    {restaurant.images?.[0] ? (
                        <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold text-4xl">
                            {restaurant.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{restaurant.name}</h2>
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-xs font-bold ring-1 ring-indigo-500/20">
                        {restaurant.type?.toUpperCase()}
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{restaurant.address}</p>
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-gray-800/50">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="text-white font-medium">{restaurant.rating || 'N/A'}</span>
                        <span className="text-gray-500">({restaurant.reviews || 0})</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
