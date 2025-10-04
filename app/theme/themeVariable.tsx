// 🎨 Colors
export const primaryColor = '#7F56D9';
export const darkColorError = '#ee6464';

export const elementProps = {
  colorPrimary: primaryColor,
  controlHeightSM: 36,
  controlHeight: 44,
  controlHeightLG: 52,
  controlOutlineWidth: 1,
  borderRadius: 8,
};

export const primaryTheme = {
  token: {
    colorPrimary: elementProps.colorPrimary, // ✅ used everywhere
    controlHeightSM: elementProps.controlHeightSM,
    controlHeight: elementProps.controlHeight,
    controlHeightLG: elementProps.controlHeightLG,
    controlOutlineWidth: elementProps.controlOutlineWidth,
    borderRadius: elementProps.borderRadius,
    colorTextHeading: 'var(--light-color-heaading)',
    colorText: 'var(--light-color-text)',
  },
  components: {
    Tag: {
      borderRadius: 20,
    },
    Title: {
      colorText: 'var(--light-title-color)',
    },
    Button: {
      fontWeight: 600,
      paddingInline: 14,
      paddingInlineSM: 12,
      paddingInlineLG: 16,
      textDecoration: 'underline',
      colorPrimary: primaryColor,        // ✅ ensures Button also respects it
      colorPrimaryHover: '#8C86B0',      // optional darker hover shade
      colorPrimaryActive: '#7C769E',     // optional pressed shade
    },
    DatePicker: {
      cellHeight: 30,
      cellWidth: 40,
    },
  },
};
