export default function GuestSelector({ guests, setGuests }: { guests: number, setGuests: (guests: number) => void }) {
    return (
        <div className="relative">
            <input
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="input-field pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                People
            </span>
        </div>
    );
}
