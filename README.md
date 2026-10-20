# On-Ground.ai Call Centre App

## Run
Open `index.html` in Chrome, or serve the folder (`npx serve .`). The mic needs HTTPS or localhost for calling,
so use a deployed link (Netlify, Vercel, GitHub Pages) when testing calls across two devices.

## Stack and why
Plain HTML, CSS and JavaScript with no build step. The app is small, so there is no framework overhead and it runs from a double-click.
Data lives in `data.js` (sample data only, no backend). State is one object and one `render()` function.

## Calling (how it works)
- **Human to human:** WebRTC audio through PeerJS. Each browser gets a peer ID (shown in the call panel, bottom right).
  Paste another person's ID and press "Call person". PeerJS cloud handles signalling, audio then flows peer to peer. Test with two tabs or two phones.
- **AI to human:** a scripted AI customer. It speaks using the browser SpeechSynthesis API, listens using SpeechRecognition (Chrome),
  and replies by intent (price, EMI, warranty, trial). You can also type replies. Used by "Call back", "Call now" and "Practise a call".
- **Phone call:** a `tel:` link. Swapping the scripted AI for an LLM or Twilio voice needs a server to hold keys, so it is out of scope here.

## Done
App shell, Dashboard (KPIs, progress, waiting, earnings, tasks, two 7-day charts), Plan (Calls to make with paging and expandable rows, Incoming, Recent with review),
Calendar (month switcher, Today, event dots), Pulse home, channel chat, Leads modal with paging and collapsible signals, send a message,
"Needs your input" card, Practise a call and Call back, phone-width layout.

## Skipped
Charts are CSS bars (no library). No DEMO strip. Pulse agents and Kudos are display only. Reviewing a recent call shows a stub summary.

## AI tools used
Claude (Anthropic) generated the first draft of the code. I reviewed it and can explain every part.
## Author

**Developer:** Spoorthi K. Poojary

## Live Demo

Add your GitHub Pages URL here after deployment is successful.

## Limitations

- The application uses sample data and does not have a backend.
- Human-to-human audio calling uses PeerJS and WebRTC; connectivity may depend on browser permissions and network conditions.
- The AI customer is scripted and uses browser speech features. It is not a real LLM-powered voice agent.
- Phone calls use a `tel:` link and depend on device support.
- Microphone features require a supported browser and a secure context, such as HTTPS or localhost.