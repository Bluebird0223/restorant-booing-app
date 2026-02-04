export default function SlotPicker({ slots, onSelect }: { slots: string[], onSelect: (slot: string) => void }) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (slot: string) => {
        setSelected(slot);
        onSelect(slot);
    };

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map(slot => (
                <button
                    key={slot}
                    onClick={() => handleSelect(slot)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${selected === slot
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                        }`}
                >
                    {new Date(slot).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </button>
            ))}
        </div>
    );
}

import { useState } from 'react';
