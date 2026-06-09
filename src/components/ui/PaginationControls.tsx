
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onNext: () => void;
  onPrev: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onNext,
  onPrev
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="pagination">
      <div className="page-info">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} formasi
      </div>
      <div className="page-controls">
        <button className="page-btn" onClick={onPrev} disabled={currentPage === 1}>
          Sebelumnya
        </button>
        <button className="page-btn" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
