import React from "react";
import { View } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

type TabType = 'respiracao' | 'historico' | 'premium' | 'config';

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
      case 'respiracao':
        return (
          <HomeScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
            onPremiumChange={onPremiumChange}
          />
        );
      case 'historico':
        return <HistoryScreen />;
      case 'config':
        return <SettingsScreen />;
      case 'premium':
        // Para premium, podemos mostrar a tela home ou uma tela específica
        return (
          <HomeScreen
            isPremium={isPremium}
            onShowPremiumModal={onShowPremiumModal}
            onPremiumChange={onPremiumChange}
          />
        );
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