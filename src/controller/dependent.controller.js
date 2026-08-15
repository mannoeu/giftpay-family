const MOCK_DEPENDENTS = [
  { id: 1, nome: "João", color: "#557FEA" },
  { id: 2, nome: "Maria", color: "#C06990" },
  { id: 3, nome: "Pedro", color: "#4DB6AC" },
  { id: 4, nome: "Ana", color: "#FF8A65" },
  { id: 5, nome: "Lucas", color: "#9575CD" },
];

export const getDependents = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_DEPENDENTS });
    }, 2000);
  });
