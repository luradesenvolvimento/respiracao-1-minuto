import React from "react";
import { View } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
// import { PaywallScreen } from "../screens/PaywallScreen";
import { TabType } from "../types";

interface NavigationContainerProps {
  activeTab: TabType;
  isPremium: boolean | null;
  onShowPremiumModal: () => void;
  onPremiumChange: (isPremium: boolean) => void;
}

export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  activeTab,
  isPremium,
  onShowPremiumModal,
  onPremiumChange
}) => {
  const renderScreen = () => {
    switch (activeTab) {
      case TabType.RESPIRACAO:
        return (
          <HomeScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
            onPremiumChange={onPremiumChange}
          />
        );
      case TabType.HISTORICO:
        return (
          <HistoryScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
          />
        );
      case TabType.CONFIG:
        return <SettingsScreen />;
      case TabType.PREMIUM:
        // Agora exibe a tela Paywall
        return (
          <HomeScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
            onPremiumChange={onPremiumChange}
          />);
      default:
        return (
          <HomeScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
            onPremiumChange={onPremiumChange}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
};