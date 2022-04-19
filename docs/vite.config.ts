/*
* @vite.config.ts.ts
* @deprecated 
* @author czh
* @update (czh 2022/4/18)
*/
import WindiCSS from 'vite-plugin-windicss'

export default {
  plugins: [
    WindiCSS(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                @import "./.vitepress/vitepress/styles/base.scss";
                @import "./.vitepress/vitepress/styles/css-vars.scss";
                  @import "./.vitepress/vitepress/styles/code.scss";
                @import "./.vitepress/vitepress/styles/mixins.scss";
                @import "./.vitepress/vitepress/styles/common.scss";
                @import "./.vitepress/vitepress/styles/content.scss";
                @import "./.vitepress/vitepress/styles/vars.scss";`, // 添加公共样式
      },
    },
  },
}