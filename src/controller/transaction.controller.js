import { buildPaginatedResponse } from "@/sdk/api";

const TRANSACTION_TEMPLATES = [
  {
    direction: "out",
    status: "approved",
    title: "Compra aprovada",
    subtitle: "Em Livraria XPTO",
    amount: "15.00",
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
  {
    direction: "out",
    status: "denied",
    title: "Compra negada",
    subtitle: "Em Livraria XPTO",
    amount: "15.00",
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
  {
    direction: "in",
    status: "approved",
    title: "Recarga realizada",
    subtitle: "Carteira Lanche",
    amount: "50.00",
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
  {
    direction: "out",
    status: "approved",
    title: "Compra aprovada",
    subtitle: "Em Padaria Central",
    amount: "8.50",
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
];

const MOCK_COUNT = 40;

const MOCK_TRANSACTIONS = Array.from({ length: MOCK_COUNT }, (_, index) => {
  const template = TRANSACTION_TEMPLATES[index % TRANSACTION_TEMPLATES.length];
  const day = 20 - Math.floor(index / TRANSACTION_TEMPLATES.length);

  return {
    ...template,
    id: index + 1,
    created_at: `2026-04-${String(Math.max(day, 1)).padStart(2, "0")}T16:30:00.000Z`,
    parent: { ...template.parent },
  };
});

const filterTransactionsByParent = (transactions, parentId) => {
  if (parentId == null || parentId === "") return transactions;

  return transactions.filter(
    (item) => String(item.parent?.id) === String(parentId),
  );
};

export const getTransactions = ({ parentId, page, pageSize = 20 } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const items = filterTransactionsByParent(MOCK_TRANSACTIONS, parentId);

      if (page == null) {
        resolve({ data: items });
        return;
      }

      resolve({
        data: buildPaginatedResponse(items, {
          page,
          pageSize,
          path: "https://api.local/transactions",
        }),
      });
    }, 1500);
  });
