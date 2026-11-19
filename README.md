# Double Dynamics Website

This is the static website for Double Dynamics (doubledynamics.ca).

## Pages

The site lives in `docs/` (GitHub Pages). It uses the same look as Sound
(sound.doubledynamics.ca): its colours copy `web/src/styles/theme.css` in the
noise_removal repo, so change them there first and copy them here.

`privacy.html` and `terms.html` are linked from the Google sign-in consent
screen: keep their addresses.

The logo images in `docs/img/` and `docs/favicon.ico` are made from
`logo_transparent.png` in the doubledynamics/logo repo.

## Development

This is a simple static website built with plain HTML and CSS. No build tools or frameworks are required to work on this project.

### Local Development

To run the site locally, you can use any local server. For example, with Python:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Or with Node.js:

```bash
# Install http-server globally if you haven't already
npm install -g http-server

# Run the server
http-server
```

## Deployment

To deploy this site, simply upload all files to your web hosting provider.

## License

Copyright © 2026 Double Dynamics Tech Corp. All rights reserved.
