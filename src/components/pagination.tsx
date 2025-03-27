import { Button } from "antd";

const Pagination = () => {
  return (
    <div className="flex justify-between items-center">
      <div>Page 1 of 10</div>
      <div className="flex gap-2">
        <Button>Previous</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
};

export default Pagination;
