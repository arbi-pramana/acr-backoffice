// GENERAL
export type ListResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
};
export type Kloter = {
  id: number;
  title: string;
  groupId: number;
  description: string;
  capacity: number;
  cycleDay: number;
  startAt: string;
  endAt: string;
  availableAt: string;
  payout: number;
  adminFee: number;
  status: string;
};

export type Params = {
  page: number;
  size: number;
  search: string;
};

// kloter.service.ts
export type updateKloterByIdParams = {
  body: Partial<Omit<Kloter, "id" | "description">>;
  id: number;
};
export type createKloterParams = Omit<Kloter, "id" | "description">;

// slot.service.ts
export type Slot = {
  id: number;
  catalogId: number;
  payoutAt: string;
  contribution: number;
  status: string;
  isPayoutAllowed: boolean;
};

export type createSlotParams = Omit<Slot, "id" | "isPayoutAllowed">;
