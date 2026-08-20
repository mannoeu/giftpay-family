const MOCK_TRANSACTIONS = [
  {
    id: 1,
    direction: "out",
    status: "approved",
    title: "Compra aprovada",
    subtitle: "Em Livraria XPTO",
    amount: "15.00",
    created_at: "2026-04-20T16:30:00.000Z",
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
  {
    id: 2,
    direction: "out",
    status: "denied",
    title: "Compra negada",
    subtitle: "Em Livraria XPTO",
    amount: "15.00",
    created_at: "2026-04-20T16:30:00.000Z",
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
  {
    id: 3,
    direction: "in",
    status: "approved",
    title: "Recarga realizada",
    subtitle: "Carteira Lanche",
    amount: "50.00",
    created_at: "2026-04-20T16:30:00.000Z",
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
  {
    id: 4,
    direction: "out",
    status: "approved",
    title: "Compra aprovada",
    subtitle: "Em Padaria Central",
    amount: "8.50",
    created_at: "2026-04-19T15:00:00.000Z",
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
];

const filterTransactionsByParent = (transactions, parentId) => {
  if (parentId == null || parentId === "") return transactions;

  return transactions.filter(
    (item) => String(item.parent?.id) === String(parentId),
  );
};

export const getTransactions = ({ parentId } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: filterTransactionsByParent(MOCK_TRANSACTIONS, parentId),
      });
    }, 1500);
  });
