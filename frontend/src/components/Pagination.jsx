import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= halfMaxPages + 1) {
                for (let i = 1; i <= maxPagesToShow - 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - halfMaxPages) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-container">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
                &larr; Previous
            </button>
            <div className="pagination-numbers">
                {pageNumbers.map((number, index) =>
                    number === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                        <button key={number} onClick={() => onPageChange(number)} className={`pagination-number-btn ${currentPage === number ? 'active' : ''}`}>
                            {number}
                        </button>
                    )
                )}
            </div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
                Next &rarr;
            </button>
        </div>
    );
};

export default Pagination;