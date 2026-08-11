#!/usr/bin/env python3
"""Regenerates downloads/GTA6_Survival_Guide.pdf.

Rewritten 2026-08-11 per the external site audit: the previous version
recommended building tolerance to energy drinks, keeping aspirin on hand,
and framed an 86-hour session and "not stopping now" at 24+ hours as
aspirational. Content below keeps Brew's voice but drops anything that
reads as medical or safety advice.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT

AMBER = HexColor('#FF6B2C')
BONE = HexColor('#211A16')
SMOKE = HexColor('#6B5F52')
EDGE = HexColor('#F0E6DA')
GREEN = HexColor('#00C875')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle('GuideTitle', fontName='Helvetica-Bold', fontSize=26, textColor=BONE, leading=30, spaceAfter=6))
styles.add(ParagraphStyle('GuideSub', fontName='Helvetica', fontSize=11, textColor=SMOKE, leading=15, spaceAfter=10))
styles.add(ParagraphStyle('SectionLabel', fontName='Helvetica-Bold', fontSize=9, textColor=AMBER, spaceBefore=18, spaceAfter=4))
styles.add(ParagraphStyle('SectionTitle', fontName='Helvetica-Bold', fontSize=16, textColor=BONE, spaceAfter=8))
styles.add(ParagraphStyle('Body', fontName='Helvetica', fontSize=10, textColor=BONE, leading=14, spaceAfter=8))
styles.add(ParagraphStyle('BulletHead', fontName='Helvetica-Bold', fontSize=10.5, textColor=BONE, spaceBefore=6, spaceAfter=2))
styles.add(ParagraphStyle('BulletBody', fontName='Helvetica', fontSize=9.5, textColor=SMOKE, leading=13, spaceAfter=6, leftIndent=14))
styles.add(ParagraphStyle('CalloutLabel', fontName='Helvetica-Bold', fontSize=9, textColor=AMBER, spaceAfter=4))
styles.add(ParagraphStyle('CalloutBody', fontName='Helvetica', fontSize=9.5, textColor=BONE, leading=13))
styles.add(ParagraphStyle('SafetyLabel', fontName='Helvetica-Bold', fontSize=9, textColor=GREEN, spaceAfter=4))
styles.add(ParagraphStyle('Footer', fontName='Helvetica', fontSize=8, textColor=SMOKE))

def bullet(head, body):
    return [Paragraph('&#9642; ' + head, styles['BulletHead']), Paragraph(body, styles['BulletBody'])]

def callout(label, body, kind='amber'):
    style = styles['SafetyLabel'] if kind == 'green' else styles['CalloutLabel']
    border = GREEN if kind == 'green' else AMBER
    t = Table([[Paragraph(label, style)], [Paragraph(body, styles['CalloutBody'])]], colWidths=[6.4 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), EDGE),
        ('BOX', (0, 0), (-1, -1), 0, border),
        ('LINEBEFORE', (0, 0), (0, -1), 3, border),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
    ]))
    return t

def section_label(n, title):
    return Paragraph(f'SECTION {n:02d} — {title}', styles['SectionLabel'])

def footer(n):
    return Paragraph(f'Page {n} | 56ViceLane.com | Free Download', styles['Footer'])

doc = SimpleDocTemplate('/home/user/56vicelane/downloads/GTA6_Survival_Guide.pdf', pagesize=letter,
                         topMargin=0.6 * inch, bottomMargin=0.6 * inch, leftMargin=0.7 * inch, rightMargin=0.7 * inch)
story = []

# Page 1 — Cover
story.append(Paragraph('56VICELANE.COM — FORGED OAK STUDIOS — FREE DOWNLOAD', styles['Footer']))
story.append(Spacer(1, 40))
story.append(Paragraph('FREE GUIDE — 56VICELANE.COM', styles['SectionLabel']))
story.append(Paragraph('GTA 6 LAUNCH DAY', styles['GuideTitle']))
story.append(Paragraph('SURVIVAL GUIDE', styles['GuideTitle']))
story.append(Spacer(1, 10))
story.append(Paragraph('Everything you need to do launch night right — food, gear, time off, finance prep, and a healthy minute-by-minute timeline.', styles['GuideSub']))
story.append(Spacer(1, 20))
story.append(Paragraph('By Brew — Founder, 56ViceLane.com | Former Pro Competitive Gamer | Active Delivery Driver', styles['Body']))
story.append(Paragraph('PS5 &amp; Xbox Series X | Release: November 19 | 13 Years in the Making', styles['Body']))
story.append(Spacer(1, 24))
story.append(Paragraph('FROM THE FOUNDER', styles['SectionLabel']))
story.append(Paragraph('A Word From Brew', styles['SectionTitle']))
story.append(Paragraph(
    "I've been on both sides of a major game launch. As a competitive gamer who spent years playing at the "
    "highest level, I know what it takes to set up for a serious session. I've also driven delivery on big "
    "nights — and I can tell you firsthand that GTA 6 launch night is going to break DoorDash. This guide "
    "exists so you don't get caught unprepared, and so you actually feel good on launch night instead of "
    "wrecked by hour 10. GTA 6 is the biggest launch most of us will ever see. Thirteen years of waiting. Do "
    "it right — and do it in a way you can actually enjoy.", styles['Body']))
story.append(Spacer(1, 200))
story.append(footer(1))
story.append(Spacer(1, 1))
from reportlab.platypus import PageBreak
story.append(PageBreak())

# Page 2 — Money + Time Off
story.append(section_label(1, 'MONEY'))
story.append(Paragraph('Pre-Launch Finance Prep', styles['SectionTitle']))
story.append(Paragraph(
    "Budget a minimum of an extra $100–$200 for launch week. The easiest way to do this without feeling it: "
    "start putting $5–$10 extra per week in an envelope right now. By launch day you'll have it ready without "
    "stress.", styles['Body']))
for head, body in [
    ('Pay bills ahead of launch week', 'Rent, utilities, insurance — clear the slate. You don’t want a financial interruption on launch night.'),
    ('Budget for days off work', 'If you’re requesting time off or gig apps like DoorDash, account for that lost income now. Plan it, don’t wing it.'),
    ('Pre-order the game now', 'Don’t be scrambling on launch day. Pre-order and pre-load. You want to be playing when your friends start, not downloading.'),
    ('Stock groceries 2 days before', 'Don’t be running to the store on launch day. Have everything in the house already.'),
    ('Tip your delivery driver', 'DoorDash and every delivery service will be slammed. Be generous — those drivers are working hard that night.'),
]:
    story.extend(bullet(head, body))

story.append(section_label(2, 'TIME OFF'))
story.append(Paragraph('Request Your Day Off Now', styles['SectionTitle']))
story.append(Paragraph(
    "When I was competing at the top level, my bosses knew that certain game launches required advance "
    "notice. I gave 4 to 6 weeks notice every time. They respected it because I respected them enough to plan "
    "ahead. GTA 6 launch night is your Super Bowl. Treat it like one.", styles['Body']))
story.append(callout('DAY OFF REQUEST TEMPLATE',
    "Subject: Personal Day Request — [Launch Date]<br/><br/>"
    "Body: Hi [Manager Name],<br/>"
    "I would like to request a personal day on [Date]. I have planned this in advance and all responsibilities "
    "will be covered and caught up prior to my absence.<br/><br/>"
    "Thank you for the consideration.<br/>[Your Name]"))
story.append(Paragraph(
    "<b>Pro tip:</b> Request TWO days — launch night and the recovery day after. A late night deserves a real "
    "recovery day, not a groggy commute.", styles['Body']))
story.append(Paragraph('<b>Notice:</b> Give 4–6 weeks minimum. The earlier the better.', styles['Body']))
story.append(Paragraph('SECTION 03 — GEAR', styles['SectionLabel']))
story.append(Spacer(1, 40))
story.append(footer(2))
story.append(PageBreak())

# Page 3 — Gear
story.append(Paragraph('The Launch Night Gear Checklist', styles['SectionTitle']))
story.append(Paragraph('From someone who has run multi-day gaming sessions with a full crew. This is the real list.', styles['Body']))
for head, body in [
    ('TV — Go Big', 'GTA 6 is designed to be breathtaking. Minimum 41". Darken the room. Close the curtains. This is a cinematic experience — treat it like one.'),
    ('Headset or Surround Sound', 'If you have a surround sound setup, use it. 7.1 surround will make Vice City feel real. Headset works great for late nights.'),
    ('New Cables', 'If any of your cables have been acting up, replace them before launch. Not during.'),
    ('Extra Controllers + Batteries', 'Dead controller as the game launches is a rite of passage nobody wants. Charge everything. Have backup batteries or a charging dock.'),
    ('Comfortable Chair', 'You will be in it for a while. Your back will thank you.'),
    ('Side Table + Coasters', 'Keep your space clean. Spilled drinks on equipment kill setups. (If married, coasters. Trust me.)'),
    ('A Fan', 'Rooms heat up during long sessions. Airflow matters more than people think.'),
    ('Do Not Disturb on Your Phone', 'Turn it on before midnight. Nothing breaks immersion like a notification flood.'),
    ('Ethernet Cable', 'If you are serious about online play or streaming, hardwire it. A laggy router on launch night with millions online will ruin your experience.'),
]:
    story.extend(bullet(head, body))
story.append(Spacer(1, 10))
story.append(footer(3))
story.append(PageBreak())

# Page 4 — Food & Drinks
story.append(section_label(4, 'FOOD & DRINKS'))
story.append(Paragraph('Feed the Session Right', styles['SectionTitle']))
story.append(Paragraph(
    "I've hosted gaming marathons for a full crew before — pizza runs, big-batch meals, the works. Here's what "
    "actually works for a solo or small group launch night.", styles['Body']))

food_drink_table = Table([
    [Paragraph('FOOD', styles['CalloutLabel']), Paragraph('DRINKS', styles['CalloutLabel'])],
    [Paragraph(
        '&#9642; Pizza — order by 9 PM, not midnight<br/>'
        '&#9642; Finger foods only (no greasy keyboards)<br/>'
        '&#9642; Chips, jerky, snack mix<br/>'
        '&#9642; Honey buns / snack cakes for breakfast<br/>'
        '&#9642; Something substantial at hour 12<br/>'
        '&#9642; Chili in a crockpot if cooking ahead<br/>'
        '&#9642; Lasagna or big batch meal for groups', styles['BulletBody']),
     Paragraph(
        '&#9642; Water — make it the base of the night<br/>'
        '&#9642; Sweet and unsweet tea (gallon jugs)<br/>'
        '&#9642; OJ and apple juice for morning<br/>'
        '&#9642; Sprite / Root Beer to wind down caffeine<br/>'
        '&#9642; Coffee percolator for the long haul, in moderation<br/>'
        '&#9642; Milk for the middle-of-night cereal emergency<br/>'
        '&#9642; Soda/energy drinks fine — see note below', styles['BulletBody'])],
], colWidths=[3.2 * inch, 3.2 * inch])
food_drink_table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
story.append(food_drink_table)
story.append(Spacer(1, 10))
story.append(callout('CAFFEINE & ENERGY DRINKS — KEEP IT SANE',
    "Track your total caffeine for the night the way you'd track anything else — don't just keep drinking because "
    "you're still awake. Caffeine sensitivity varies a lot person to person, so know your own limit rather than "
    "matching anyone else's pace. Water first, caffeine second. And if you take any medication, that's a "
    "conversation with your doctor or pharmacist, not something a guide like this should tell you — we're not "
    "going to recommend anything here.", kind='green'))
story.append(Spacer(1, 6))
story.append(footer(4))
story.append(PageBreak())

# Page 5 — The Long Haul (rewritten for safety)
story.append(section_label(5, 'THE LONG HAUL'))
story.append(Paragraph('Pacing Yourself — Hour by Hour', styles['SectionTitle']))
story.append(Paragraph(
    "Long sessions are part of the fun of a launch like this — but the best sessions are the ones you actually "
    "remember and feel fine after. Here's how to pace it so you're still sharp deep into the night, not just "
    "gutting it out.", styles['Body']))
for head, body in [
    ('Every hour', 'Take a five-minute movement break — stand up, stretch, walk around. It sounds small. It’s the single biggest thing that keeps you feeling good hour after hour.'),
    ('Hour 6', 'Full body stretch, refill your water, and eat something real — not just snacks.'),
    ('Hour 12', 'Time for a proper break: shower, real food, and a longer walk if you can. Keep water as your default drink from here on.'),
    ('Hour 18', 'This is the decision point most people hit. If you’re feeling it, that’s your body telling you it’s close to time to wrap up — listen to it.'),
    ('Plan your stopping point in advance', 'Decide before the night starts roughly when you’re calling it, and stick to something close to that plan. A great launch night has an ending, not just a crash.'),
]:
    story.extend(bullet(head, body))
story.append(callout('A NOTE ON SLEEP',
    "Do not drive while sleep deprived — if you need to go anywhere after a long session, get a ride or wait "
    "until you've actually slept. Get real sleep before launch night and plan to catch up on sleep after, "
    "rather than treating exhaustion as a badge of honor. You'll enjoy more of the game, not less, if you're "
    "actually rested for it.", kind='green'))
story.append(Spacer(1, 6))
story.append(footer(5))
story.append(PageBreak())

# Page 6 — Tech, People, Delivery, Timeline
story.append(section_label(6, 'TECH'))
story.append(Paragraph('Pre-Load. No Exceptions.', styles['SectionTitle']))
story.append(Paragraph(
    "Pre-load the game the moment it is available. You do not want to be the person sitting at a download "
    "screen while your friends are already finding things you haven't discovered yet. Pre-load and be ready "
    "at midnight.", styles['Body']))

story.append(section_label(7, 'PEOPLE'))
story.append(Paragraph('Family, Kids, and Neighbors', styles['SectionTitle']))
story.append(Paragraph(
    "<b>If you have kids:</b> Arrange an overnight stay with grandparents or family if possible. If your spouse is "
    "not a gamer, plan and pay for a night out for them — dinner and a movie — the night before launch. Enjoy "
    "it with them. Then come home and play. Don’t neglect your family over this — it causes problems down "
    "the road.", styles['Body']))
story.append(Paragraph(
    "<b>If you have neighbors:</b> Tell them what's about to happen. Apologize in advance. And buy them a pizza. "
    "I'm serious. A surround sound system in a house will rattle pictures off walls. A little goodwill goes a long "
    "way and keeps you from getting a noise complaint at 2 AM.", styles['Body']))

story.append(section_label(8, 'DELIVERY WARNING'))
story.append(Paragraph('GTA 6 Will Break DoorDash', styles['SectionTitle']))
story.append(Paragraph(
    "I drive for DoorDash. I know exactly what a big night does to the delivery ecosystem. GTA 6 launch night "
    "will be one of the biggest delivery events in history. Nobody is cooking. Every gamer who didn't prep is "
    "ordering food at the same time. Here's how to not get burned.", styles['Body']))
for head, body in [
    ('Order before 9 PM', 'The wave hits when people get off work, settle in, and realize they’re hungry. Beat it.'),
    ('Allow an extra hour', 'Even if DoorDash says 30 minutes — on launch night assume 90. Budget for it.'),
    ('Schedule your order ahead', 'Most delivery apps allow scheduled orders. Use this feature. Set it and forget it.'),
    ('Surge pricing is coming', 'Delivery fees will spike. Budget $5–10 extra per order that night.'),
]:
    story.extend(bullet(head, body))
story.append(Spacer(1, 6))
story.append(footer(6))
story.append(PageBreak())

# Page 7 — Timeline + closing
story.append(section_label(9, 'THE TIMELINE'))
story.append(Paragraph('Launch Night Minute by Minute', styles['SectionTitle']))
timeline_rows = [
    ['Starting Now', 'Request day off from work. Pay bills ahead. Start the snack fund envelope — $5–$10 a week from today until launch.'],
    ['2 Days Before', 'Stock the fridge and pantry. No store runs on launch day.'],
    ['Day Before', 'Do chores, yard work, house work. Clear your obligations. Sleep 7–9 hours.'],
    ['10:00 PM Launch Night', 'Set up your station. Test all connections. Charge every controller. Confirm pre-load is complete.'],
    ['11:00 PM', 'Order your food NOW if you haven’t already. Do not wait until midnight.'],
    ['12:00 AM', 'Game unlocks. You’re already loaded. You’re already fed. You’re already in.'],
    ['1:00 AM', 'First drive through Vice City. Take it in. You waited 13 years for this.'],
    ['Hour 6', 'Stretch. Shower if needed. Eat something real.'],
    ['Hour 12+', 'Longer break. Pace yourself — you’ve got a plan for when you’re calling it tonight.'],
    ['Your stopping point', 'Whatever you planned before the night started — stick close to it. Get real sleep. There’s a lot more Vice City waiting for you tomorrow.'],
]
tt = Table([['TIME', 'ACTION']] + timeline_rows, colWidths=[1.4 * inch, 5.0 * inch])
tt.setStyle(TableStyle([
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 9),
    ('TEXTCOLOR', (0, 0), (-1, 0), AMBER),
    ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
    ('TEXTCOLOR', (0, 1), (0, -1), BONE),
    ('TEXTCOLOR', (1, 1), (1, -1), SMOKE),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LINEBELOW', (0, 0), (-1, 0), 1, AMBER),
    ('LINEBELOW', (0, 1), (-1, -2), 0.5, EDGE),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(tt)
story.append(Spacer(1, 20))
story.append(Paragraph('READY.', styles['SectionTitle']))
story.append(Paragraph(
    "People in their mid-twenties when GTA V dropped are now almost 40. They have kids, homes, and "
    "retirement accounts. But those memories never left. GTA 6 is not just a game. It is a cultural moment "
    "thirteen years in the making. Show up for it right — and show up rested enough to actually enjoy it.",
    styles['Body']))
story.append(Spacer(1, 20))
story.append(Paragraph('56ViceLane.com — Follow us on X @56ViceLane — #ClearTheLanes', styles['Footer']))
story.append(footer(7))

doc.build(story)
print('done')
