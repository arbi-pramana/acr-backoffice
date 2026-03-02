import { useMemo } from "react";
import { Slot } from "../types";

export function useRandomCatalogLogic(slots: Slot[] | undefined) {
  const numberedSlots = useMemo(() => {
    if (!slots) return [];
    const slotsWithNumber = slots.map((slot, index) => ({
      ...slot,
      no: index + 1,
    }));

    return slotsWithNumber.sort((a, b) => a.no - b.no);
  }, [slots]);

  const registeredSlots = useMemo(() => {
    if (!numberedSlots) return [];
    return numberedSlots.filter((slot) => slot.userId !== null);
  }, [numberedSlots]);

  const winnerSlots = useMemo(() => {
    if (!numberedSlots) return [];
    return numberedSlots.filter(
      (slot) => slot.isPayoutAllowed || slot.winningAt !== null,
    );
  }, [numberedSlots]);

  const nonWinnerSlots = useMemo(() => {
    if (!numberedSlots) return [];
    return numberedSlots.filter(
      (slot) => !slot.isPayoutAllowed && slot.winningAt === null,
    );
  }, [numberedSlots]);

  return {
    numberedSlots,
    registeredSlots,
    winnerSlots,
    nonWinnerSlots,
  };
}
