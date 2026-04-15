import { CodeTabs } from "/Volumes/MacBookStorage-Dev/dev/operations/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+no_d433e72e98db4e8d103136191d767abf/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/CodeTabs.js";
import { Tabs } from "/Volumes/MacBookStorage-Dev/dev/operations/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+no_d433e72e98db4e8d103136191d767abf/node_modules/@vuepress/plugin-markdown-tab/dist/client/components/Tabs.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
