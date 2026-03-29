/**
 * All props passed from the web part class into the React component.
 * Properties mirror the web part property bag 1-to-1 so the component
 * remains pure and testable without SPFx context.
 */
export interface ICustomAccordionProps {
  // ── Content ──────────────────────────────────────────────────────────────
  webPartTitle: string;
  showTitle: boolean;
  titleFontSize: string;
  titleFontWeight: string;
  titleColor: string;
  titleAlignment: string;
  titleSpacingBelow: string;

  triggerText: string;
  bodyContent: string;          // HTML string; sanitised before dangerouslySetInnerHTML
  defaultExpanded: boolean;

  // ── Layout ───────────────────────────────────────────────────────────────
  widthMode: 'full' | 'custom';
  maxWidth: string;
  widthUnit: 'px' | '%' | 'rem';
  containerAlignment: 'left' | 'center' | 'right';
  marginTop: string;
  marginBottom: string;

  // ── Trigger styling ──────────────────────────────────────────────────────
  triggerFontFamily: string;
  triggerFontSize: string;
  triggerFontWeight: string;
  triggerTextColor: string;
  triggerBgColor: string;
  triggerBgColorOpen: string;   // if blank, falls back to triggerBgColor
  triggerBorderColor: string;
  triggerBorderColorOpen: string;
  triggerBorderRadius: string;
  triggerPaddingV: string;
  triggerPaddingH: string;
  triggerMinHeight: string;
  triggerAlignment: 'left' | 'center' | 'right';
  triggerWrapText: boolean;
  clickAreaFull: boolean;       // true = whole row is the button

  // ── Body styling ─────────────────────────────────────────────────────────
  bodyFontFamily: string;
  bodyFontSize: string;
  bodyFontWeight: string;
  bodyLineHeight: string;
  bodyTextColor: string;
  bodyBgColor: string;
  bodyPaddingV: string;
  bodyPaddingH: string;
  bodyBorderColor: string;
  bodyBorderWidth: string;
  bodyBorderRadius: string;
  bodyTextAlignment: 'left' | 'center' | 'right';
  bodyTopSpacing: string;

  // ── Icon settings ────────────────────────────────────────────────────────
  showIcon: boolean;
  iconType: 'chevron' | 'caret' | 'plusminus' | 'arrow' | 'none';
  iconPlacement: 'left' | 'right' | 'beforeText' | 'afterText';
  iconSize: string;
  iconColor: string;
  animateIcon: boolean;

  // ── Advanced / Behavior ──────────────────────────────────────────────────
  showDivider: boolean;
  boxShadow: boolean;
  transitionDuration: string;   // milliseconds as string
  compactMode: boolean;

  // ── Runtime context ──────────────────────────────────────────────────────
  isEditMode: boolean;          // true when page is in edit mode
}
