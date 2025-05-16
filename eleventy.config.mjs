import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  //compile tailwind before eleventy processes the files
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./src/assets/styles/tailwind.css');

    const tailwindOutputPath = './dist/assets/styles/tailwind.css';

    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

 eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),

    
    
  ]);

  eleventyConfig.addPassthroughCopy("./src/assets/images/backgrounds");
  return {
    dir: { input: 'src', output: 'dist' },
  };
}
