import { globalStyles } from '@/src/styles/globalStyles'
import { Text as RNText, type StyleProp, type TextStyle, type TextProps as RNTextProps } from 'react-native'

/**
 * Propriedades do componente Text
 * Estende as propriedades nativas do Text do React Native
 */
interface TextProps extends RNTextProps {
  /** Estilos customizados para o texto */
  style?: StyleProp<TextStyle>;
  /** Conteúdo do texto */
  children: React.ReactNode;
}

/**
 * Componente Text padronizado
 * 
 * Wrapper do Text nativo do React Native que aplica:
 * - Estilos globais consistentes (tipografia, cores)
 * - Base para customizações específicas
 * - Manutenção centralizada da tipografia
 * - Suporte completo às propriedades nativas
 * 
 * Este componente garante que todo texto da aplicação siga
 * os padrões visuais definidos no design system.
 * 
 * @example
 * ```tsx
 * // Texto básico com estilo global
 * <Text>Texto padrão da aplicação</Text>
 * 
 * // Texto com estilo customizado
 * <Text style={{fontSize: 18, fontWeight: 'bold'}}>
 *   Título personalizado
 * </Text>
 * 
 * // Texto com propriedades nativas
 * <Text numberOfLines={2} ellipsizeMode="tail">
 *   Texto longo que será truncado com reticências
 * </Text>
 * 
 * // Texto acessível
 * <Text accessibilityRole="header">
 *   Cabeçalho da seção
 * </Text>
 * ```
 */
export function Text({ style, children, ...props }: TextProps) {
  return (
    <RNText style={[globalStyles.text, style]} {...props}>
      {children}
    </RNText>
  )
}