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
export type KloterDashboard = {
  totalCatalogs: number;
  releasedCatalogs: number;
  cancelledCatalogs: number;
  onGoingCatalogs: number;
  finishedCatalogs: number;
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
export type updateSlotParams = { id: number; body: Partial<Slot> };

export type KYCList = {
  uuid: string;
  fullName: string;
  email: string;
  currentStage: string;
  statusLevelOne: string;
  statusLevelTwo: string;
  submittedAt: string;
};

export type KYCDetail = {
  idCardKey: string;
  idCardSelfieKey: string;
  idCardNumber: string;
  fullName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  placeOfBirth: string;
  idCardAddress: {
    line: string;
    rtNumber: string;
    rwNumber: string;
    city: string;
    district: string;
    subdistrict: string;
    state: string;
  };
  domicileAddress: {
    line: string;
    rtNumber: string;
    rwNumber: string;
    city: string;
    district: string;
    subdistrict: string;
    state: string;
  };
  domicileLetterKey: string;
  religion: string;
  maritalStatus: string;
  bank: {
    code: string;
    number: string;
    holderName: string;
    status: string;
    reason: string;
  };
  mobile: string;
  highestEducation: string;
  occupation: string;
  jobTitle: string;
  annualIncome: string;
  employerName: string;
  employerMobile: string;
  employerAddress: {
    line: string;
    rtNumber: string;
    rwNumber: string;
    city: string;
    district: string;
    subdistrict: string;
    state: string;
  };
  familyCardKey: string;
  guarantorRelationship: string;
  guarantorFullName: string;
  guarantorMobile: string;
  guarantorAddress: {
    line: string;
    rtNumber: string;
    rwNumber: string;
    city: string;
    district: string;
    subdistrict: string;
    state: string;
  };
  currentStage: string;
  statusLevelOne: string;
  reasonLevelOne: string;
  statusLevelTwo: string;
  reasonLevelTwo: string;
};

export type KYCMatch = {
  idCardKey: string;
  idCardSelfieKey: string;
  domicileLetterKey: string;
  statusLevelOne: string;
  idCardMatchPercentage: number;
  idCardSelfieMatchPercentage: number;
  idCardNumber: {
    data: string;
    isMatch: boolean;
  };
  fullName: {
    data: string;
    isMatch: boolean;
  };
  placeOfBirth: {
    data: string;
    isMatch: boolean;
  };
  dateOfBirth: {
    data: string;
    isMatch: boolean;
  };
  gender: {
    data: string;
    isMatch: boolean;
  };
  religion: {
    data: string;
    isMatch: boolean;
  };
  bloodGroup: {
    data: string;
    isMatch: boolean;
  };
  idCardAddress: {
    line: {
      data: string;
      isMatch: boolean;
    };
    rtNumber: {
      data: string;
      isMatch: boolean;
    };
    rwNumber: {
      data: string;
      isMatch: boolean;
    };
    city: {
      data: string;
      isMatch: boolean;
    };
    district: {
      data: string;
      isMatch: boolean;
    };
    subdistrict: {
      data: string;
      isMatch: boolean;
    };
    state: {
      data: string;
      isMatch: boolean;
    };
  };
  domicileAddress: {
    line: string;
    rtNumber: string;
    rwNumber: string;
    city: string;
    district: string;
    subdistrict: string;
    state: string;
  };
  maritalStatus: {
    data: string;
    isMatch: boolean;
  };
  occupation: {
    data: string;
    isMatch: boolean;
  };
};

// account.service.ts

export type AccountList = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  kycStatusLevelOne: string;
  kycStatusLevelTwo: string;
  createdAt: string;
};

export type AccountDetail = {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  totalCatalogs: number;
  totalOnGoingCatalogs: number;
};

export type AccountCatalog = {
  catalogId: number;
  groupId: string;
  status: string;
  payout: number;
  totalContribution: number;
  capacity: number;
  slots: [
    {
      id: number;
      number: number;
      payoutStatus: string;
      payoutAt: string;
      isPayoutReady: true;
    }
  ];
  startAt: string;
  endAt: string;
  createdAt: string;
};

export type AccountInstallment = {
  catalogId: number;
  dueAt: string;
  totalAmount: number;
  installmentIds: number[];
  slots: [
    {
      id: number;
      amount: number;
    }
  ];
  rotationStatus: string;
  installmentStatus: string;
  isYourPayout: boolean;
};

export type AccountInstallmentPayout = {
  transactionCode: string;
  createdAt: string;
  type: string;
  status: string;
  paymentAmount: number;
  recipientDetails: {
    code: string;
    number: string;
    holderName: string;
  };
};

export type AccountInstallmentPayment = {
  transactionCode: string;
  createdAt: string;
  type: string;
  status: string;
  paymentAmount: number;
};
