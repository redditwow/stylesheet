# /r/wow subreddit Legion theme

## Building

1. `npm install`
3. `gulp`

## Adding new demo pages

1. Download page from reddit
2. Merge downloaded files (images, css, js, etc) into the `files` directory and update references in the saved html to match. Delete anything not needed, like Google Analytics' files.
3. Include the compiled legion CSS in the saved file below reddit's stock CSS: `	<link rel="stylesheet" href="../css/main.css" type="text/css">`
4. Update the logo HTML to use the Legion Snoo:
```
<a title="Spooky Undead Axe Maniac Crotch" href="https://www.reddit.com/" id="header-img-a">
    <img id='header-img' src="../placeholder_snoo.fw.png" width='60' height='103' alt="wow"/>
</a>
```
