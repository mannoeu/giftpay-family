import { TrendingDownIcon } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { useFamilyWalletQuery } from "@/queries/familyWallet";

import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletItem } from "@/components/ui/walletItem";

import { Formatter } from "@/sdk/formatter";
import { WalletColorEnum, WalletIconEnum, WalletNameEnum } from "@/sdk/wallet";

import * as S from "./styles";

export const Wallet = () => {
  const theme = useTheme();
  const { data: wallet, isReady } = useFamilyWalletQuery();

  return (
    <Card gap={8}>
      <S.Header>
        <Text fontSize="sm" color={theme.colors.stone}>
          Saldo da família
        </Text>
        {isReady ? (
          <Text fontSize="xxl" fontWeight="bold">
            {Formatter.currency(wallet?.total_balance)}
          </Text>
        ) : (
          <Skeleton
            width={140}
            height={32}
            rounded="16px"
            style={{ marginTop: 8 }}
          />
        )}
      </S.Header>

      <S.Content>
        {isReady ? (
          <>
            {wallet?.wallets?.map((w) => {
              const colors = WalletColorEnum[w.name];
              const Icon = WalletIconEnum[w.name];
              const title = WalletNameEnum[w.name];

              return (
                <WalletItem
                  key={w.id}
                  icon={Icon}
                  title={title}
                  description="Saldo total"
                  value={Formatter.currency(w.value)}
                  backgroundColor={colors.background}
                  foregroundColor={colors.foreground}
                  textColor={colors.text}
                />
              );
            })}

            <WalletItem
              icon={TrendingDownIcon}
              title="Gasto hoje"
              description="Todas as carteiras"
              value={Formatter.currency(wallet?.today_spending)}
            />
          </>
        ) : (
          <>
            <Skeleton height={56} rounded="full" />
            <Skeleton height={56} rounded="full" />
            <Skeleton height={56} rounded="full" />
          </>
        )}
      </S.Content>
    </Card>
  );
};
