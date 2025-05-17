import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PopupNotification({ data, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleClick = () => {
        // Animate out before redirect
        setIsVisible(false);
        setTimeout(() => {
            window.location.href = data.redirect_url;
        }, 300);
    };

    const handleClose = () => {
        // Animate out before closing
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div style={styles.overlay}>
            <div style={{
                ...styles.banner,
                transform: isVisible ? 'scale(1)' : 'scale(0.7)',
                opacity: isVisible ? 1 : 0,
            }}>
                <div style={styles.imageContainer}>
                    <img 
                        src={data.image_url} 
                        alt="Notification"
                        onClick={handleClick} 
                        style={styles.img} 
                    />
                </div>
                <button 
                    onClick={handleClose} 
                    style={styles.close}
                    aria-label="Close notification"
                >
                    <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9998
    },
    banner: {
        width: '90%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0,0,0,0.1)',
        transform: 'scale(1)',
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
    },
    img: {
        width: '100%',
        display: 'block',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        ':hover': {
            transform: 'scale(1.02)'
        }
    },
    close: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: '30px',
        height: '30px',
        fontSize: '24px',
        border: 'none',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#004c94',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: '#ffffff',
            transform: 'scale(1.1)'
        }
    }
};

PopupNotification.propTypes = {
    data: PropTypes.shape({
        image_url: PropTypes.string.isRequired,
        redirect_url: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default PopupNotification;