import { useEffect, useState, useRef } from 'react';

export default function CustomDropdown({ tokens, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedToken = tokens.find(t => t.symbol === selected);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', minWidth: '100px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '25px',
                    border: '1px solid #1877D1',
                    fontSize: '12px',
                    color: '#022F64',
                    fontWeight: 600,
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={selectedToken.icon} alt={selectedToken.symbol} width={20} />
                    {selectedToken.name}
                </div>
                <span>▼</span>
            </div>
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #1877D1',
                    borderRadius: '10px',
                    zIndex: 10
                }}>
                    {tokens.map((token, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                onChange(token.symbol);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#022F64'
                            }}
                        >
                            <img src={token.icon} alt={token.symbol} width={20} />
                            {token.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
