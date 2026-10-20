// Sample data only. No backend.
window.DATA = {
  user: { name: 'Arvind R.', co: 'The Sleep Company · Call Centre' },
  kpis: [['76', 'QA score', '+2'], ['4m 12s', 'Avg handle time', '-8s'], ['34%', 'Conversion', '+3'], ['2', 'In queue', '']],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  calls7: [12, 14, 11, 15, 13, 9, 14],
  conv7: [31, 30, 33, 32, 35, 34, 38],
  earn: { month: 5200, target: 8000, planned: 1750 },
  progress: { leads: 3, closed: 2 },
  waiting: [['Priya Iyer', 'Ortho GRID, wants EMI', '4m'], ['Suresh Nair', 'Pillow upgrade enquiry', '1m']],
  planned: [
    ['Mukunda R.', 'Interested: Ortho GRID', 92, 49400, 'Asked about EMI. Competitor quote pending.'],
    ['Ritu S.', 'Interested: Smart Luxe Mattress', 88, 31200, 'Visited store twice. Wants a trial.'],
    ['Priya Iyer', 'Follow-up: Recliner', 81, 27800, 'Waiting on delivery dates.'],
    ['Suresh Nair', 'Interested: Pillows', 74, 6400, 'Cross-sell with mattress.'],
    ['Faizan A.', 'Quote sent: Bed frame', 70, 18900, 'Quote expires Friday.'],
    ['Kavitha R.', 'Interested: Ortho GRID', 66, 21500, 'Compared with Duroflex.'],
    ['Divya P.', 'Walk-in: Mattress', 58, 12900, 'No follow-up so far.']
  ],
  incoming: [
    ['Faizan A.', 'Missed today 10:05 AM · Vol: 1m 09s', 29900],
    ['Kavitha R.', 'Missed today 9:44 AM · Silent line', 24400],
    ['Divya P.', 'Missed yesterday 5:25 PM · Chat note', 18900],
    ['Ritu S.', 'Missed today 12:20 AM · Voicemail', 12900],
    ['Unknown', 'Missed yesterday · No prior record', 0]
  ],
  recent: [
    ['Mukunda R.', 'Outgoing', '10:02 AM', '1m 24s'],
    ['Kavitha R.', 'Incoming', 'Yesterday 4:40 PM', '3m 02s'],
    ['Unknown', 'Incoming', 'Yesterday 2:10 PM', '0m 20s'],
    ['Ritu S.', 'Outgoing', 'Today 11:30 AM', '2m 11s'],
    ['Faizan A.', 'Missed', 'Today 9:05 AM', '-'],
    ['Divya P.', 'Outgoing', 'Yesterday 1:12 PM', '4m 50s']
  ],
  leads: [
    { n: 'Mukunda', i: 'Ortho GRID', v: 49400, icp: 87, intent: 91, q: 'Quote to be given to customer', left: '3h left',
      sig: [['Financing related', 'Asked specifically about EMI options on the Ortho GRID. Budget is a live concern.'],
            ['Quotation demanded', 'Comparing pricing with a competitor before reaching out. Expects a competitive number.'],
            ['Warranty related', 'Has not raised this yet. Worth mentioning the 100-night trial.']] },
    { n: 'Ritu S.', i: 'Smart Luxe', v: 31200, icp: 78, intent: 80, q: 'Book a store trial', left: '1d left',
      sig: [['Trial interest', 'Lay on the mattress for 15 minutes in store.'], ['Delivery', 'Needs delivery before the 30th.']] }
  ],
  events: ['2026-10-09', '2026-10-20', '2026-10-26', '2026-10-28', '2026-11-03'],
  agents: [['callcentre-agent', 'Call Centre Agent'], ['sop-agent', 'Your SOP adherence'], ['lead-conversion-agent', 'Lead conversion'], ['capture-agent', 'Lead capture']],
  msgs: [
    ['Sunita Rao', '2:08pm', 'STAKEHOLDERS: @You (Arvind R.), whole call centre shift'],
    ['Sunita Rao', '2:09pm', 'ISSUE DEFINITION: Greeting-in-first-10s QA score is at 71% this week, below our 85% target.'],
    ['Sunita Rao', '2:09pm', 'SUGGESTED RESOLUTION: Let\u2019s push that up. Open every call with the greeting script. I\u2019ll check back Friday.'],
    ['You', '2:13pm', 'On it! Will make sure I open every call with the greeting script.']
  ]
};
