import { GitContributors } from "/Volumes/MacBookStorage-Dev/dev/operations/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+node@24.12._8c8ccf83015fe7741deeb80ea93b139f/node_modules/@vuepress/plugin-git/dist/client/components/GitContributors.js";
import { GitChangelog } from "/Volumes/MacBookStorage-Dev/dev/operations/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-rc.128_@vuepress+bundler-vite@2.0.0-rc.28_@types+node@24.12._8c8ccf83015fe7741deeb80ea93b139f/node_modules/@vuepress/plugin-git/dist/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
