import { buildPaginatedResponse } from "@/sdk/api";
import { DepositStatus } from "@/sdk/deposit";
import { WalletEnum } from "@/sdk/wallet";

const MOCK_PIX_CODE =
  "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925GIFTPAY FAMILIA6009SAO PAULO62070503***6304ABCD";

const DEPOSIT_TEMPLATES = [
  {
    status: DepositStatus.pending,
    amount: "50.00",
    wallet: WalletEnum.meal,
    pix_code: MOCK_PIX_CODE,
    paid_at: null,
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
  {
    status: DepositStatus.paid,
    amount: "50.00",
    wallet: WalletEnum.meal,
    pix_code: null,
    paid_at: "2026-04-20T16:02:00.000Z",
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
  {
    status: DepositStatus.pending,
    amount: "30.00",
    wallet: WalletEnum.allowance,
    pix_code: MOCK_PIX_CODE,
    paid_at: null,
    parent: { id: 2, name: "Maria", color: "#C06990" },
  },
  {
    status: DepositStatus.paid,
    amount: "80.00",
    wallet: WalletEnum.allowance,
    pix_code: null,
    paid_at: "2026-04-20T16:02:00.000Z",
    parent: { id: 1, name: "João", color: "#557FEA" },
  },
];

const MOCK_COUNT = 40;

const MOCK_DEPOSITS = Array.from({ length: MOCK_COUNT }, (_, index) => {
  const template = DEPOSIT_TEMPLATES[index % DEPOSIT_TEMPLATES.length];
  const day = 20 - Math.floor(index / DEPOSIT_TEMPLATES.length);
  const createdAt = `2026-04-${String(Math.max(day, 1)).padStart(2, "0")}T16:00:00.000Z`;

  return {
    ...template,
    id: index + 1,
    created_at: createdAt,
    paid_at:
      template.status === DepositStatus.paid
        ? `2026-04-${String(Math.max(day, 1)).padStart(2, "0")}T16:02:00.000Z`
        : null,
    parent: { ...template.parent },
  };
});

const filterDepositsByStatus = (deposits, status) => {
  if (status == null || status === "") return deposits;

  return deposits.filter((item) => String(item.status) === String(status));
};

export const getDeposits = ({ status, page, pageSize = 20 } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const items = filterDepositsByStatus(MOCK_DEPOSITS, status);

      if (page == null) {
        resolve({ data: items });
        return;
      }

      resolve({
        data: buildPaginatedResponse(items, {
          page,
          pageSize,
          path: "https://api.local/deposits",
        }),
      });
    }, 1500);
  });
