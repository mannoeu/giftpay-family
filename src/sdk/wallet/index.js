import { PiggyBankIcon, PizzaIcon } from "lucide-react-native";

export const WalletEnum = {
  meal: "meal",
  allowance: "allowance",
};

export const WalletNameEnum = {
  [WalletEnum.meal]: "Lanche",
  [WalletEnum.allowance]: "Mesada",
};

export const WalletIconEnum = {
  [WalletEnum.meal]: PizzaIcon,
  [WalletEnum.allowance]: PiggyBankIcon,
};

export const WalletColorEnum = {
  [WalletEnum.meal]: {
    background: "#7CBAF9",
    foreground: "#71A6DC",
    text: "#ffffff",
  },
  [WalletEnum.allowance]: {
    background: "#FF945D",
    foreground: "#E0804E",
    text: "#ffffff",
  },
};
