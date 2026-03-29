import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  PropertyPaneLabel,
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CustomAccordionWebPartStrings';
import CustomAccordion from './components/CustomAccordion';
import { ICustomAccordionProps } from './components/ICustomAccordionProps';

// ─────────────────────────────────────────────────────────────────────────────
// Web part property bag interface
// Every property here maps to a manifest preconfiguredEntry default and to a
// prop in ICustomAccordionProps.
// ─────────────────────────────────────────────────────────────────────────────

export interface ICustomAccordionWebPartProps {
  // Content
  webPartTitle: string;
  showTitle: boolean;
  titleFontSize: string;
  titleFontWeight: string;
  titleColor: string;
  titleAlignment: string;
  titleSpacingBelow: string;
  triggerText: string;
  bodyContent: string;
  defaultExpanded: boolean;

  // Layout
  widthMode: string;
  maxWidth: string;
  widthUnit: string;
  containerAlignment: string;
  marginTop: string;
  marginBottom: string;

  // Trigger styling
  triggerFontFamily: string;
  triggerFontSize: string;
  triggerFontWeight: string;
  triggerTextColor: string;
  triggerBgColor: string;
  triggerBgColorOpen: string;
  triggerBorderColor: string;
  triggerBorderColorOpen: string;
  triggerBorderRadius: string;
  triggerPaddingV: string;
  triggerPaddingH: string;
  triggerMinHeight: string;
  triggerAlignment: string;
  triggerWrapText: boolean;
  clickAreaFull: boolean;

  // Body styling
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
  bodyTextAlignment: string;
  bodyTopSpacing: string;

  // Icon settings
  showIcon: boolean;
  iconType: string;
  iconPlacement: string;
  iconSize: string;
  iconColor: string;
  animateIcon: boolean;

  // Advanced
  showDivider: boolean;
  boxShadow: boolean;
  transitionDuration: string;
  compactMode: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable dropdown option builders
// ─────────────────────────────────────────────────────────────────────────────

const alignmentOptions = (): IPropertyPaneDropdownOption[] => [
  { key: 'left',   text: strings.OptionAlignLeft },
  { key: 'center', text: strings.OptionAlignCenter },
  { key: 'right',  text: strings.OptionAlignRight },
];

const fontWeightOptions = (): IPropertyPaneDropdownOption[] => [
  { key: '400', text: strings.OptionWeightNormal },
  { key: '500', text: strings.OptionWeightMedium },
  { key: '600', text: strings.OptionWeightSemibold },
  { key: '700', text: strings.OptionWeightBold },
];

// ─────────────────────────────────────────────────────────────────────────────
// Web part class
// ─────────────────────────────────────────────────────────────────────────────

export default class CustomAccordionWebPart
  extends BaseClientSideWebPart<ICustomAccordionWebPartProps> {

  public render(): void {
    const p = this.properties;

    const element: React.ReactElement<ICustomAccordionProps> = React.createElement(
      CustomAccordion,
      {
        // Content
        webPartTitle:       p.webPartTitle    || '',
        showTitle:          !!p.showTitle,
        titleFontSize:      p.titleFontSize   || '16',
        titleFontWeight:    p.titleFontWeight || '600',
        titleColor:         p.titleColor      || '',
        titleAlignment:     (p.titleAlignment as ICustomAccordionProps['titleAlignment']) || 'left',
        titleSpacingBelow:  p.titleSpacingBelow || '12',
        triggerText:        p.triggerText     || '',
        bodyContent:        p.bodyContent     || '',
        defaultExpanded:    !!p.defaultExpanded,

        // Layout
        widthMode:          (p.widthMode as ICustomAccordionProps['widthMode']) || 'full',
        maxWidth:           p.maxWidth        || '800',
        widthUnit:          (p.widthUnit as ICustomAccordionProps['widthUnit']) || 'px',
        containerAlignment: (p.containerAlignment as ICustomAccordionProps['containerAlignment']) || 'left',
        marginTop:          p.marginTop       || '0',
        marginBottom:       p.marginBottom    || '0',

        // Trigger styling
        triggerFontFamily:     p.triggerFontFamily     || '',
        triggerFontSize:       p.triggerFontSize        || '15',
        triggerFontWeight:     p.triggerFontWeight      || '600',
        triggerTextColor:      p.triggerTextColor       || '#323130',
        triggerBgColor:        p.triggerBgColor         || '#f3f2f1',
        triggerBgColorOpen:    p.triggerBgColorOpen     || '',
        triggerBorderColor:    p.triggerBorderColor     || '#edebe9',
        triggerBorderColorOpen: p.triggerBorderColorOpen || '',
        triggerBorderRadius:   p.triggerBorderRadius    || '4',
        triggerPaddingV:       p.triggerPaddingV        || '12',
        triggerPaddingH:       p.triggerPaddingH        || '16',
        triggerMinHeight:      p.triggerMinHeight       || '48',
        triggerAlignment:      (p.triggerAlignment as ICustomAccordionProps['triggerAlignment']) || 'left',
        triggerWrapText:       p.triggerWrapText !== false,
        clickAreaFull:         p.clickAreaFull  !== false,

        // Body styling
        bodyFontFamily:     p.bodyFontFamily    || '',
        bodyFontSize:       p.bodyFontSize       || '14',
        bodyFontWeight:     p.bodyFontWeight     || '400',
        bodyLineHeight:     p.bodyLineHeight     || '1.6',
        bodyTextColor:      p.bodyTextColor      || '#323130',
        bodyBgColor:        p.bodyBgColor        || '#ffffff',
        bodyPaddingV:       p.bodyPaddingV       || '16',
        bodyPaddingH:       p.bodyPaddingH       || '16',
        bodyBorderColor:    p.bodyBorderColor    || '#edebe9',
        bodyBorderWidth:    p.bodyBorderWidth    || '1',
        bodyBorderRadius:   p.bodyBorderRadius   || '0',
        bodyTextAlignment:  (p.bodyTextAlignment as ICustomAccordionProps['bodyTextAlignment']) || 'left',
        bodyTopSpacing:     p.bodyTopSpacing     || '0',

        // Icon settings
        showIcon:       p.showIcon       !== false,
        iconType:       (p.iconType as ICustomAccordionProps['iconType']) || 'chevron',
        iconPlacement:  (p.iconPlacement as ICustomAccordionProps['iconPlacement']) || 'right',
        iconSize:       p.iconSize       || '16',
        iconColor:      p.iconColor      || '',
        animateIcon:    p.animateIcon    !== false,

        // Advanced
        showDivider:        p.showDivider        !== false,
        boxShadow:          !!p.boxShadow,
        transitionDuration: p.transitionDuration || '250',
        compactMode:        !!p.compactMode,

        // Runtime context
        isEditMode: this.displayMode === 2, // DisplayMode.Edit = 2
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;
    const { semanticColors } = currentTheme;
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // ── Property pane ──────────────────────────────────────────────────────────
  // Organized into two pages so the panel doesn't become overwhelming.
  // Page 1: Content, Layout, Trigger Styling, Icon Settings
  // Page 2: Body Styling, Advanced / Behavior
  // ──────────────────────────────────────────────────────────────────────────

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const p = this.properties;

    return {
      pages: [
        // ── PAGE 1 ────────────────────────────────────────────────────────
        {
          displayGroupsAsAccordion: true,
          header: { description: strings.PropertyPaneDescription },
          groups: [
            // ── A. Content ──────────────────────────────────────────────
            {
              groupName: strings.GroupContent,
              isCollapsed: false,
              groupFields: [
                PropertyPaneToggle('showTitle', {
                  label: strings.FieldShowTitle,
                  onText: 'Yes',
                  offText: 'No',
                }),
                ...(p.showTitle ? [
                  PropertyPaneTextField('webPartTitle', {
                    label: strings.FieldWebPartTitle,
                    placeholder: 'Enter a title…',
                  }),
                  PropertyPaneTextField('titleFontSize', {
                    label: strings.FieldTitleFontSize,
                    placeholder: '16',
                  }),
                  PropertyPaneDropdown('titleFontWeight', {
                    label: strings.FieldTitleFontWeight,
                    options: fontWeightOptions(),
                    selectedKey: p.titleFontWeight || '600',
                  }),
                  PropertyPaneTextField('titleColor', {
                    label: strings.FieldTitleColor,
                    placeholder: '#323130',
                  }),
                  PropertyPaneDropdown('titleAlignment', {
                    label: strings.FieldTitleAlignment,
                    options: alignmentOptions(),
                    selectedKey: p.titleAlignment || 'left',
                  }),
                  PropertyPaneTextField('titleSpacingBelow', {
                    label: strings.FieldTitleSpacingBelow,
                    placeholder: '12',
                  }),
                ] : []),

                PropertyPaneLabel('triggerTextLabel', {
                  text: '─── Accordion trigger ───',
                }),
                PropertyPaneTextField('triggerText', {
                  label: strings.FieldTriggerText,
                  placeholder: 'Full disclaimer here',
                }),
                PropertyPaneToggle('defaultExpanded', {
                  label: strings.FieldDefaultExpanded,
                  onText: 'Yes',
                  offText: 'No',
                }),

                PropertyPaneLabel('bodyContentLabel', {
                  text: '─── Expanded body content ───',
                }),
                PropertyPaneLabel('bodyContentHelp', {
                  text: 'Paste HTML below. Supports <p>, <b>, <i>, <ul>/<li>, <a>, <h2>–<h4>. ' +
                        'For a full rich text experience, use SharePoint\'s built-in Text web part ' +
                        'alongside this one.',
                }),
                PropertyPaneTextField('bodyContent', {
                  label: strings.FieldBodyContent,
                  multiline: true,
                  rows: 8,
                  placeholder: '<p>Enter your disclaimer or policy text here.</p>',
                }),
              ],
            },

            // ── B. Layout ───────────────────────────────────────────────
            {
              groupName: strings.GroupLayout,
              isCollapsed: true,
              groupFields: [
                PropertyPaneDropdown('widthMode', {
                  label: strings.FieldWidthMode,
                  options: [
                    { key: 'full',   text: strings.OptionWidthFull },
                    { key: 'custom', text: strings.OptionWidthCustom },
                  ],
                  selectedKey: p.widthMode || 'full',
                }),
                ...(p.widthMode === 'custom' ? [
                  PropertyPaneTextField('maxWidth', {
                    label: strings.FieldMaxWidth,
                    placeholder: '800',
                  }),
                  PropertyPaneDropdown('widthUnit', {
                    label: strings.FieldWidthUnit,
                    options: [
                      { key: 'px',  text: strings.OptionUnitPx },
                      { key: '%',   text: strings.OptionUnitPercent },
                      { key: 'rem', text: strings.OptionUnitRem },
                    ],
                    selectedKey: p.widthUnit || 'px',
                  }),
                  PropertyPaneDropdown('containerAlignment', {
                    label: strings.FieldContainerAlignment,
                    options: alignmentOptions(),
                    selectedKey: p.containerAlignment || 'left',
                  }),
                ] : []),
                PropertyPaneTextField('marginTop', {
                  label: strings.FieldMarginTop,
                  placeholder: '0',
                }),
                PropertyPaneTextField('marginBottom', {
                  label: strings.FieldMarginBottom,
                  placeholder: '0',
                }),
              ],
            },

            // ── C. Trigger Styling ──────────────────────────────────────
            {
              groupName: strings.GroupTriggerStyle,
              isCollapsed: true,
              groupFields: [
                PropertyPaneTextField('triggerFontFamily', {
                  label: strings.FieldTriggerFontFamily,
                  placeholder: 'Inherit from page',
                }),
                PropertyPaneTextField('triggerFontSize', {
                  label: strings.FieldTriggerFontSize,
                  placeholder: '15',
                }),
                PropertyPaneDropdown('triggerFontWeight', {
                  label: strings.FieldTriggerFontWeight,
                  options: fontWeightOptions(),
                  selectedKey: p.triggerFontWeight || '600',
                }),
                PropertyPaneTextField('triggerTextColor', {
                  label: strings.FieldTriggerTextColor,
                  placeholder: '#323130',
                }),
                PropertyPaneTextField('triggerBgColor', {
                  label: strings.FieldTriggerBgColor,
                  placeholder: '#f3f2f1',
                }),
                PropertyPaneTextField('triggerBgColorOpen', {
                  label: strings.FieldTriggerBgColorOpen,
                  placeholder: 'Same as closed',
                }),
                PropertyPaneTextField('triggerBorderColor', {
                  label: strings.FieldTriggerBorderColor,
                  placeholder: '#edebe9',
                }),
                PropertyPaneTextField('triggerBorderColorOpen', {
                  label: strings.FieldTriggerBorderColorOpen,
                  placeholder: 'Same as closed',
                }),
                PropertyPaneTextField('triggerBorderRadius', {
                  label: strings.FieldTriggerBorderRadius,
                  placeholder: '4',
                }),
                PropertyPaneTextField('triggerPaddingV', {
                  label: strings.FieldTriggerPaddingV,
                  placeholder: '12',
                }),
                PropertyPaneTextField('triggerPaddingH', {
                  label: strings.FieldTriggerPaddingH,
                  placeholder: '16',
                }),
                PropertyPaneTextField('triggerMinHeight', {
                  label: strings.FieldTriggerMinHeight,
                  placeholder: '48',
                }),
                PropertyPaneDropdown('triggerAlignment', {
                  label: strings.FieldTriggerAlignment,
                  options: alignmentOptions(),
                  selectedKey: p.triggerAlignment || 'left',
                }),
                PropertyPaneToggle('triggerWrapText', {
                  label: strings.FieldTriggerWrapText,
                  onText: 'Yes',
                  offText: 'No',
                }),
                PropertyPaneToggle('clickAreaFull', {
                  label: strings.FieldClickAreaFull,
                  onText: 'Yes',
                  offText: 'No (text/icon only)',
                }),
              ],
            },

            // ── E. Icon Settings ────────────────────────────────────────
            {
              groupName: strings.GroupIconSettings,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('showIcon', {
                  label: strings.FieldShowIcon,
                  onText: 'Yes',
                  offText: 'No',
                }),
                ...(p.showIcon !== false ? [
                  PropertyPaneDropdown('iconType', {
                    label: strings.FieldIconType,
                    options: [
                      { key: 'chevron',   text: strings.OptionIconChevron },
                      { key: 'caret',     text: strings.OptionIconCaret },
                      { key: 'plusminus', text: strings.OptionIconPlusMinus },
                      { key: 'arrow',     text: strings.OptionIconArrow },
                      { key: 'none',      text: strings.OptionIconNone },
                    ],
                    selectedKey: p.iconType || 'chevron',
                  }),
                  PropertyPaneDropdown('iconPlacement', {
                    label: strings.FieldIconPlacement,
                    options: [
                      { key: 'right',      text: strings.OptionPlacementRight },
                      { key: 'left',       text: strings.OptionPlacementLeft },
                      { key: 'beforeText', text: strings.OptionPlacementBeforeText },
                      { key: 'afterText',  text: strings.OptionPlacementAfterText },
                    ],
                    selectedKey: p.iconPlacement || 'right',
                  }),
                  PropertyPaneTextField('iconSize', {
                    label: strings.FieldIconSize,
                    placeholder: '16',
                  }),
                  PropertyPaneTextField('iconColor', {
                    label: strings.FieldIconColor,
                    placeholder: 'Inherit from trigger text',
                  }),
                  PropertyPaneToggle('animateIcon', {
                    label: strings.FieldAnimateIcon,
                    onText: 'Yes',
                    offText: 'No',
                  }),
                ] : []),
              ],
            },
          ],
        },

        // ── PAGE 2 ────────────────────────────────────────────────────────
        {
          displayGroupsAsAccordion: true,
          header: { description: 'Body styling and advanced behavior options.' },
          groups: [
            // ── D. Body Styling ─────────────────────────────────────────
            {
              groupName: strings.GroupBodyStyle,
              isCollapsed: false,
              groupFields: [
                PropertyPaneTextField('bodyFontFamily', {
                  label: strings.FieldBodyFontFamily,
                  placeholder: 'Inherit from page',
                }),
                PropertyPaneTextField('bodyFontSize', {
                  label: strings.FieldBodyFontSize,
                  placeholder: '14',
                }),
                PropertyPaneDropdown('bodyFontWeight', {
                  label: strings.FieldBodyFontWeight,
                  options: fontWeightOptions(),
                  selectedKey: p.bodyFontWeight || '400',
                }),
                PropertyPaneTextField('bodyLineHeight', {
                  label: strings.FieldBodyLineHeight,
                  placeholder: '1.6',
                }),
                PropertyPaneTextField('bodyTextColor', {
                  label: strings.FieldBodyTextColor,
                  placeholder: '#323130',
                }),
                PropertyPaneTextField('bodyBgColor', {
                  label: strings.FieldBodyBgColor,
                  placeholder: '#ffffff',
                }),
                PropertyPaneTextField('bodyPaddingV', {
                  label: strings.FieldBodyPaddingV,
                  placeholder: '16',
                }),
                PropertyPaneTextField('bodyPaddingH', {
                  label: strings.FieldBodyPaddingH,
                  placeholder: '16',
                }),
                PropertyPaneTextField('bodyTopSpacing', {
                  label: strings.FieldBodyTopSpacing,
                  placeholder: '0',
                }),
                PropertyPaneTextField('bodyBorderColor', {
                  label: strings.FieldBodyBorderColor,
                  placeholder: '#edebe9',
                }),
                PropertyPaneTextField('bodyBorderWidth', {
                  label: strings.FieldBodyBorderWidth,
                  placeholder: '1',
                }),
                PropertyPaneTextField('bodyBorderRadius', {
                  label: strings.FieldBodyBorderRadius,
                  placeholder: '0',
                }),
                PropertyPaneDropdown('bodyTextAlignment', {
                  label: strings.FieldBodyTextAlignment,
                  options: alignmentOptions(),
                  selectedKey: p.bodyTextAlignment || 'left',
                }),
              ],
            },

            // ── F. Advanced / Behavior ──────────────────────────────────
            {
              groupName: strings.GroupAdvanced,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('showDivider', {
                  label: strings.FieldShowDivider,
                  onText: 'Yes',
                  offText: 'No',
                }),
                PropertyPaneToggle('boxShadow', {
                  label: strings.FieldBoxShadow,
                  onText: 'Yes',
                  offText: 'No',
                }),
                PropertyPaneSlider('transitionDuration', {
                  label: strings.FieldTransitionDuration,
                  min: 0,
                  max: 800,
                  step: 50,
                  showValue: true,
                  // Slider values are numbers; we store as string in props.
                  // The value displayed is in ms.
                  value: parseFloat(p.transitionDuration || '250'),
                }),
                PropertyPaneToggle('compactMode', {
                  label: strings.FieldCompactMode,
                  onText: 'Yes',
                  offText: 'No',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
