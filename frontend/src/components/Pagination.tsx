
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
   
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key="first"
          className="pagination-item"
          onClick={() => handlePageChange(1)}
        >
          <ChevronsLeft size={16} />
        </button>
      );
    }
  
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          className="pagination-item"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
      );
    }
    
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-item ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    

    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          className="pagination-item"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <button
          key="last"
          className="pagination-item"
          onClick={() => handlePageChange(totalPages)}
        >
          <ChevronsRight size={16} />
        </button>
      );
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;
