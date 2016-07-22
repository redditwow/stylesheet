# /r/wow subreddit Legion theme

## Building

1. `npm install`
2. `gulp`



## Adding new demo pages

1. Download page from reddit and save into the `pages`
2. Merge downloaded files (images, css, js, etc) into the `files` directory and update references in the saved html to match. Delete anything not needed, like Google Analytics' files.
3. Include the compiled legion CSS in the saved file below reddit's stock CSS: `	<link rel="stylesheet" href="../css/main.css" type="text/css">`
4. Replace the `#header-img-a` element with `<!--%%snoo%%-->` 
5. Replace the `.md` element inside the sidebar with `<!--%%sidebar%%-->`
6. Compile with `gulp demo`. 
 
## Notes

`reguser_index_res_side_only.html` is a frankenstein mix of regular reddit and RES's sidebar tweaks! Beware!