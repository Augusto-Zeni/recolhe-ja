import { Text } from '@/src/components/Text'
import { colors } from '@/src/styles/colors'
import React, { forwardRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'

/**
 * Propriedades do componente Input
 * Estende as propriedades nativas do TextInput com funcionalidades adicionais
 */
export interface InputProps extends TextInputProps {
  /** Rótulo exibido acima do campo de entrada */
  label?: string;
  /** Mensagem de erro exibida abaixo do campo */
  error?: string;
  /** Variante visual do input (atualmente não implementada) */
  variant?: 'primary' | 'secondary';
  /** Cor customizada da borda */
  borderColor?: string;
  /** Estilos customizados para o container principal */
  containerStyle?: object;
  /** Estilos customizados para o campo de entrada */
  inputStyle?: object;
  /** Estilos customizados para o rótulo */
  labelStyle?: object;
  /** Estilos customizados para a mensagem de erro */
  errorStyle?: object;
}

/**
 * Componente Input reutilizável com validação e estilização
 * 
 * Campo de entrada de texto padronizado usado em formulários com:
 * - Suporte a rótulos e mensagens de erro
 * - Validação visual (borda vermelha para erros)
 * - Ref forwarding para controle programático
 * - Estilos customizáveis para diferentes contextos
 * - Acessibilidade integrada
 * 
 * @example
 * ```tsx
 * // Input básico com rótulo
 * <Input
 *   label="E-mail"
 *   placeholder="Digite seu e-mail"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 * 
 * // Input com validação de erro
 * <Input
 *   label="Senha"
 *   placeholder="Digite sua senha"
 *   secureTextEntry
 *   value={password}
 *   onChangeText={setPassword}
 *   error={passwordError}
 * />
 * 
 * // Input com ref para controle programático
 * const inputRef = useRef<TextInput>(null);
 * <Input
 *   ref={inputRef}
 *   label="Nome"
 *   onSubmitEditing={() => inputRef.current?.focus()}
 * />
 * ```
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      variant = 'primary',
      borderColor,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      ...props
    },
    ref
  ) => {
    /**
     * Determina a cor da borda baseada no estado do input
     * Prioridades: erro (vermelho) > cor customizada > transparente
     */
    const getBorderColor = () => {
      if (error) return colors.red
      if (borderColor) return borderColor
      return colors.transparent
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Rótulo opcional acima do campo */}
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        
        {/* Campo de entrada principal */}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            { borderColor: getBorderColor() },
            inputStyle,
          ]}
          placeholderTextColor={colors.gray200}
          accessibilityLabel={label}
          accessibilityHint={error}
          {...props}
        />
        
        {/* Mensagem de erro opcional abaixo do campo */}
        {error && (
          <Text style={[styles.error, errorStyle]}>
            {error}
          </Text>
        )}
      </View>
    )
  }
)

/**
 * Estilos do componente Input
 * 
 * Define a aparência visual padrão:
 * - container: Wrapper principal sem estilos (permitindo customização)
 * - label: Rótulo com tipografia legível e espaçamento adequado
 * - input: Campo principal com bordas, padding e cor de fundo
 * - error: Mensagem de erro em vermelho com tamanho menor
 */
const styles = StyleSheet.create({
  /** Container principal - neutro para permitir customização */
  container: {},
  
  /** Estilo do rótulo - tipografia clara com espaçamento inferior */
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  
  /** Estilo do campo de entrada - visual padronizado com borda e fundo */
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.black200,
    backgroundColor: colors.gray100,
  },
  
  /** Estilo da mensagem de erro - texto menor em vermelho */
  error: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
  },
})

// Define nome para debugging e ferramentas de desenvolvimento
Input.displayName = 'Input'