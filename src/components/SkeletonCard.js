import React from 'react';
import '../style/Skeleton.css';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
    <div className="skeleton skeleton-button"></div>
  </div>
);

export default SkeletonCard;
