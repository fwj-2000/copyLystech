import { generateAntColors, primaryColor } from '../config/themeConfig';
import { theme } from 'ant-design-vue';
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken';
const { defaultAlgorithm, defaultSeed } = theme;
import { resolve } from 'path';

/**
 * less global variable
 */
export function generateModifyVars() {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  const mapToken = defaultAlgorithm(defaultSeed);
  const v3Token = convertLegacyToken(mapToken);

  const hackContent = `true; 
  @primary-color: ${primary};
  @primary-1: ${palettes[0]};
  @primary-2: ${palettes[1]};
  @primary-3: ${palettes[2]};
  @primary-4: ${palettes[3]};
  @primary-5: ${palettes[4]};
  @primary-6: ${palettes[5]};
  @primary-7: ${palettes[6]};
  @primary-8: ${palettes[7]};
  @primary-9: ${palettes[8]};
  @primary-10: ${palettes[9]};
  @success-color: #55D187;
  @error-color: #ED6F6F;
  @warning-color: #EFBD47;
  @btn-info-color: #909399;
  @import (reference) "${resolve('src/design/var/index.less')}";
  `;
  return {
    ...v3Token,
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'btn-info-color': '#909399',
    'border-color-base': '#f0f0f0',
    'border-color-base1': '#f0f0f0',
    'font-size-base': '13px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
    'app-main-background': '#ebeef5',
    'selected-hover-bg': '#f5f5f5',
    'hover-background': '#f5f7fa',
    'app-tabs-background': '#FCF5ED',
    hack: hackContent,
    // hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
  };
}
