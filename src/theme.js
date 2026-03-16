// ============================================
// CLARITY — Design Tokens
// Importa lo que necesites: import { colors, spacing, radius, shadows, typography } from '../theme'
// ============================================

export const colors = {
  // Marca
  primary:        '#F5C020',
  primaryHover:   '#F0B800',
  primaryLight:   '#FEF3C7',
  primaryText:    '#1A1A2E',

  // Azul marino (sidebar)
  navy:           '#0D2145',
  navyHover:      'rgba(255,255,255,0.06)',
  navyBorder:     'rgba(255,255,255,0.08)',

  // Fondos
  bgApp:          '#EEF1F7',
  bgCard:         '#FFFFFF',
  bgInput:        '#F7F9FC',
  bgRowAlt:       '#FAFBFC',
  bgRowHover:     'rgba(245,192,32,0.06)',

  // Texto
  textPrimary:    '#1A2545',
  textSecondary:  '#5A6380',
  textMuted:      '#9AA3B8',
  textWhite:      '#FFFFFF',
  textWhite60:    'rgba(255,255,255,0.6)',
  textWhite40:    'rgba(255,255,255,0.4)',

  // Bordes
  border:         '#E4E8F0',
  borderInput:    '#DDE2EC',
  borderFocus:    '#F5C020',
  focusShadow:    'rgba(245,192,32,0.2)',

  // Semánticos
  success:        '#1E6E3A',
  successHover:   '#175C30',
  successLight:   '#ECFDF5',
  successBorder:  '#A7F3D0',
  successText:    '#065F46',

  danger:         '#C0392B',
  dangerHover:    '#A93226',
  dangerLight:    '#FEF2F2',
  dangerBorder:   '#FECACA',
  dangerText:     '#991B1B',

  warning:        '#D97706',
  warningLight:   '#FFFBEB',
  warningText:    '#92400E',

  info:           '#1D4ED8',
  infoLight:      '#EFF6FF',
  infoText:       '#1E3A8A',

  // Badge
  badge:          '#E03030',
  badgeText:      '#FFFFFF',
}

export const radius = {
  sm:   '6px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
}

export const shadows = {
  card:    '0 1px 6px rgba(0,0,0,0.06)',
  sidebar: '2px 0 12px rgba(0,0,0,0.12)',
  focus:   `0 0 0 3px rgba(245,192,32,0.2)`,
}

export const typography = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  xs:   '11px',
  sm:   '12px',
  base: '13px',
  md:   '14px',
  lg:   '16px',
  xl:   '18px',
  '2xl':'22px',
}

export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '12px',
  lg:  '16px',
  xl:  '20px',
  '2xl':'24px',
  '3xl':'32px',
}

// ── Estilos reutilizables (objetos style={} listos para usar) ──────────

export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${colors.borderInput}`,
  borderRadius: radius.md,
  fontSize: typography.base,
  color: colors.textPrimary,
  background: colors.bgInput,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export const inputFocusStyle = {
  borderColor: colors.borderFocus,
  boxShadow: shadows.focus,
  background: colors.bgCard,
}

export const inputBlurStyle = {
  borderColor: colors.borderInput,
  boxShadow: 'none',
  background: colors.bgInput,
}

export const cardStyle = {
  background: colors.bgCard,
  borderRadius: radius.lg,
  boxShadow: shadows.card,
  padding: spacing['2xl'],
}

export const formLabelStyle = {
  display: 'block',
  fontSize: typography.xs,
  fontWeight: 600,
  color: colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  marginBottom: '6px',
}

export const btnPrimary = {
  padding: '10px 24px',
  background: colors.primary,
  color: colors.primaryText,
  border: 'none',
  borderRadius: radius.md,
  fontSize: typography.base,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.15s',
  width: '100%',
}

export const btnSuccess = {
  padding: '10px 28px',
  background: colors.success,
  color: colors.textWhite,
  border: 'none',
  borderRadius: radius.md,
  fontSize: typography.base,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.15s',
}

export const btnDanger = {
  width: '100%',
  padding: '8px',
  background: colors.danger,
  color: colors.textWhite,
  border: 'none',
  borderRadius: radius.md,
  fontSize: typography.sm,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.15s',
}

export const thStyle = {
  textAlign: 'left',
  padding: '12px 20px',
  fontSize: typography.xs,
  fontWeight: 600,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  background: colors.bgInput,
  borderBottom: `1px solid ${colors.border}`,
}