# /r/wow subreddit theme

## Building

1. `npm install`
2. Copy `example_config.json` to `config.json` and optionally enable automatic deployments to stage
3. `gulp styles` to compile for the first time. Use `gulp` to compile and watch for changes or `gulp watch` to just watch.
4. `gulp images` to crush the spritesheet images down to a more manageable filesize. The generated spritesheets are massively bloated and this step reduces them by about 70%.
    * This requires you to have `libjpeg` and `libpng` installed on your machine
5. `gulp` to watch for changes

## Installation

1. Upload all the images in the `images` directory
2. Upload all the spritesheet images
    * These files require manually adding a version number on the end to bust reddit's cache. The version number is manually set in the gulp file for each individual file.
3. Copy and paste all of `css/prod.css` into your subreddit's CSS setting
4. In your subreddit settings: upload `spritesheet_images/snoo/x-snoo.png` as the header image
5. In the flair settings, set user and link flair to display on the left
6. That should be it!

## Automatic Deployments to Stage

When the stylesheet is compiled, gulp can optionally upload the CSS to a staging subreddit. Note this does not (yet) handle image uploads, nor does it handle errors (e.g. missing images or CSS rules that reddit doesn't accept). To enable this:
 
1. Create a [script app](https://www.reddit.com/prefs/apps/) on the reddit account you want to use to deploy code with. The name, description and URLs don't matter. Set them to anything you want.
2. Set `automaticStagingDeployment` to `true` in `config.json` and fill out the other config options with the client ID and secret, and your account and password. They should be fairly self explanatory. 
3. Enjoy automatic deployments!

# Notes

## Images and Sprites

Most individual sprite images are Fireworks PNGs. This includes: 
   * The Snoo and logo, where the glow effect is a filter; 
   * The sidebar images with a hover effect, where the inner glow is also a filter;
   * The RES markdown editor toolbar buttons, where the glyphs are fonts and can be rescaled fairly easy to support multiple DPIs;
   
If you are editing these images, it would be nice to keep them as Fireworks PNGs.   

There are two gulp tasks for compressing images. All images except for the Snoo goes through the lossy [pngquant](https://pngquant.org/) to reduce the file size. Unfortunately this is too lossy for our Snoo which has noticeable dithering when compressed. It gets its own task which disables the lossy compression. 
   
The spritesheet is split into separate sprites for the Snoo, logo, user flair, bespoke user flair, and everything else. Snoo gets its own file because it requires lossless compression. The logo because it's so large (as in file size). The user flair is split because it's easier to maintain as the generic flair so rarely changes while the bespoke changes more often.

## Featured Artist Sizes

* 2x: 640x400
* 1x: 320x200

# Thanks

![BrowserStack](https://i.redd.it/vbwmjeq64d0y.png)   
Special thanks to [BrowserStack](https://www.browserstack.com/) for providing us with a free account for testing.
