import { colors } from '@/src/styles/colors'
import { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native'

/**
 * Propriedades do componente Button
 */
interface ButtonProps {
  /** Conteúdo do botão (texto, ícones, outros componentes) */
  children: ReactNode;
  /** Função chamada quando o botão é pressionado */
  onPress: () => void;
  /** Variante visual do botão que define cores e estilo */
  variant?: 'primary' | 'secondary';
  /** Estilos customizados adicionais */
  style?: StyleProp<ViewStyle>;
  /** Se true, desabilita o botão e aplica estilo visual de desabilitado */
  disabled?: boolean;
}

/**
 * Componente Button reutilizável
 * 
 * Botão padronizado usado em toda a aplicação com:
 * - Diferentes variantes visuais (primary, secondary)
 * - Estado de desabilitado
 * - Feedback visual ao toque
 * - Suporte a estilos customizados
 * - Acessibilidade integrada
 * 
 * @example
 * ```tsx
 * // Botão primário padrão
 * <Button onPress={handleLogin} variant="primary">
 *   <Text style={{color: 'white'}}>Entrar</Text>
 * </Button>
 * 
 * // Botão secundário com estilo customizado
 * <Button 
 *   onPress={handleCancel} 
 *   variant="secondary"
 *   style={{marginTop: 10}}
 * >
 *   <Text>Cancelar</Text>
 * </Button>
 * 
 * // Botão desabilitado
 * <Button onPress={handleSubmit} disabled={!isFormValid}>
 *   <Text>Enviar</Text>
 * </Button>
 * ```
 */
export function Button({
  children,
  onPress,
  style = {},
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {children}
    </TouchableOpacity>
  )
}

/**
 * Estilos do componente Button
 * 
 * Define a aparência visual para diferentes variantes:
 * - button: Estilo base compartilhado por todas as variantes
 * - primary: Botão principal com cor de destaque (verde escuro)
 * - secondary: Botão secundário com cor mais suave (verde claro)
 * - disabled: Estado desabilitado com opacidade reduzida
 */
const styles = StyleSheet.create({
  /** Estilo base do botão com padding, bordas arredondadas e centralização */
  button: {
    padding: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  /** Variante primária: cor verde escura para ações principais */
  primary: {
    backgroundColor: colors.green300,
  },
  /** Variante secundária: cor verde clara para ações secundárias */
  secondary: {
    backgroundColor: colors.green100,
  },
  /** Estado desabilitado: reduz opacidade para indicar que não está interativo */
  disabled: {
    opacity: 0.5,
  },
})