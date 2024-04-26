---
published: true
title: AVIF and AV1 formats are the future of internet media assets
description: "Pioneering the Next Generation of Video and Image Formats."
date: 2024-04-28
coverImage: images/cover.avif
displayCover: true
categories:
  - Blog
tags:
  - Web
layout: blog
---
I had to write about this topic out of excitement. This example stands out as one of those rare occasions where major companies—particularly in big tech—set aside their usual focus on proprietary formats and patterns to collaborate for the greater good.

For many years, Big tech has been competing with delivering the most efficient ways to encode media files like images and videos to their property (and very costly) tech. For once, and since 2015, the non-profit consortium called [Alliance for Open Media](https://en.wikipedia.org/wiki/Alliance_for_Open_Media) formed by [Amazon](https://en.wikipedia.org/wiki/Amazon.com "Amazon.com"), [Apple](https://en.wikipedia.org/wiki/Apple_Inc. "Apple Inc."), [ARM](https://en.wikipedia.org/wiki/Arm_Holdings "Arm Holdings"), [Cisco](https://en.wikipedia.org/wiki/Cisco "Cisco"), [Facebook](https://en.wikipedia.org/wiki/Facebook "Facebook"), [Google](https://en.wikipedia.org/wiki/Google "Google"), [Huawei](https://en.wikipedia.org/wiki/Huawei "Huawei"), [Intel](https://en.wikipedia.org/wiki/Intel "Intel"), [Microsoft](https://en.wikipedia.org/wiki/Microsoft "Microsoft"), [Mozilla](https://en.wikipedia.org/wiki/Mozilla_Corporation "Mozilla Corporation"), [Netflix](https://en.wikipedia.org/wiki/Netflix "Netflix"), [Nvidia](https://en.wikipedia.org/wiki/Nvidia "Nvidia"), [Samsung Electronics](https://en.wikipedia.org/wiki/Samsung_Electronics "Samsung Electronics") and [Tencent](https://en.wikipedia.org/wiki/Tencent "Tencent"), is creating open royalty-free multimedia formats for video (AV1) and imaging (AVIF) as a successor for [VP9](https://en.wikipedia.org/wiki/VP9) (developed by only Google and not adopted widely) and [HEVC](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding) ( known as H.265, covered by patents, and using it typically requires the payment of licensing fees).

**AV1** offers significant advantages in terms of compression efficiency, which can reduce bandwidth usage by as much as 30-50% compared to H.264, and about 20% compared to VP9, without sacrificing quality. This makes it particularly appealing for streaming high-resolution video on the internet.

**AVIF**, based on the AV1 video codec, serves as a formidable challenger to well-established image formats like JPEG and PNG. It provides better compression and supports a wider color gamut, high dynamic range (HDR), and progressive rendering, which are crucial for modern web applications that demand high-quality visual experiences.

AVIF handles HRD, 10 bits color depth, transparency, and animation:
![](./images/comparison.avif)
*Courtesy of https://www.blue-dot.io/avif-speed-quality-benchmark/, check it there for more details and comparisons*

## Today's caveats due to computational demands and adoption
Today's computational costs raise concerns due to increased encoding times and demanding decoding requirements. Decoding AV1 content can heavily tax processors, particularly **when hardware acceleration is unavailable**, elevating  CPU usage which can drain batteries and degrade performance during playback.

This issue is especially pronounced in mobile devices, which have limited processing power and battery life compared to desktops. Moreover, for many companies, the financial burden of upgrading infrastructure to support new codecs like AV1 may not immediately outweigh the benefits, hindering rapid adoption and delaying the full realization of the technology's advantages.

Here is a [detailed benchmark](https://storage.googleapis.com/avif-comparison/index.html) comparison of the AVIF image format against WebP, JPEG, and JPEG XL, offering a comprehensive set of test results to evaluate image coding efficiency.


For that reason, it might be still important to offer backups to jpg and png for those devices that can't handle the decoding with hardware.
```html
<picture>
  <!-- AVIF image for browsers that support it -->
  <source srcset="image.avif" type="image/avif">
  <!-- JPEG fallback for browsers that do not support AVIF -->
  <source srcset="image.jpg" type="image/jpeg">
  <!-- Fallback image tag for older browsers that do not support the <picture> element -->
  <img src="image.jpg" alt="Descriptive text about the image">
</picture>
```
Many modules on npm can handle these code snippets very well.

## Hardware adoption and ecosystem
The integration of AV1 and AVIF across tech platforms is expanding, thanks to support from leading companies and hardware manufacturers:

| Feature                                 | Browsers                                           | Smartphone Chips                                                            | Intel processors                                     | Apple Silicone                                        | ADM                       | Nvidia                           |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- | ------------------------- | -------------------------------- |
| AV1 Video Decoding & AVIF Image Support | Chrome(125), Edge(123), Firefox(126), Safari(17.5) | Qualcomm (Snapdragon 888), Samsung Exynos (2100), MediaTek (Dimensity 1000) | 11th Gen Intel CPUs (Decoding)<br>Arc GPU (Encoding) | Apple M1/M2 chips (Decode)<br>Apple M3 chips (encode) | Radeon RX 7000 (encoding) | GeForce RTX 40 series (encoding) |


## Special tools to optimize assets
- [jampack.js](https://divriots.com/blog/introducing-jampack/)  A post-processing tool designed to optimize static websites after they are built (also image optimization using [Sharp](https://sharp.pixelplumbing.com/)), enhancing user experience and Core Web Vitals scores.
- [Squoosh](https://squoosh.app/) is an actual web application that you can use to compress, convert, and optimize images directly in your browser. It's designed to be highly accessible and user-friendly, supporting a variety of image formats including the newer AVIF format, which is known for its high compression efficiency and quality retention.
![](./images/example.avif)

As the digital world continues its relentless advance, AV1 and AVIF are emerging as the definitive formats for video and image content on the web. With their advanced compression techniques, robust feature sets, and widespread support across hardware and software, these formats are poised to revolutionize online media experiences. The ongoing adoption of AV1 and AVIF is a testament to their potential to set new standards in media consumption and creation.