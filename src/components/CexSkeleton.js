import React from 'react';
import '../style/CexSkeleton.css'; // Assuming you have a CSS file for styles

const CexSkeleton = () => {
    return (
        <div className="skeleton-wrapper">
            {/* CEX Options Skeleton */}
            <div className="skeleton-title"></div>
            
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="skeleton-cex-item">
                    <div className="skeleton-left">
                        <div className="skeleton-circle"></div>
                        <div className="skeleton-text">
                            <div className="skeleton-line-full"></div>
                            <div className="skeleton-line-partial"></div>
                        </div>
                    </div>
                    <div className="skeleton-radio"></div>
                </div>
            ))}

            {/* Tasks Skeleton */}
            <div className="skeleton-task-title"></div>
            {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton-task-item">
                    <div className="skeleton-task-label"></div>
                    <div className="skeleton-input-group">
                        <div className="skeleton-input"></div>
                        <div className="skeleton-button"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CexSkeleton;