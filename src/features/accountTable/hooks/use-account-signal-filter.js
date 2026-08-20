import { useMemo, useState } from "react";

export function useAccountSignalFilter(accounts) {
  const [selectedSignals, setSelectedSignals] = useState([]);

  const filteredAccounts = useMemo(() => {
    if (selectedSignals.length === 0) {
      return accounts;
    }

    return accounts.filter((account) =>
      selectedSignals.some((selectedSignal) => selectedSignal.value === account.signal),
    );
  }, [accounts, selectedSignals]);

  return {
    filteredAccounts,
    selectedSignals,
    setSelectedSignals,
  };
}
