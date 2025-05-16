import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import { RenderPlugin } from "@11ty/eleventy";

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
  //Define options for markdown-it
  let options = {
		html: true,
		breaks: true,
		linkify: true,
	};
  //Add markdown-it as a library
  eleventyConfig.setLibrary("md", markdownIt(options));

//Add eleventy-image plugin
 eleventyConfig.addPlugin(eleventyImageTransformPlugin);
 eleventyConfig.addPlugin(RenderPlugin);

 //PostCSS processor
  const processor = postcss([
    //compile tailwind
    tailwindcss(),

    //minify tailwind css
    cssnano({
      preset: 'default',
    }),

    
    
  ]);

  //Copy background images to the dist folder
  eleventyConfig.addPassthroughCopy("./src/assets/images/backgrounds");
  eleventyConfig.addPassthroughCopy({"./src/assets/favicons": "/" });
  
  //Set input and output directories
  return {
    dir: { input: 'src', output: 'dist' },
  };
}
