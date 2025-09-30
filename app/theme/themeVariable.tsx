export const primaryColor = '#17BEE0';
export const darkColorError = '#ee6464';
export const elementProps = {
  colorPrimary: primaryColor,
  controlHeightSM: 36,
  controlHeight: 40,
  controlHeightLG: 44,
  controlOutlineWidth: 1,
  borderRadius: 8,
}

export const primaryTheme = {
  token: {
    colorPrimary: elementProps.colorPrimary,
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
    },
    DatePicker: {
      cellHeight: 30,
      cellWidth: 40,
    }
  },
};