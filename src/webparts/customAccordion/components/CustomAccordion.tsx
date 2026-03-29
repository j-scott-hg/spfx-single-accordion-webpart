import * as React from 'react';
import { useState, CSSProperties } from 'react';
import styles from './CustomAccordion.module.scss';
import type { ICustomAccordionProps } from './ICustomAccordionProps';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { useUniqueId } from '../utils/useId';

// ─────────────────────────────────────────────────────────────────────────────
// SVG icon components
// Keeping these inline avoids a separate icon bundle dependency.
// ─────────────────────────────────────────────────────────────────────────────

interface IIconProps {
  size: number;
  color: string;
  className?: string;
  style?: CSSProperties;
}

const ChevronIcon: React.FC<IIconProps> = ({ size, color, className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
    style={style}
  >
    <path
      d="M3.5 6L8 10.5L12.5 6"
      stroke={color || 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretIcon: React.FC<IIconProps> = ({ size, color, className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
    className={className}
    style={style}
  >
    <path d="M4 6l4 4 4-4" fill={color || 'currentColor'} />
  </svg>
);

const ArrowIcon: React.FC<IIconProps> = ({ size, color, className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
    style={style}
  >
    <path
      d="M8 3v10M3 8l5 5 5-5"
      stroke={color || 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus and minus are rendered together so the component can swap them
const PlusIcon: React.FC<IIconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8 3v10M3 8h10"
      stroke={color || 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MinusIcon: React.FC<IIconProps> = ({ size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3 8h10"
      stroke={color || 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a string value + optional px suffix into a CSS length string */
function toPx(val: string | undefined, fallback = '0'): string {
  if (!val && val !== '0') return `${fallback}px`;
  const n = parseFloat(val);
  if (isNaN(n)) return `${fallback}px`;
  return `${n}px`;
}

/** Return val if non-empty, otherwise undefined (so inline style key is omitted) */
function orUndef(val: string | undefined): string | undefined {
  return val && val.trim() !== '' ? val : undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const CustomAccordion: React.FC<ICustomAccordionProps> = (props) => {
  const {
    // Content
    webPartTitle,
    showTitle,
    titleFontSize,
    titleFontWeight,
    titleColor,
    titleAlignment,
    titleSpacingBelow,
    triggerText,
    bodyContent,
    defaultExpanded,

    // Layout
    widthMode,
    maxWidth,
    widthUnit,
    containerAlignment,
    marginTop,
    marginBottom,

    // Trigger
    triggerFontFamily,
    triggerFontSize,
    triggerFontWeight,
    triggerTextColor,
    triggerBgColor,
    triggerBgColorOpen,
    triggerBorderColor,
    triggerBorderColorOpen,
    triggerBorderRadius,
    triggerPaddingV,
    triggerPaddingH,
    triggerMinHeight,
    triggerAlignment,
    triggerWrapText,
    clickAreaFull,

    // Body
    bodyFontFamily,
    bodyFontSize,
    bodyFontWeight,
    bodyLineHeight,
    bodyTextColor,
    bodyBgColor,
    bodyPaddingV,
    bodyPaddingH,
    bodyBorderColor,
    bodyBorderWidth,
    bodyBorderRadius,
    bodyTextAlignment,
    bodyTopSpacing,

    // Icon
    showIcon,
    iconType,
    iconPlacement,
    iconSize,
    iconColor,
    animateIcon,

    // Advanced
    showDivider,
    boxShadow,
    transitionDuration,
    compactMode,

    // Runtime
    isEditMode,
  } = props;

  // ── State ────────────────────────────────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState<boolean>(!!defaultExpanded);

  // When the author changes the defaultExpanded value in the property pane
  // while the page is in edit mode, reflect it immediately
  React.useEffect(() => {
    setIsExpanded(!!defaultExpanded);
  }, [defaultExpanded]);

  // ── IDs for accessibility ────────────────────────────────────────────────
  // useUniqueId produces a stable, unique ID per component instance — safe for
  // multiple accordion instances on the same page
  const uid = useUniqueId();
  const contentId = `accordion-content-${uid}`;
  const triggerId = `accordion-trigger-${uid}`;

  // ── Computed values ──────────────────────────────────────────────────────
  const resolvedTriggerText = triggerText && triggerText.trim()
    ? triggerText
    : 'More information';

  const resolvedBodyContent = sanitizeHtml(bodyContent || '');
  const hasBodyContent = resolvedBodyContent.trim().length > 0;

  const transitionMs = parseFloat(transitionDuration) || 250;

  const iconSizeNum = parseFloat(iconSize) || 16;
  const resolvedIconColor = orUndef(iconColor) ?? 'currentColor';

  // Width / alignment for the outer wrapper
  const wrapperStyle: CSSProperties = {
    marginTop: toPx(marginTop),
    marginBottom: toPx(marginBottom),
  };

  if (widthMode === 'custom' && maxWidth) {
    const unit = widthUnit || 'px';
    wrapperStyle.maxWidth = `${maxWidth}${unit}`;
    wrapperStyle.width = '100%';

    if (containerAlignment === 'center') {
      wrapperStyle.marginLeft = 'auto';
      wrapperStyle.marginRight = 'auto';
    } else if (containerAlignment === 'right') {
      wrapperStyle.marginLeft = 'auto';
      wrapperStyle.marginRight = '0';
    }
  }

  // Container border and shadow
  const containerStyle: CSSProperties = {
    borderRadius: toPx(triggerBorderRadius),
    overflow: 'hidden',
  };

  // Trigger inline styles — applied to both the row and any inner elements
  const triggerActiveBgColor = isExpanded && triggerBgColorOpen
    ? triggerBgColorOpen
    : triggerBgColor;
  const triggerActiveBorderColor = isExpanded && triggerBorderColorOpen
    ? triggerBorderColorOpen
    : triggerBorderColor;

  const triggerStyle: CSSProperties = {
    fontFamily: orUndef(triggerFontFamily),
    fontSize: toPx(triggerFontSize, '15'),
    fontWeight: orUndef(triggerFontWeight) as CSSProperties['fontWeight'],
    color: orUndef(triggerTextColor),
    backgroundColor: orUndef(triggerActiveBgColor),
    borderColor: orUndef(triggerActiveBorderColor),
    borderStyle: triggerActiveBorderColor ? 'solid' : undefined,
    borderWidth: triggerActiveBorderColor ? '1px' : undefined,
    borderRadius: toPx(triggerBorderRadius),
    padding: `${toPx(triggerPaddingV, '12')} ${toPx(triggerPaddingH, '16')}`,
    minHeight: toPx(triggerMinHeight, '48'),
    justifyContent: triggerAlignment === 'center'
      ? 'center'
      : triggerAlignment === 'right'
        ? 'flex-end'
        : 'flex-start',
    textAlign: triggerAlignment || 'left',
  };

  // Body inline styles
  const bodyStyle: CSSProperties = {
    fontFamily: orUndef(bodyFontFamily),
    fontSize: toPx(bodyFontSize, '14'),
    fontWeight: orUndef(bodyFontWeight) as CSSProperties['fontWeight'],
    lineHeight: orUndef(bodyLineHeight) ?? '1.6',
    color: orUndef(bodyTextColor),
    backgroundColor: orUndef(bodyBgColor),
    padding: `${toPx(bodyTopSpacing, '0')} ${toPx(bodyPaddingH, '16')} ${toPx(bodyPaddingV, '16')} ${toPx(bodyPaddingH, '16')}`,
    borderColor: orUndef(bodyBorderColor),
    borderStyle: bodyBorderColor ? 'solid' : undefined,
    borderWidth: bodyBorderColor ? toPx(bodyBorderWidth, '1') : undefined,
    borderTop: showDivider ? 'none' : undefined,
    borderRadius: toPx(bodyBorderRadius),
    textAlign: (bodyTextAlignment || 'left') as CSSProperties['textAlign'],
  };

  // Title inline styles
  const titleStyle: CSSProperties = {
    fontSize: toPx(titleFontSize, '16'),
    fontWeight: orUndef(titleFontWeight) as CSSProperties['fontWeight'],
    color: orUndef(titleColor),
    textAlign: (titleAlignment || 'left') as CSSProperties['textAlign'],
    marginBottom: toPx(titleSpacingBelow, '12'),
  };

  // ── Icon rendering ───────────────────────────────────────────────────────
  const renderIcon = (): React.ReactElement | null => {
    if (!showIcon || iconType === 'none') return null;

    const iconStyle: CSSProperties = animateIcon
      ? {
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: `transform ${transitionMs}ms ease`,
        }
      : {};

    const iconProps: IIconProps = {
      size: iconSizeNum,
      color: resolvedIconColor,
      className: animateIcon ? styles.iconAnimated : undefined,
      style: iconStyle,
    };

    if (iconType === 'plusminus') {
      return (
        <span
          className={styles.iconWrapper}
          aria-hidden="true"
          style={{ width: iconSizeNum, height: iconSizeNum }}
        >
          {isExpanded ? (
            <MinusIcon size={iconSizeNum} color={resolvedIconColor} />
          ) : (
            <PlusIcon size={iconSizeNum} color={resolvedIconColor} />
          )}
        </span>
      );
    }

    if (iconType === 'caret') {
      return (
        <span className={styles.iconWrapper} aria-hidden="true">
          <CaretIcon {...iconProps} />
        </span>
      );
    }

    if (iconType === 'arrow') {
      return (
        <span className={styles.iconWrapper} aria-hidden="true">
          <ArrowIcon {...iconProps} />
        </span>
      );
    }

    // Default: chevron
    return (
      <span className={styles.iconWrapper} aria-hidden="true">
        <ChevronIcon {...iconProps} />
      </span>
    );
  };

  // ── Toggle handler ───────────────────────────────────────────────────────
  const handleToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  // ── Build the trigger contents ───────────────────────────────────────────
  const iconNode = renderIcon();

  // Determine flex layout of icon vs text based on placement
  const isIconLeft = iconPlacement === 'left' || iconPlacement === 'beforeText';
  const isIconRight = iconPlacement === 'right' || iconPlacement === 'afterText';

  // Gap between icon and label (scales with icon size)
  const iconGap = Math.round(iconSizeNum * 0.5);

  const labelNode = (
    <span
      className={`${styles.triggerLabel} ${!triggerWrapText ? styles.triggerLabelNoWrap : ''}`}
    >
      {resolvedTriggerText}
    </span>
  );

  const triggerContents = (
    <>
      {isIconLeft && iconNode && (
        <span style={{ marginRight: iconGap, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {iconNode}
        </span>
      )}

      {labelNode}

      {isIconRight && iconNode && (
        <span style={{ marginLeft: 'auto', paddingLeft: iconGap, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {iconNode}
        </span>
      )}
    </>
  );

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div
      className={`${styles.accordionWrapper} ${compactMode ? styles.compactMode : ''}`}
      style={wrapperStyle}
    >
      {/* Web part title */}
      {showTitle && webPartTitle && (
        <h2 className={styles.webPartTitle} style={titleStyle}>
          {webPartTitle}
        </h2>
      )}

      {/* Accordion card */}
      <div
        className={`${styles.accordionContainer} ${boxShadow ? styles.hasShadow : ''}`}
        style={containerStyle}
      >
        {/*
          Accessibility: The trigger is always a <button> element.
          When clickAreaFull=true the entire row IS the button.
          When clickAreaFull=false the row is a presentational div and the
          button is an inner element wrapping icon+text only.
          Both patterns correctly expose aria-expanded and aria-controls.
        */}
        {clickAreaFull ? (
          <button
            id={triggerId}
            type="button"
            className={`${styles.triggerRow} ${styles.triggerRowButton}`}
            style={triggerStyle}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={handleToggle}
          >
            {triggerContents}
          </button>
        ) : (
          <div
            className={`${styles.triggerRow} ${styles.triggerRowInert}`}
            style={triggerStyle}
          >
            <button
              id={triggerId}
              type="button"
              className={styles.triggerButton}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
            >
              {triggerContents}
            </button>
          </div>
        )}

        {/* Optional divider between trigger and content */}
        {showDivider && isExpanded && (
          <hr
            className={styles.divider}
            style={{ backgroundColor: orUndef(triggerActiveBorderColor) ?? '#edebe9' }}
            aria-hidden="true"
          />
        )}

        {/* Content region — aria-labelledby links it to the trigger button */}
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className={`${styles.contentPanel} ${isExpanded ? styles.contentPanelExpanded : ''}`}
          style={{ transitionDuration: `${transitionMs}ms` }}
          hidden={!isExpanded}
        >
          {hasBodyContent ? (
            <div
              className={styles.contentInner}
              style={bodyStyle}
              // sanitizeHtml() strips disallowed tags/attributes before this point
              dangerouslySetInnerHTML={{ __html: resolvedBodyContent }}
            />
          ) : (
            isEditMode && (
              <div className={styles.emptyState}>
                No content yet. Add your disclaimer or policy text in the property pane.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAccordion;
