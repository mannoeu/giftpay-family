const MOCK_FAMILY_WALLET = {
  total_balance: "290.00",
  wallets: [
    { id: 1, type: "meal", balance: "150.00" },
    { id: 2, type: "allowance", balance: "140.00" },
  ],
  today_spending: "35.75",
};

const INITIAL_MOCK_DEPENDENTS = [
  { id: 1, name: "João", color: "#557FEA" },
  { id: 2, name: "Maria", color: "#C06990" },
  { id: 3, name: "Pedro", color: "#4DB6AC" },
  { id: 4, name: "Ana", color: "#FF8A65" },
  { id: 5, name: "Lucas", color: "#9575CD" },
];

let MOCK_DEPENDENTS = INITIAL_MOCK_DEPENDENTS.map((item) => ({ ...item }));

const MOCK_DELAY_MS = 1500;

export const resetMockDependents = () => {
  MOCK_DEPENDENTS = INITIAL_MOCK_DEPENDENTS.map((item) => ({ ...item }));
};

const delay = (result) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, MOCK_DELAY_MS);
  });

export const getDependents = () =>
  delay({ data: MOCK_DEPENDENTS.map((item) => ({ ...item })) });

export const getFamilyWallet = () => delay({ data: MOCK_FAMILY_WALLET });

export const createDependent = ({ data }) => {
  const nextId =
    MOCK_DEPENDENTS.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  const dependent = {
    id: nextId,
    name: data.name,
    color: data.color,
    birthDate: data.birthDate,
  };

  MOCK_DEPENDENTS = [...MOCK_DEPENDENTS, dependent];

  return delay({ data: dependent });
};
