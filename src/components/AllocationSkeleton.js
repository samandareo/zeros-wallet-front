import React from 'react';

const AllocationSkeleton = () => {
  return (
    <div className="main-content px-4 py-3">
      <div className='d-flex flex-column gap-3'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div className="skeleton-circle"></div>
          <div className="skeleton-text mt-3" style={{width: "200px"}}></div>
        </div>
        
        <div className='d-flex justify-content-between align-items-center px-5 mt-4'>
          <div className="skeleton-text" style={{width: "80px"}}></div>
          <div className="skeleton-text" style={{width: "80px"}}></div>
        </div>
        
        <div className='skeleton-divider'></div>
        
        <div className='d-flex flex-column gap-3'>
          {[1,2,3,4,5].map((item) => (
            <div key={item} className='skeleton-task-item d-flex justify-content-between align-items-center'>
              <div className='d-flex gap-2'>
                <div className="skeleton-circle-small"></div>
                <div className='d-flex flex-column gap-1'>
                  <div className="skeleton-text" style={{width: "100px"}}></div>
                  <div className="skeleton-text" style={{width: "150px"}}></div>
                </div>
              </div>
              <div className="skeleton-text" style={{width: "80px"}}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationSkeleton;