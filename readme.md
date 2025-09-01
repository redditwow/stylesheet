# /r/wow subreddit theme

## Building

1. `npm install`
2. Copy `example_config.json` to `config.json` and optionally enable automatic deployments to staging
3. `gulp styles` to compile for the first time. Use `gulp` to compile and watch for changes or `gulp watch` to just watch.
4. `gulp webp` to convert spritesheets to webp format.
5. `gulp` to watch for changes

## Installation

1. Upload all the images in the `images` directory
2. Upload all the spritesheet images
    * These files require manually adding a version number on the end to bust reddit's cache. The version number is manually set in the gulp file for each individual file.
3. Copy and paste all of `css/prod.css` into your subreddit's CSS setting
4. In your subreddit settings: upload `spritesheet_images/snoo/x-snoo.png` as the header image
5. In the flair settings, set user and link flair to display on the left

## Automatic Deployments to Staging

When the stylesheet is compiled, gulp can optionally upload the CSS to a staging subreddit. Note this does not (yet) handle image uploads, nor does it handle errors (e.g. missing images or CSS rules that reddit doesn't accept). To enable this:
 
1. Create a [script app](https://www.reddit.com/prefs/apps/) on the reddit account you want to use to deploy code with. The name, description and URLs don't matter. Set them to anything you want.
2. Set `automaticStagingDeployment` to `true` in `config.json` and fill out the other config options with the client ID and secret, and your account and password.
3. Enjoy automatic deployments.

# Notes

## Midnight (12.0) Changelog
Updated:
* Archived some images and css that's no longer in use 
* Updated WoW logo
* Updated hero image and banner, including old Reddit, new Reddit/Mobile versions
* Updated backgrounds using Blizz assets for Midnight (darker look + stars)

To-Do:
* Update spritesheet for new r/wow mods
* Update snoo for Midnight (still using TWW Xal'atath)

## Images and Sprites

Most individual sprite images are Fireworks PNGs. This includes: 
   * The Snoo and logo, where the glow effect is a filter; 
   * The sidebar images with a hover effect, where the inner glow is also a filter;
   * The RES markdown editor toolbar buttons, where the glyphs are fonts and can be rescaled easy to support multiple DPIs;

## Sprites 

| Directory                	   | Uses                                                                                                  	 | Compiled Filename   |
|----------------------------|-----------------------------------------------------------------------------------------------------------|---------------------|
| `flair_user`          	 | flair for classes,  faction, BfA covenants, rainbow flag faction icons                                	 | `f`                 |
| `flair_user_beskpoke` 	 | flairs for mods, fansites, guilds, VIPs, events                                                       	 | `fb`                |
| `kitchen_sink`        	 | expandos, game icons, thread flair images, voting arrows, RES buttons, sidebar assets, etc            	 | `sr`                |
| `logo`                	 | WoW logo, including a onHover highlighted version                                                       	 | `spritesheet-logo`	 |
| `snoo`                	 | WoW-themed Snoo                                                                                      	 | `spritesheet-snoo`	 |

## Images

| Image          	   | Purpose                                          	 | HDPI? 	 |
|--------------------|----------------------------------------------------|---------|
| `2m-subs`        	 | 2 Million Sub Special Image                      	 | Yes   	 |
| `bg-repeat`      	 | Repeating background texture                     	 | No    	 |
| `bg-repeat-dark` 	 | Darker variant, used in the footer               	 | No    	 |
| `c1`             	 | Featured creator slot 1                          	 | Yes   	 |
| `c2`             	 | Featured creator slot 2                          	 | Yes   	 |
| `c3`             	 | Featured creator slot 3                          	 | Yes   	 |
| `c4`             	 | Featured creator slot 4                          	 | Yes   	 |
| `hero-*`         	 | Variant hero images for events                   	 | Yes   	 |
| `partyparrot`    	 | Silly internet meme                              	 | No    	 |
| `sl-map`         	 | Launch times for Shadowlands used in the sidebar 	 | Yes   	 |
| `x-vusys`        	 | VIP user flair                                   	 | Yes   	 |


# Thanks

![BrowserStack](/.github/browserstack.png)   
Special thanks to [BrowserStack](https://www.browserstack.com/) for providing us with a free account for testing.
