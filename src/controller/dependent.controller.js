const MOCK_FAMILY_WALLET = {
  total_balance: "290.00",
  wallets: [
    { id: 1, type: "meal", balance: "150.00" },
    { id: 2, type: "allowance", balance: "140.00" },
  ],
  today_spending: "35.75",
};

const MOCK_DEPENDENTS = [
  { id: 1, name: "João", color: "#557FEA" },
  { id: 2, name: "Maria", color: "#C06990" },
  { id: 3, name: "Pedro", color: "#4DB6AC" },
  { id: 4, name: "Ana", color: "#FF8A65" },
  { id: 5, name: "Lucas", color: "#9575CD" },
];

export const getDependents = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_DEPENDENTS });
    }, 1500);
  });

export const getFamilyWallet = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_FAMILY_WALLET });
    }, 1500);
  });
