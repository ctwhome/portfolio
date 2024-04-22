// // console.log('🎹 post', posts[$page.params.slug]);
// export const content = Object.entries(import.meta.glob('/content/**/*.md', { eager: true }));


export const content = import.meta.glob('$content/**/*.md', { eager: true })
// .map(async ([path, module]) => {
//   try {
//     const content = await module();
//     return { path, content };
//   } catch (error) {
//     console.error(`Error loading file at path: ${path}`, error);
//     return null;
//   }
// })
// .filter(Boolean);
