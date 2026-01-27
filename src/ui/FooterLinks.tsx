import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

interface FooterLinksProps {
  privacyUrl?: string;
  termsUrl?: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({
  privacyUrl = 'https://example.com/politica-de-privacidade',
  termsUrl = 'https://example.com/termos-de-uso',
}) => {
  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      // ignore errors for now
    }
  };

  return (
    <View style={styles.footerContainer} pointerEvents="box-none">
      <View style={styles.footerInner}>
        <TouchableOpacity onPress={() => open(privacyUrl)}>
          <Text style={styles.footerLink}>Política de Privacidade</Text>
        </TouchableOpacity>

        <Text style={styles.footerSeparator}>•</Text>

        <TouchableOpacity onPress={() => open(termsUrl)}>
          <Text style={styles.footerLink}>Termos de Uso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    color: '#9fb7d3',
    fontSize: 12,
    textDecorationLine: 'underline',
    marginHorizontal: 6,
  },
  footerSeparator: {
    color: '#7a9cba',
    fontSize: 12,
  },
});

export default FooterLinks;
