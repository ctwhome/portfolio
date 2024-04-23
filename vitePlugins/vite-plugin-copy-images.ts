// TODO WIP - possible vite plugin to copy images to static folder
import { Plugin } from 'vite';
import fs from 'fs-extra'; // More powerful file system methods
import path from 'path';
import { glob } from 'glob'; // For using glob patterns

function copyImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-copy-images',
    // apply: 'build', // This plugin will run only during build
    // Apply the plugin in both 'build' and 'serve' modes
    apply(config, { command }) {
      // Apply the plugin in both 'build' and 'serve' modes
      return command === 'build' || command === 'serve';
    },
    buildStart() {
      const sourceDir = path.resolve(__dirname, './src'); // Adjust './src/folder' as needed
      const destinationDir = path.resolve(__dirname, './static/images');

      // Use glob to find all images
      glob(sourceDir + '/**/*.+(jpeg|jpg|png|gif|svg|avif)', (err, files) => {
        if (err) {
          console.error('Error finding image files:', err);
          return;
        }

        files.forEach((file) => {
          const destPath = path.resolve(destinationDir, path.relative(sourceDir, file));
          fs.copy(file, destPath)
            .then(() => console.log(`Copied ${file} to ${destPath}`))
            .catch(err => console.error('Error copying file:', err));
        });
      });
    },
  };
}

export default copyImagesPlugin;
