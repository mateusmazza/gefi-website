# GEFI website draft

This folder is the editable website source. The current prototype was updated October 25, 2026. The owner approved updating the existing public GitHub Pages review preview. This is a prototype for team feedback, not the final launch announcement.

## Editing wording

- `index.html`: homepage introduction, mission, vision, and links. Comments mark each section.
- Other `.html` files: wording for their named pages.
- `styles.css`: shared typography, colors, and layout for every page.
- `assets/`: homepage and member photographs, plus the local assessment-guidelines PDF.

Edit the text between HTML tags, save, and refresh the preview. A local web server can serve this folder; opening `index.html` directly in a browser also works. Google Fonts supplies Source Sans 3 and Source Serif 4 and requires an internet connection; system fonts are the fallback.

## Structure

- Home: introduction, mission, and vision.
- Resources: Instruments, Data, Publications.
- Community: Founding members, Steering committee, General membership.

The former Participate path redirects to General membership. Internal research goal numbers are omitted from public navigation and copy.

## Pending launch content

- Membership and working-group application links were supplied by the owner and added on October 25, 2026.
- Confirm and add the Steering Committee roster.
- Add dataset links when the repository becomes available.
- Add the first event announcement to Home once its details are confirmed.

The website links to the owner's Google Forms; it does not store application responses. The email-updates link points to GEFI's existing Mailman signup. The Data page explains Redivis without exposing the GSE testing organization.

## Design and content references

- https://gefi.stanford.edu/ — source of the existing homepage photograph and GEFI content.
- Stanford branding was restored on October 24, 2026 at the owner's request, based on confirmation that GEFI's existing Stanford branding is approved. The original Stanford/GEFI lockup, an identity bar, restrained cardinal accents and Stanford global footer are included. The current content, including the owner's homepage wording, was preserved.
- https://levante-network.org/ — warm coral, orange, and yellow palette; circular photography and open layouts. No LEVANTE logos, photos, or proprietary font files are included.
- https://gefi.stanford.edu/who-we-are
- https://gefi.stanford.edu/gefi-resources
- https://gefi.stanford.edu/get-involved
- https://sparklab.stanford.edu/ames
- https://docs.redivis.com/
- October 2026 v2 governance proposal in GEFI Google Drive.

## Old-site content migration

The retiring site's biographies, reading guide, complete bibliography, country studies, tool guidance, survey invitation, and signup information have been incorporated. `readings.html` is reached from Publications, and `studies.html` from Instruments. The user's homepage edits were preserved. The new site has no runtime dependency on the old GEFI hostname. The audit and pre-migration backup are saved beside this folder in `Website migration audit 2026-10-24`.

Legacy content paths have local redirect pages. Redirecting the old Stanford hostname itself requires the administrator to configure the old host; these local pages do not do that.

## Community map

`community.html` includes an interactive map of 21 founding members at 16 approximate institutional bases in seven countries. Each founding member has an individual pin. Pin tips remain directly on their institutional coordinates, with no offsets or connecting lines. Overlapping members at the same institution can be selected by name in the on-map popup. Selecting a pin opens a photo, name, institution and founding-member tag directly on the map, with a link to the full biography. The location menu zooms to a city. Drag to pan, use the wheel or double-click to zoom, or pinch and drag on touchscreens. Zoom buttons, arrow-key panning, keyboard activation and a city selector are also supported. The opening view trims unused polar space; phones start with the largest concentration in the Americas, and the All locations menu fits the full community. The map requires no external map service, API key or third-party tile requests.

Public data is in `assets/community-members.json` and embedded in `community.html`, so the page also works when opened directly as a local file. Keep those two copies synchronized when editing. See `assets/MAP-SOURCES.md` for provenance and institutional-base assumptions. General membership applications are private and are not automatically copied into the map; future public entries require an explicit Yes to the map-consent question.

## Application forms

The owner confirmed the forms were ready on October 25, 2026 and provided these responder links:

- General membership: https://forms.gle/shUhnHhe5USWG9UK7
- Working-group proposals: https://forms.gle/CVE3yBXiqGEuLJBJ7

Both are linked on `membership.html`. No form questions, response records or sharing settings are changed by the website. The earlier Apps Script setup instructions are superseded by the owner's manual form preparation.

## Review the prototype

Open https://mateusmazza.github.io/gefi-website/ in a browser. No download, account or setup is needed. The repository and preview are public.

Download the repository ZIP from GitHub (**Code → Download ZIP**), extract it, and open `index.html` in your browser. Navigation, member photos and the community map work locally. Google Fonts and the external Google Form links need internet access.

For a local server, run `python3 -m http.server 8767` from this folder and open http://localhost:8767/ . This is optional; opening `index.html` directly also works.

The owner approved this public review preview on October 25, 2026. All prototype HTML pages request `noindex, nofollow` from search engines. This is a search-indexing request, not access control: anyone can view or share the URL. Before the final launch, remove these robots meta tags if the production site should be indexed. No application responses, contact exports or authentication credentials belong in this repository.

For team feedback, use repository issues to record the page, requested change and its importance for launch. Suggested review priorities are the homepage mission; names and affiliations; resource accuracy and old-site coverage; application links; mobile navigation; and the community map. Do not submit real membership applications solely to leave website feedback.
