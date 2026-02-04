export default function Button({ children, onClick, type = 'button' }: { children: React.ReactNode, onClick: () => void, type?: 'button' | 'submit' | 'reset' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
            {children}
        </button>
    );
}
