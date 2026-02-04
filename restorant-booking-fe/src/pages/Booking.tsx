import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import GuestSelector from '../components/GuestSelector';
import SlotPicker from '../components/SlotPicker';
import Button from '../components/Button';

export default function Booking() {
    const { id } = useParams();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [guests, setGuests] = useState(2);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [restaurant, setRestaurant] = useState<any>(null);

    useEffect(() => {
        api.get(`/restaurants/${id}`).then((res: any) => setRestaurant(res.data.data));
    }, [id]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reservations/availability/${id}`, {
                params: { date, guests }
            });
            setSlots(res.data.availableSlots || []);
            setSelectedSlot(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const book = async () => {
        try {
            await api.post('/reservations', {
                restaurantId: id,
                guestCount: guests,
                startTime: selectedSlot
            });
            alert('Reservation created successfully!');
            window.location.href = '/';
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to book');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="glass-card p-8 space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-white mb-2">Book Your Experience</h1>
                    <p className="text-gray-400">{restaurant?.name || 'Select your preferred date and guests'}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 px-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 px-1">Guests</label>
                        <GuestSelector guests={guests} setGuests={setGuests} />
                    </div>
                </div>

                <Button onClick={fetchAvailability}>
                    {loading ? 'Searching...' : 'Find Available Slots'}
                </Button>

                <div className="space-y-4">
                    {slots.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-white">Available Times</h2>
                            <SlotPicker slots={slots} onSelect={setSelectedSlot} />
                        </>
                    )}

                    {loading === false && slots.length === 0 && date && (
                        <p className="text-gray-500 text-center py-4 italic">No slots available for this configuration.</p>
                    )}
                </div>

                {selectedSlot && (
                    <div className="pt-6 border-t border-gray-800 animate-in fade-in duration-500">
                        <div className="bg-indigo-500/10 p-4 rounded-xl mb-6 border border-indigo-500/20">
                            <p className="text-indigo-400 text-center">
                                Selected: <span className="font-bold">{new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </p>
                        </div>
                        <Button onClick={book}>Confirm Reservation</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
