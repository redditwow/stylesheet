# /r/wow subreddit Legion theme

## Building

1. `npm install`
2. Copy `example_config.json` to `config.json` and optionally enable automatic deployments to stage
2. `gulp styles` to compile for the very first time
3. `gulp` to watch for changes

## Adding new demo pages

1. Download page from reddit and save into the `pages`
2. Merge downloaded files (images, css, js, etc) into the `files` directory and update references in the saved html to match. Delete anything not needed, like Google Analytics' files.
3. Include the compiled legion CSS in the saved file below reddit's stock CSS: `<link rel="stylesheet" href="../css/dev.css" type="text/css">`
4. Replace the `#header-img-a` element with `<!--%%snoo%%-->` 
5. Replace the `.md` element inside the sidebar with `<!--%%sidebar%%-->`
6. Compile with `gulp demo`. 

## Installation

1. Upload all the images in the `images` directory
    * The following images need to be renamed in the uploader:
        * repeat-bg.jpg to repeat-bg-v2
        * repeat-bg-dark.jpg to repeat-bg-dark-v2
    * The rest of the images can be uploaded as is.
    
2. Upload all the spritesheet images
    * The following images need to be renamed in the uploader:
        * flair-user.png to flair-user-v6
        * flair-link.png to flair-user-v2
        * spritesheet.png to spritesheet-v7
    * The rest of the images can be uploaded as is.

3. Copy and paste all of `css/prod.css` into your subreddit's CSS setting
4. That should be it!

## Automatic Deployments to Stage

When the stylesheet is compiled, gulp can optionally upload the CSS to a staging subreddit. Note this does not (yet) handle image uploads, nor does it handle errors (e.g. missing images or CSS rules that reddit doesn't accept). To enable this:
 
1. Create a [script app](https://www.reddit.com/prefs/apps/) on the reddit account you want to use to deploy code with. The name, description and URLs don't matter. Set them to anything you want.
2. Set `automaticStagingDeployment` to `true` in `config.json` and fill out the other config options with the client ID and secret, and your account and password. They should be fairly self explanatory. 
3. Enjoy automatic deployments!
 
## Notes and Helpful Information

`reguser_index_res_side_only.html` is a frankenstein mix of regular reddit and RES's sidebar tweaks! Beware!

The demo pages tend to be time capsules of reddit that get outdated fairly quickly. Feel free to update them, or create a live test subreddit and upload for a better demo experience. 

## Thanks

![BrowserStack](https://i.redd.it/vbwmjeq64d0y.png)   
Special thanks to [BrowserStack](https://www.browserstack.com/) for providing us with a free account for testing.
