---
title: [Fixed] Webpack problem with source maps mapping in Chrome Dev Tools
image: https://cdn-images-1.medium.com/max/2000/1*Th5Zf-_ef0GUv7CpODQtFg.png
created: 2018-05-04
tags:
- Supabase
- Nuxt
---
## [Fixed] Webpack problem with sourcemaps mapping in Chrome Dev Tools

I find it essential to be able to edit the code directly from the DevTools when debugging a javascript application. When Chrome added this feature to DevTools it was mind-blowing ✋.

But suddenly, it stopped working with newer versions of chrome (after v.64) for unknown reasons to me.

![](https://cdn-images-1.medium.com/max/2000/1*Th5Zf-_ef0GUv7CpODQtFg.png)

After trying to research the whole internet and trying to understand. Finally, the definite solution was share by [RyanAtViceSoftware](https://github.com/webpack/webpack/issues/6400) in Github. Let’s get directly into the problem without losing focus on fixing the problem.

**You need to be sure you are using 2 things after adding the folder of your project to the workspace:**

* use “***module-****” in devtool option in webpack.conf.js,
  *e.g: devtool: ‘cheap-module-source-map’*

* Add “***devtoolModuleFilenameTemplate***” option to your output option in webpack.conf.js as well

For Mac machines:

    output: {
      ...
      devtoolModuleFilenameTemplate: info =>
        'file://' + path.*resolve*(info.absoluteResourcePath).replace(/\\/g, '/'),

For windows machines (three back bars — ///)

    output: {
      ...
      devtoolModuleFilenameTemplate: info =>
        'file:///' + path.*resolve*(info.absoluteResourcePath).replace(/\\/g, '/'),

After rerunning your Webpack application, the maps should be now working.

![](https://cdn-images-1.medium.com/max/2000/1*DqD4qzHtMbWXMDzQMxGCsw.png)

I hope this solved the problem for you as well 💛
