import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reservations');
            setReservations(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const action = async (id: any, type: any) => {
        try {
            await api.post(`/reservations/restaurant/${id}/${type}`);
            load();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center text-indigo-500">Retrieving reservations...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Restaurant Dashboard</h1>
                    <p className="text-gray-400">Manage your bookings efficiently.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={load} className="text-gray-400 hover:text-white transition-colors">
                        Refresh
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {reservations.map((r: any) => (
                    <div key={r.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${r.status === 'pending' ? 'bg-yellow-500' :
                                    r.status === 'accepted' || r.status === 'confirmed' ? 'bg-green-500' :
                                        r.status === 'rejected' || r.status === 'cancelled' ? 'bg-red-500' :
                                            'bg-gray-500'
                                    } shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></span>
                                <h3 className="text-lg font-semibold text-white">
                                    {r.User?.name || 'Guest'}
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                {new Date(r.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            <p className="text-gray-500 text-xs">Table: {r.Table?.name} ({r.guestCount} guests)</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                (r.status === 'accepted' || r.status === 'confirmed') ? 'bg-green-500/10 text-green-500' :
                                    'bg-gray-500/10 text-gray-400'
                                }`}>
                                {r.status}
                            </span>

                            <div className="flex gap-2 ml-4">
                                {r.status === 'pending' && (
                                    <>
                                        <button onClick={() => action(r.id, 'accept')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Accept</button>
                                        <button onClick={() => action(r.id, 'reject')} className="bg-red-600/20 hover:bg-red-600/40 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Reject</button>
                                    </>
                                )}

                                {(r.status === 'accepted' || r.status === 'confirmed') && (
                                    <>
                                        <button onClick={() => action(r.id, 'confirm')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Complete</button>
                                        <button onClick={() => action(r.id, 'no-show')} className="bg-orange-600/20 hover:bg-orange-600/40 text-orange-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors">No Show</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {reservations.length === 0 && (
                    <div className="text-center py-20 glass-card">
                        <p className="text-gray-500 text-lg">No active reservations found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
