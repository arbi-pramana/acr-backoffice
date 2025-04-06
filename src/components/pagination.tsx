import { Button } from "antd";

type PaginationProps = {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  onChange: (page: number) => void;
};

const Pagination = ({
  pageNumber,
  pageSize,
  totalPages,
  onChange,
}: PaginationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        Page {pageNumber + 1} of {pageSize}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onChange(pageNumber - 1)}
          disabled={pageNumber >= 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => onChange(pageNumber + 1)}
          disabled={pageNumber < totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
