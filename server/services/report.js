// ========================================
//  Clarity Pro PDF Report Generator
//  15-page personalised career blueprint
// ========================================

const PDFDocument = require('pdfkit');

// ---- Colour palette (matches glassmorphism UI) ----
const COLORS = {
    orange: '#F97316',
    amber: '#F59E0B',
    cream: '#FFFBF0',
    dark: '#1A1A2E',
    text: '#2D2D3F',
    muted: '#6B7280',
    accent: '#7C3AED',
    green: '#10B981',
    blue: '#3B82F6',
    lightGray: '#F3F4F6',
    white: '#FFFFFF'
};

// ---- Archetype content (full profiles for PDF) ----
const ARCHETYPE_PROFILES = {
    architect: {
        name: 'The Architect',
        emoji: '\u{1F9E0}',
        family: 'Strategic Thinkers',
        famousExamples: 'Elon Musk, Ruth Bader Ginsburg, Sherlock Holmes',
        howYouThink: "Your mind works like an architect's blueprint software. Where others see a messy problem, you see invisible structures: dependencies, bottlenecks, root causes, and elegant solutions. You don't just solve problems \u2014 you redesign systems so the problem can't recur. People with your combination of high Openness and high Conscientiousness excel in roles requiring both creative insight and systematic execution. You are rare: only about 11% of people score high on BOTH dimensions simultaneously.",
        howYouFeel: "You experience emotions through the lens of understanding. When you're frustrated, it's usually because a system is inefficient or a decision was made without logic. When you're fulfilled, it's because you've solved something that was broken. Your emotional resilience means you can hold complexity without becoming overwhelmed. This is a genuine strength in high-pressure roles, but watch for: emotional detachment from colleagues who need empathy, not analysis.",
        howYouWork: "You prefer: deep focus time, clear briefs, intellectual challenge, autonomy over method. You struggle in: micromanaged environments, roles with no creative freedom, teams that prioritise consensus over correctness. Your ideal work rhythm: 2\u20133 hours of uninterrupted deep work, followed by collaborative problem-solving. You recharge with solitude but contribute powerfully in small groups. Ideal team size: 3\u20135 people.",
        careers: [
            { title: 'Software Architect / Systems Engineer', why: 'Your Investigative-Conventional Holland code combined with Systems Thinking as your dominant strength maps directly to architecture roles. You enjoy designing elegant systems that scale.', dayInLife: '9:00 \u2014 Review system design proposals from the team\n10:00 \u2014 Deep work: design microservices architecture for new feature\n12:00 \u2014 Lunch (often reading technical blogs)\n13:00 \u2014 Architecture review meeting with 3 engineers\n14:30 \u2014 Write technical design document\n16:00 \u2014 Mentor junior engineer on design patterns\n17:00 \u2014 Review pull requests, plan tomorrow', entry: ['Shortest: Complete a cloud architecture certification (AWS/GCP) + build 2 portfolio projects', 'Traditional: CS degree + 3\u20135 years as software engineer + specialise', 'Career pivot: Leverage analytical skills + bootcamp + open source contributions'], salary: { junior: '$75,000\u2013$95,000', mid: '$110,000\u2013$140,000', senior: '$150,000\u2013$200,000', director: '$200,000+' }, fiveYear: 'Year 1: Mid-level engineer at a growing company\nYear 2\u20133: Lead engineer / tech lead on a product team\nYear 3\u20134: Staff engineer or architecture role\nYear 5: Principal engineer or VP of Engineering' },
            { title: 'Management Consultant (Strategy)', why: 'Your pattern recognition and analytical depth make you a natural consultant. You can diagnose organisational problems that others miss.', dayInLife: '8:00 \u2014 Client call: stakeholder interviews\n10:00 \u2014 Data analysis: market sizing and competitive landscape\n12:00 \u2014 Team working lunch: refine hypothesis\n13:00 \u2014 Build recommendation deck\n15:00 \u2014 Internal review with partner\n16:30 \u2014 Prepare for tomorrow\'s client presentation\n18:00 \u2014 Travel to next client site', entry: ['MBA from a top-20 school + consulting internship', 'Experienced hire: 3+ years in industry + strong analytical track record', 'Alternative: Boutique consulting firms value diverse backgrounds'], salary: { junior: '$85,000\u2013$105,000', mid: '$130,000\u2013$170,000', senior: '$180,000\u2013$250,000', director: '$300,000+' }, fiveYear: 'Year 1: Analyst / Associate at a consulting firm\nYear 2\u20133: Senior consultant leading workstreams\nYear 3\u20134: Manager with team of 3\u20135\nYear 5: Principal / exit to industry strategy role' },
            { title: 'Data Science Lead', why: 'The unexpected match: your combination of systems thinking + intellectual curiosity + high standards is exactly what data science leadership requires. You won\'t just build models \u2014 you\'ll design the entire data strategy.', dayInLife: '9:00 \u2014 Review experiment results from A/B test\n10:00 \u2014 Deep work: build prediction model for user churn\n12:00 \u2014 Lunch\n13:00 \u2014 Present insights to product team\n14:30 \u2014 Code review with data engineering team\n16:00 \u2014 Research: read latest papers on your domain\n17:00 \u2014 Plan next sprint\'s research questions', entry: ['Online: Google Data Analytics Certificate + Python/SQL + Kaggle portfolio', 'Academic: Statistics or maths degree + data science bootcamp', 'Pivot: Leverage domain expertise + learn Python + contribute to open-source data projects'], salary: { junior: '$80,000\u2013$100,000', mid: '$120,000\u2013$155,000', senior: '$160,000\u2013$200,000', director: '$220,000+' }, fiveYear: 'Year 1: Data analyst at a mid-size tech company\nYear 2\u20133: Data scientist, own a product area\nYear 3\u20134: Senior DS / ML engineer\nYear 5: Lead data scientist or head of analytics' }
        ]
    },
    explorer: {
        name: 'The Explorer',
        emoji: '\u{1F30D}',
        family: 'Strategic Thinkers',
        famousExamples: 'Marie Curie, Anthony Bourdain, Ada Lovelace',
        howYouThink: "Your mind is wired for discovery. Where others see separate domains, you see hidden connections. You come alive when learning IS the job. Your intellectual curiosity isn't a personality quirk \u2014 it's your core operating system. You naturally cross-pollinate ideas between fields, which means you often see solutions that specialists miss.",
        howYouFeel: "You experience deep satisfaction in moments of insight \u2014 when a pattern suddenly clicks or a new connection reveals itself. Boredom is your kryptonite: routine work physically drains you. Your emotional life is rich but you process feelings intellectually, sometimes needing to 'figure out' what you feel before you can express it.",
        howYouWork: "You thrive with variety: different projects, different people, different challenges. Long-term commitment to one narrow topic can feel suffocating unless the topic has infinite depth. You work best in environments that value questions as much as answers. Your ideal rhythm: rapid research sprints followed by synthesis sessions.",
        careers: [
            { title: 'Product Strategy / Research Lead', why: 'Your cross-disciplinary thinking and pattern-spotting make you a natural strategist. You can see market opportunities that specialists miss because you connect dots across industries.', dayInLife: '9:00 \u2014 Review user research from yesterday\'s interviews\n10:00 \u2014 Competitive analysis: what are 3 adjacent markets doing?\n11:30 \u2014 Brainstorm session with product and design\n13:00 \u2014 Lunch (listening to a podcast on behavioural economics)\n14:00 \u2014 Deep work: write product strategy memo\n16:00 \u2014 Stakeholder alignment meeting\n17:00 \u2014 Read industry reports, save ideas', entry: ['Start in product analytics or junior PM role', 'Research background: UX research or market research transitions well', 'Self-taught: build a product teardown portfolio + write publicly about strategy'], salary: { junior: '$70,000\u2013$90,000', mid: '$100,000\u2013$140,000', senior: '$150,000\u2013$190,000', director: '$200,000+' }, fiveYear: 'Year 1: Product analyst or associate PM\nYear 2\u20133: Product manager with strategy focus\nYear 3\u20134: Senior PM or head of product research\nYear 5: VP Product or independent strategy consultant' },
            { title: 'Investigative Journalist / Research Writer', why: 'Your research depth and intellectual curiosity are exactly what journalism needs. You don\'t just report \u2014 you uncover.', dayInLife: '8:00 \u2014 Scan sources and tip line\n9:00 \u2014 Interview: expert source for current investigation\n11:00 \u2014 Deep research: FOIA requests, data analysis, document review\n13:00 \u2014 Lunch with an editor to pitch new story angles\n14:00 \u2014 Write draft of long-form piece\n16:30 \u2014 Fact-check with research assistant\n17:30 \u2014 Plan next week\'s interviews', entry: ['Journalism degree or strong writing portfolio', 'Start with a newsletter or blog in your area of curiosity', 'Freelance: pitch to publications, build a body of work'], salary: { junior: '$45,000\u2013$60,000', mid: '$65,000\u2013$90,000', senior: '$90,000\u2013$130,000', director: '$140,000+' }, fiveYear: 'Year 1: Junior reporter or research assistant\nYear 2\u20133: Beat reporter or staff writer\nYear 3\u20134: Senior writer or investigations team\nYear 5: Editor or independent journalist with book deal' },
            { title: 'Venture Capital Analyst', why: 'The unexpected match: VC rewards exactly your profile \u2014 insatiable curiosity, ability to evaluate ideas across domains, and pattern recognition for what will work next.', dayInLife: '9:00 \u2014 Review 10 startup pitch decks\n10:30 \u2014 Deep dive: market analysis on a promising sector\n12:00 \u2014 Founder meeting over lunch\n13:30 \u2014 Internal discussion: should we invest?\n15:00 \u2014 Portfolio company check-in call\n16:00 \u2014 Read: industry newsletters, research papers\n17:00 \u2014 Write investment memo', entry: ['Finance or consulting background + MBA or strong network', 'Operator path: build/work at a startup first, then transition to VC', 'Scout programs: many VC firms have part-time scout roles to start'], salary: { junior: '$80,000\u2013$120,000', mid: '$150,000\u2013$250,000', senior: '$300,000\u2013$500,000+', director: '$500,000+ (with carry)' }, fiveYear: 'Year 1: Analyst at a seed or Series A fund\nYear 2\u20133: Associate, sourcing and leading deals\nYear 3\u20134: Principal, sitting on boards\nYear 5: Partner track or launch own fund' }
        ]
    },
    visionary: {
        name: 'The Visionary',
        emoji: '\u{1F680}',
        family: 'Strategic Thinkers',
        famousExamples: 'Steve Jobs, Oprah Winfrey, Nikola Tesla',
        howYouThink: "Where others see what is, you see what could be. Your mind naturally generates possibilities, innovations, and visions of the future. You think in terms of impact and transformation, not incremental improvement. This makes you both inspiring and sometimes impatient with the pace of change.",
        howYouFeel: "You feel most alive when pursuing a vision. The gap between your vision and current reality creates a productive tension that drives you. You can feel frustrated when others don't see what you see, and lonely when you're too far ahead of the curve. Learning to communicate your vision in terms others can grasp is your key growth edge.",
        howYouWork: "You need creative freedom and a team that can execute alongside you. You're the spark, not the engine. Your best work happens in short, intense bursts of inspiration followed by periods of delegation and refinement. Ideal role: the one defining direction, not maintaining systems.",
        careers: [
            { title: 'Startup Founder / CEO', why: 'Your combination of future-oriented thinking, creative problem-solving, and ability to inspire others is the classic founder profile.', dayInLife: '7:00 \u2014 Morning routine: journaling, vision review\n8:30 \u2014 Leadership standup with co-founders\n9:00 \u2014 Investor call or board update\n10:30 \u2014 Product vision session with design team\n12:00 \u2014 Networking lunch\n14:00 \u2014 Deep work: strategy and fundraising deck\n16:00 \u2014 Team all-hands: share vision and celebrate wins\n17:30 \u2014 Candidate interview for key hire', entry: ['Start building now: validate an idea in 30 days', 'Join a startup first: learn the ropes as employee #1\u201310', 'Accelerator path: Y Combinator, Techstars, or local programs'], salary: { junior: '$0\u2013$60,000 (pre-funding)', mid: '$80,000\u2013$150,000 (seed/A)', senior: '$150,000\u2013$300,000 (growth)', director: 'Equity-driven upside' }, fiveYear: 'Year 1: Validate idea, build MVP, get first 10 customers\nYear 2: Raise seed round, hire first 5 people\nYear 3: Product-market fit, scale to 20+ team\nYear 4\u20135: Series A/B, establish market position' },
            { title: 'Creative Director', why: 'Your big-picture clarity and ability to inspire teams makes you a natural creative leader.', dayInLife: '9:00 \u2014 Review creative briefs for 3 campaigns\n10:00 \u2014 Brainstorm with design team\n11:30 \u2014 Client presentation: pitch new creative direction\n13:00 \u2014 Lunch (visiting a gallery or reading about design trends)\n14:00 \u2014 Review work-in-progress from junior creatives\n16:00 \u2014 Creative strategy for upcoming product launch\n17:00 \u2014 Industry event or creative community meetup', entry: ['Design or art school + agency experience', 'Self-taught: build a stunning portfolio + freelance + agency hire', 'Content creator path: build audience first, then leverage for creative roles'], salary: { junior: '$55,000\u2013$75,000', mid: '$90,000\u2013$130,000', senior: '$140,000\u2013$200,000', director: '$200,000+' }, fiveYear: 'Year 1: Junior designer or content creator at agency\nYear 2\u20133: Senior designer / art director\nYear 3\u20134: Associate creative director\nYear 5: Creative Director or start own studio' },
            { title: 'Social Entrepreneur', why: 'The unexpected match: your vision + impact drive means you can build something that changes the world, not just makes money.', dayInLife: '8:00 \u2014 Community partner call\n9:30 \u2014 Grant writing and impact measurement\n11:00 \u2014 Field visit: see your program in action\n13:00 \u2014 Lunch with potential donor/partner\n14:30 \u2014 Strategy session: scaling the model\n16:00 \u2014 Media interview about your mission\n17:00 \u2014 Team reflection and planning', entry: ['Start a side project with social impact', 'Join an existing social enterprise to learn the model', 'Fellowship programs: Ashoka, Echoing Green, Unreasonable Institute'], salary: { junior: '$40,000\u2013$60,000', mid: '$65,000\u2013$90,000', senior: '$90,000\u2013$140,000', director: '$150,000+' }, fiveYear: 'Year 1: Launch pilot program or join social enterprise\nYear 2: Prove impact with data\nYear 3: Scale with grants/investment\nYear 4\u20135: Establish as recognised social innovator' }
        ]
    },
    healer: {
        name: 'The Healer',
        emoji: '\u{1F49A}',
        family: 'Relationship Builders',
        famousExamples: 'Brene Brown, Carl Rogers, Princess Diana',
        howYouThink: "You think in terms of people and feelings. Your mind naturally attunes to emotional undercurrents in any room. Where others process information logically first, you process it empathetically. This gives you an almost supernatural ability to sense what people need before they say it.",
        howYouFeel: "You feel deeply \u2014 both your own emotions and those of others. This is your superpower and your vulnerability. You absorb the emotional states of people around you, which means you need deliberate boundaries and recovery time. Your self-care isn't optional; it's essential infrastructure for your gift.",
        howYouWork: "You thrive in roles with deep human connection: one-on-one or small groups over large teams. You need work that feels meaningful at the end of every day. Bureaucracy and politics drain you. You work best in environments where vulnerability is welcomed and emotional intelligence is valued.",
        careers: [
            { title: 'Therapist / Psychologist', why: 'Your deep empathy, active listening, and ability to create safety are the exact skills therapeutic work requires. This isn\'t just a career \u2014 it\'s an expression of who you are.', dayInLife: '8:30 \u2014 Review notes from yesterday\'s sessions\n9:00 \u2014 Client session 1 (individual therapy)\n10:00 \u2014 Client session 2\n11:00 \u2014 Break: walk, journal, decompress\n11:30 \u2014 Client session 3\n12:30 \u2014 Lunch\n13:30 \u2014 Group therapy facilitation\n15:00 \u2014 Supervision meeting with mentor\n16:00 \u2014 Admin: notes, treatment plans\n17:00 \u2014 Professional development reading', entry: ['Psychology degree + master\'s or doctoral programme', 'Counselling certification (shorter path): 2-year master\'s programme', 'Start now: volunteer at a crisis hotline to test your fit'], salary: { junior: '$50,000\u2013$65,000', mid: '$70,000\u2013$95,000', senior: '$100,000\u2013$140,000', director: '$150,000+ (private practice)' }, fiveYear: 'Year 1\u20132: Complete clinical training and supervised hours\nYear 3: Licensed therapist, join a group practice\nYear 4: Specialise in a niche (trauma, couples, adolescents)\nYear 5: Open private practice or lead a clinical team' },
            { title: 'Executive / Life Coach', why: 'Coaching lets you use your healing skills in a growth-oriented context. You help people become who they want to be.', dayInLife: '8:00 \u2014 Morning: review client goals and session plans\n9:00 \u2014 Coaching session 1 (video call)\n10:30 \u2014 Coaching session 2\n12:00 \u2014 Lunch + content creation (blog/podcast)\n13:30 \u2014 Workshop facilitation for corporate client\n15:30 \u2014 Business development: networking/outreach\n17:00 \u2014 Reflect and plan tomorrow', entry: ['ICF-accredited coaching certification (3\u20136 months)', 'Offer free sessions to 10 people to build skills and testimonials', 'Niche down: career coaching for specific demographic (e.g., Gen Z, women in tech)'], salary: { junior: '$40,000\u2013$60,000', mid: '$70,000\u2013$120,000', senior: '$130,000\u2013$200,000', director: '$250,000+ (premium executive coaching)' }, fiveYear: 'Year 1: Get certified, coach 20+ people for free or low-cost\nYear 2: Build a niche, get first paying clients\nYear 3: Full practice with waitlist\nYear 4: Launch group programmes or courses\nYear 5: Recognised coach with book or speaking career' },
            { title: 'UX Researcher (Health/Wellbeing Products)', why: 'The unexpected match: your empathy + listening skills are exactly what user research demands. You\'ll design products that actually help people.', dayInLife: '9:00 \u2014 Review user interview transcripts\n10:00 \u2014 Conduct user interview (video call)\n11:30 \u2014 Synthesise findings into insights report\n13:00 \u2014 Lunch\n14:00 \u2014 Present research to product + design team\n15:30 \u2014 Design usability test for new feature\n16:30 \u2014 Participant recruitment and scheduling', entry: ['Google UX Design Certificate (Coursera) + portfolio projects', 'Psychology background transitions naturally to UX research', 'Start by doing free usability tests for nonprofits'], salary: { junior: '$65,000\u2013$85,000', mid: '$90,000\u2013$120,000', senior: '$130,000\u2013$170,000', director: '$180,000+' }, fiveYear: 'Year 1: Junior UX researcher at a product company\nYear 2\u20133: Own a product area\'s research\nYear 3\u20134: Senior researcher or research lead\nYear 5: Head of Research or independent consultant' }
        ]
    },
    connector: {
        name: 'The Connector',
        emoji: '\u{1F91D}',
        family: 'Relationship Builders',
        famousExamples: 'Oprah Winfrey, Keith Ferrazzi, Priscilla Chan',
        howYouThink: "You think in terms of networks and relationships. When you meet someone, your mind automatically maps them to other people they should know. You see complementary strengths between people before they see them themselves.",
        howYouFeel: "You feel energised by bringing people together. Your deepest satisfaction comes from seeing a connection you made flourish. You feel drained by isolation and competitive environments where people hoard relationships.",
        howYouWork: "You thrive in roles that are relationship-dense: lots of meetings, events, and one-on-ones. Your Rolodex is your most valuable asset. You work best in organisations that value collaboration over individual heroics.",
        careers: [
            { title: 'Community Manager / Head of Community', why: 'Your networking skills and ability to create belonging are exactly what community roles need.', dayInLife: '8:30 \u2014 Check community channels, respond to key posts\n10:00 \u2014 Plan this week\'s community event\n11:00 \u2014 Welcome call with new community members\n12:00 \u2014 Lunch with a community champion\n13:30 \u2014 Content creation: member spotlight story\n15:00 \u2014 Data review: engagement metrics\n16:00 \u2014 Strategy meeting with marketing team', entry: ['Start by building a community around something you care about', 'Join a community team at a startup or creator economy company', 'Volunteer to manage online communities for nonprofits'], salary: { junior: '$50,000\u2013$70,000', mid: '$75,000\u2013$110,000', senior: '$120,000\u2013$160,000', director: '$170,000+' }, fiveYear: 'Year 1: Community coordinator or associate\nYear 2\u20133: Community manager leading engagement\nYear 3\u20134: Senior community manager or head of community\nYear 5: VP Community or build own community business' },
            { title: 'Partnerships & Business Development', why: 'You naturally build bridges between organisations, making you perfect for partnership roles.', dayInLife: '9:00 \u2014 Pipeline review: follow up with 5 prospects\n10:30 \u2014 Partner meeting: explore collaboration\n12:00 \u2014 Networking lunch\n14:00 \u2014 Draft partnership proposal\n15:30 \u2014 Internal alignment: coordinate with product team\n16:30 \u2014 Industry event or webinar', entry: ['Sales or account management experience transitions well', 'Start by making introductions in your network \u2014 practice deal-making', 'MBA programs excel at building partnership skills'], salary: { junior: '$60,000\u2013$80,000', mid: '$90,000\u2013$130,000', senior: '$140,000\u2013$200,000', director: '$200,000+ (with commission)' }, fiveYear: 'Year 1: BD associate or partnerships coordinator\nYear 2\u20133: Partnerships manager, closing deals\nYear 3\u20134: Senior BD or head of partnerships\nYear 5: VP Partnerships or Chief Revenue Officer' },
            { title: 'Event Producer / Experience Designer', why: 'The unexpected match: your gift for connecting people translates beautifully into designing experiences that bring communities together.', dayInLife: '9:00 \u2014 Vendor calls: venue, catering, AV setup\n10:30 \u2014 Creative session: design attendee experience\n12:00 \u2014 Site visit for upcoming event\n14:00 \u2014 Sponsor outreach and partnership negotiations\n15:30 \u2014 Marketing collaboration: event promotion\n17:00 \u2014 Event day logistics planning', entry: ['Start by organising small meetups or community events', 'Event management certification or hospitality degree', 'Volunteer at conferences to learn the craft'], salary: { junior: '$45,000\u2013$65,000', mid: '$70,000\u2013$100,000', senior: '$110,000\u2013$150,000', director: '$160,000+' }, fiveYear: 'Year 1: Event coordinator at an agency or company\nYear 2\u20133: Event manager running full productions\nYear 3\u20134: Senior producer or head of events\nYear 5: Creative director of experiences or own agency' }
        ]
    },
    mentor: {
        name: 'The Mentor',
        emoji: '\u{1F331}',
        family: 'Relationship Builders',
        famousExamples: 'Mr. Rogers, Michelle Obama, Dumbledore',
        howYouThink: "You think in terms of potential. When you look at someone, you see not just who they are, but who they could become. Your mind naturally identifies growth edges and developmental opportunities.",
        howYouFeel: "Your greatest satisfaction comes from watching someone achieve something they didn't think they could. You invest in people for the long game, and you feel deeply fulfilled when your investment pays off \u2014 even years later.",
        howYouWork: "You thrive in roles that develop others: teaching, coaching, managing, advising. You need to see growth to stay engaged. Purely transactional work depletes you. You work best in environments that value long-term development over short-term output.",
        careers: [
            { title: 'Learning & Development Lead', why: 'Your developmental instinct and patience make you a natural L&D professional. You design the programmes that grow entire organisations.', dayInLife: '8:30 \u2014 Review feedback from yesterday\'s training\n9:30 \u2014 Design new onboarding programme module\n11:00 \u2014 Facilitate leadership workshop\n13:00 \u2014 Lunch with a mentee\n14:00 \u2014 Meet with department heads: identify training needs\n15:30 \u2014 Research new learning technologies\n16:30 \u2014 Coach a high-potential employee', entry: ['HR or organisational development background', 'Teaching experience transitions naturally', 'Coaching certification + corporate training workshops'], salary: { junior: '$55,000\u2013$75,000', mid: '$80,000\u2013$115,000', senior: '$120,000\u2013$160,000', director: '$170,000+' }, fiveYear: 'Year 1: L&D coordinator or training specialist\nYear 2\u20133: L&D manager, own programme design\nYear 3\u20134: Senior L&D or head of talent development\nYear 5: Chief Learning Officer or independent consultancy' },
            { title: 'Teacher / Professor', why: 'Teaching is the purest expression of your mentoring drive. You get to see transformation happen daily.', dayInLife: '7:30 \u2014 Prepare materials for today\'s classes\n8:30 \u2014 Teach morning classes\n12:00 \u2014 Lunch + student office hours\n13:30 \u2014 Grade assignments and provide detailed feedback\n15:00 \u2014 Curriculum development meeting\n16:00 \u2014 Mentor a struggling student one-on-one\n17:00 \u2014 Professional development or research', entry: ['Education degree for K-12; master\'s/PhD for higher education', 'Alternative certification programmes (Teach for America, etc.)', 'Start tutoring or mentoring now to test your fit'], salary: { junior: '$42,000\u2013$55,000', mid: '$55,000\u2013$80,000', senior: '$80,000\u2013$120,000', director: '$120,000+ (administration/tenured)' }, fiveYear: 'Year 1\u20132: New teacher or teaching assistant\nYear 3: Established teacher with proven results\nYear 4: Department lead or curriculum designer\nYear 5: Senior educator, published, or move to administration' },
            { title: 'Youth Programme Director', why: 'The unexpected match: you can shape the next generation at scale by designing programmes that develop young people.', dayInLife: '8:00 \u2014 Staff check-in: how are mentors doing?\n9:30 \u2014 Programme session with youth participants\n11:00 \u2014 Meet with school or community partner\n12:30 \u2014 Lunch with a youth participant (mentoring)\n14:00 \u2014 Grant writing and programme evaluation\n15:30 \u2014 Design new workshop curriculum\n17:00 \u2014 Parent information evening', entry: ['Social work, education, or youth development background', 'Volunteer with youth organisations to build experience', 'AmeriCorps or Peace Corps as a launchpad'], salary: { junior: '$40,000\u2013$55,000', mid: '$60,000\u2013$80,000', senior: '$85,000\u2013$115,000', director: '$120,000+' }, fiveYear: 'Year 1: Youth worker or programme coordinator\nYear 2\u20133: Programme manager, design and run programmes\nYear 3\u20134: Director of programmes\nYear 5: Executive director or launch own youth organisation' }
        ]
    },
    catalyst: {
        name: 'The Catalyst',
        emoji: '\u26A1',
        family: 'Influencers',
        famousExamples: 'Gary Vaynerchuk, Malala Yousafzai, Winston Churchill',
        howYouThink: "You think in terms of momentum and action. While others are still planning, you're already executing. Your bias toward action is both your greatest strength and your biggest risk \u2014 you sometimes move before the plan is ready. But more often than not, your instincts are right.",
        howYouFeel: "You feel most alive in high-stakes, fast-moving environments. Comfort and stability actually make you restless. You need a challenge to feel engaged, and you thrive under the pressure that makes others crumble.",
        howYouWork: "You set the pace for your team. Your energy is contagious. You're the person who turns a group brainstorm into a shipped product. You struggle with: slow organisations, excessive process, analysis paralysis. Give you a clear target and get out of the way.",
        careers: [
            { title: 'Sales / Revenue Leader', why: 'Your energy, decisiveness, and ability to mobilise others make you a natural sales leader. You thrive on the scoreboard.', dayInLife: '7:30 \u2014 Review pipeline and daily targets\n8:30 \u2014 Team standup: energise the sales floor\n9:00 \u2014 Client calls and demos (3\u20135 per day)\n12:00 \u2014 Power lunch with prospect\n14:00 \u2014 Strategy session: Q3 territory plan\n15:30 \u2014 Coach underperforming rep\n17:00 \u2014 Close-of-day review and celebrate wins', entry: ['Start in an SDR/BDR role at a tech company', 'Any customer-facing role builds transferable skills', 'Sales bootcamp: Aspireship, Kforce, or Salesforce Trailhead'], salary: { junior: '$50,000\u2013$75,000 + commission', mid: '$90,000\u2013$150,000 OTE', senior: '$150,000\u2013$300,000 OTE', director: '$300,000+ OTE' }, fiveYear: 'Year 1: SDR/BDR, learn the craft\nYear 2: Account executive, close deals\nYear 3: Senior AE or team lead\nYear 4: Sales manager\nYear 5: VP Sales or head of revenue' },
            { title: 'Campaign Director / Political Strategist', why: 'High-stakes, fast-paced, impact-driven \u2014 campaigns are your natural habitat.', dayInLife: '7:00 \u2014 News scan: what\'s changed overnight?\n8:00 \u2014 Strategy meeting with candidate/team\n9:30 \u2014 Media interview or press briefing\n11:00 \u2014 Rally/event coordination\n13:00 \u2014 Donor calls\n15:00 \u2014 Data review: polling numbers, social analytics\n17:00 \u2014 Evening event or town hall\n21:00 \u2014 Debrief and plan tomorrow', entry: ['Volunteer on a local campaign \u2014 show up and work hard', 'Political science or communications degree', 'Join a political organisation or PAC'], salary: { junior: '$40,000\u2013$60,000', mid: '$70,000\u2013$110,000', senior: '$120,000\u2013$180,000', director: '$200,000+' }, fiveYear: 'Year 1: Campaign staffer or field organiser\nYear 2\u20133: Deputy campaign manager\nYear 3\u20134: Campaign manager or communications director\nYear 5: Political consultant or run for office yourself' },
            { title: 'Crisis Management Consultant', why: 'The unexpected match: your calm under pressure + decisiveness + mobilising energy is exactly what organisations need when things go wrong.', dayInLife: '(No typical day \u2014 that\'s the point)\nCrisis hits: assemble team within 1 hour\nHour 1\u20132: Assess situation, gather facts\nHour 3\u20134: Develop response strategy\nHour 5: Brief leadership team\nHour 6: Execute communications plan\nDays 2\u20137: Manage response, stakeholders, media\nWeek 2+: Recovery planning and lessons learned', entry: ['PR or communications background with crisis experience', 'Military or emergency services background transitions well', 'Start in corporate communications, volunteer for crisis response teams'], salary: { junior: '$55,000\u2013$75,000', mid: '$85,000\u2013$130,000', senior: '$140,000\u2013$200,000', director: '$250,000+' }, fiveYear: 'Year 1\u20132: PR associate or corporate communications\nYear 3: Crisis communications specialist\nYear 4: Senior consultant or director\nYear 5: Partner at crisis management firm or independent consultant' }
        ]
    },
    storyteller: {
        name: 'The Storyteller',
        emoji: '\u270D\uFE0F',
        family: 'Influencers',
        famousExamples: 'Brene Brown, Lin-Manuel Miranda, Chimamanda Ngozi Adichie',
        howYouThink: "You think in narratives. Every fact, every idea, every experience gets filed in your mind as a potential story element. You naturally translate complex concepts into emotional, relatable language.",
        howYouFeel: "You feel through expression. Writing, speaking, creating \u2014 these aren't just activities, they're how you process the world. When you can't express yourself, you feel stuck. When you find the perfect words, you feel whole.",
        howYouWork: "You need creative projects with real impact. Your ideal work lets you craft messages that move people to action. You struggle in roles that are purely analytical or data-driven without a human narrative. Your best work comes from deep empathy for your audience.",
        careers: [
            { title: 'Content Strategist / Brand Writer', why: 'Your narrative construction and audience empathy make you a natural brand storyteller.', dayInLife: '9:00 \u2014 Review content performance analytics\n10:00 \u2014 Write: long-form article or brand narrative\n12:00 \u2014 Lunch (reading: always reading)\n13:00 \u2014 Creative brief review with marketing team\n14:30 \u2014 Interview subject matter expert for upcoming piece\n16:00 \u2014 Edit and polish content for publication\n17:00 \u2014 Plan editorial calendar', entry: ['Build a writing portfolio (blog, Medium, newsletter)', 'Freelance writing to build client experience', 'Marketing or journalism degree + agency internship'], salary: { junior: '$50,000\u2013$70,000', mid: '$75,000\u2013$110,000', senior: '$115,000\u2013$155,000', director: '$160,000+' }, fiveYear: 'Year 1: Junior content writer or copywriter\nYear 2\u20133: Content strategist or senior writer\nYear 3\u20134: Head of content or editorial director\nYear 5: VP Content or independent consultant' },
            { title: 'Filmmaker / Podcast Producer', why: 'Your storytelling gift extends beyond the written word \u2014 audio and visual media give you even more tools.', dayInLife: '8:00 \u2014 Pre-production: script review and shot list\n9:30 \u2014 Recording session or on-location shoot\n12:00 \u2014 Lunch\n13:00 \u2014 Editing and post-production\n15:00 \u2014 Review rough cut with team\n16:00 \u2014 Outreach: guests, distribution, partnerships\n17:00 \u2014 Creative research and ideation', entry: ['Start creating content now: YouTube, TikTok, podcast', 'Film school or media production programme', 'Apprentice with an established creator or production company'], salary: { junior: '$40,000\u2013$60,000', mid: '$65,000\u2013$100,000', senior: '$110,000\u2013$160,000', director: '$170,000+ (or creator economy upside)' }, fiveYear: 'Year 1: Create own content + freelance production work\nYear 2\u20133: Build audience or join established production team\nYear 3\u20134: Producer with recognisable body of work\nYear 5: Executive producer or independent studio' },
            { title: 'Speechwriter / Communications Director', why: 'The unexpected match: your gift for turning ideas into feelings makes you invaluable to leaders who need to communicate vision.', dayInLife: '8:00 \u2014 Brief with executive on upcoming speech\n9:30 \u2014 Research and draft speech outline\n11:00 \u2014 Write first draft\n13:00 \u2014 Lunch with communications team\n14:00 \u2014 Rehearsal session with speaker\n15:30 \u2014 Edit based on feedback\n16:30 \u2014 Prepare talking points for media interviews', entry: ['Political speechwriting internship or PR agency', 'Strong writing portfolio + connection to political or business leaders', 'Start by ghostwriting for executives on LinkedIn'], salary: { junior: '$55,000\u2013$75,000', mid: '$80,000\u2013$120,000', senior: '$130,000\u2013$180,000', director: '$200,000+' }, fiveYear: 'Year 1\u20132: Junior speechwriter or comms associate\nYear 3: Senior speechwriter or comms manager\nYear 4: Director of communications\nYear 5: Chief communications officer or independent consultant' }
        ]
    },
    challenger: {
        name: 'The Challenger',
        emoji: '\u{1F525}',
        family: 'Influencers',
        famousExamples: 'Greta Thunberg, Malcolm X, Erin Brockovich',
        howYouThink: "You see through conventional wisdom. Your mind automatically questions assumptions, challenges authority, and identifies where systems are failing the people they should serve. You're not contrarian for sport \u2014 you genuinely believe that improvement requires disruption.",
        howYouFeel: "You feel a deep sense of justice and urgency. The gap between how things are and how they should be creates productive anger in you. You channel this into action, not despair. People who share your values find you inspiring; people who benefit from the status quo find you threatening.",
        howYouWork: "You thrive in roles where you can challenge and improve systems. You need autonomy and a cause to believe in. You struggle in hierarchical environments that value obedience over truth-telling. Your ideal workplace: flat, mission-driven, welcomes dissent.",
        careers: [
            { title: 'Policy Analyst / Advocate', why: 'Your critical thinking and reform energy make you a natural in policy work where you can change systems from within.', dayInLife: '8:30 \u2014 Scan policy updates and news\n9:30 \u2014 Research: analyse proposed legislation\n11:00 \u2014 Stakeholder meeting: gather community input\n13:00 \u2014 Lunch with fellow advocates\n14:00 \u2014 Write policy brief or position paper\n16:00 \u2014 Testify at committee hearing or attend town hall\n17:30 \u2014 Coalition meeting with allied organisations', entry: ['Public policy or political science degree', 'Start with a policy fellowship or think tank internship', 'Grassroots: organise locally, build a track record of impact'], salary: { junior: '$45,000\u2013$65,000', mid: '$70,000\u2013$100,000', senior: '$105,000\u2013$150,000', director: '$160,000+' }, fiveYear: 'Year 1: Policy researcher or legislative aide\nYear 2\u20133: Policy analyst or campaign strategist\nYear 3\u20134: Senior policy advisor or advocacy director\nYear 5: Think tank fellow or elected office' },
            { title: 'Investigative Journalist', why: 'Your courage to dissent and critical eye make you a natural at uncovering the truth.', dayInLife: '8:00 \u2014 Source calls and tip-line review\n9:30 \u2014 Deep research: documents, data, records\n11:00 \u2014 Interview a whistleblower or expert\n13:00 \u2014 Lunch (reading competitive coverage)\n14:00 \u2014 Draft investigation narrative\n16:00 \u2014 Legal review of sensitive material\n17:00 \u2014 Edit meeting with senior editor', entry: ['Journalism degree or strong investigative portfolio', 'Start with local reporting: city council, school boards', 'Data journalism skills: learn SQL, scraping, FOIA requests'], salary: { junior: '$40,000\u2013$55,000', mid: '$60,000\u2013$90,000', senior: '$95,000\u2013$140,000', director: '$150,000+' }, fiveYear: 'Year 1: Reporter at local outlet\nYear 2\u20133: Beat reporter specialising in investigations\nYear 3\u20134: Investigative reporter at major outlet\nYear 5: Senior investigative journalist or Pulitzer contender' },
            { title: 'Startup Disruptor (Regulatory Technology)', why: 'The unexpected match: your instinct to challenge broken systems + building energy = creating the technology that forces systems to change.', dayInLife: '8:30 \u2014 Team standup: what are we disrupting today?\n9:30 \u2014 Customer interviews: what\'s broken in their industry?\n11:00 \u2014 Product strategy session\n13:00 \u2014 Lunch with a potential partner\n14:00 \u2014 Regulatory landscape analysis\n15:30 \u2014 Investor update or fundraising prep\n17:00 \u2014 Industry event or meetup', entry: ['Deep understanding of a specific industry\'s problems', 'Technical skills or strong co-founder', 'Accelerator programs focused on civic tech or regtech'], salary: { junior: '$0\u2013$60,000 (early stage)', mid: '$80,000\u2013$130,000 (funded)', senior: '$140,000\u2013$200,000', director: 'Equity-driven upside' }, fiveYear: 'Year 1: Identify the broken system, validate the solution\nYear 2: Build MVP, get first customers\nYear 3: Raise funding, grow team\nYear 4\u20135: Scale and become the industry standard' }
        ]
    },
    builder: {
        name: 'The Builder',
        emoji: '\u{1F528}',
        family: 'Executors',
        famousExamples: 'Tim Cook, James Dyson, Simone Biles',
        howYouThink: "You think in terms of progress and output. Your mind naturally tracks what needs to be done, what's on schedule, and what's blocking completion. You find deep satisfaction in the physical or digital evidence of work completed.",
        howYouFeel: "You feel most fulfilled when you can see tangible results from your effort. An empty to-do list is your version of a runner's high. You feel frustrated by theoretical discussions that don't lead to action, and restless when forced into planning without building.",
        howYouWork: "You prefer clear objectives, defined timelines, and the autonomy to deliver. You're the person teams rely on to turn plans into reality. Your discipline and follow-through are rare gifts. You work best with a clear brief and the freedom to execute.",
        careers: [
            { title: 'Product Manager', why: 'Your reliability, follow-through, and quality standards make you the PM every engineering team wants. You ship.', dayInLife: '9:00 \u2014 Daily standup with engineering team\n9:30 \u2014 Review sprint progress, unblock issues\n10:30 \u2014 Customer call: gather feedback\n12:00 \u2014 Lunch\n13:00 \u2014 Write product requirements document\n14:30 \u2014 Design review with UX team\n16:00 \u2014 Prioritisation meeting: stack-rank the backlog\n17:00 \u2014 Metrics review: how is the feature performing?', entry: ['Technical background + PM bootcamp or certification', 'Start as a project manager or technical writer, transition to PM', 'Build something yourself to demonstrate product thinking'], salary: { junior: '$75,000\u2013$95,000', mid: '$110,000\u2013$145,000', senior: '$150,000\u2013$200,000', director: '$210,000+' }, fiveYear: 'Year 1: Associate PM or project manager\nYear 2\u20133: PM owning a product area\nYear 3\u20134: Senior PM or Group PM\nYear 5: Director of Product or VP Product' },
            { title: 'Software Engineer', why: 'Building tangible digital products, line by line. Your craftsmanship and discipline are exactly what engineering demands.', dayInLife: '9:00 \u2014 Code review: review 2 pull requests\n10:00 \u2014 Deep work: implement new feature\n12:00 \u2014 Lunch + tech talk\n13:00 \u2014 Pair programming session\n14:30 \u2014 Write automated tests\n15:30 \u2014 Architecture discussion with tech lead\n16:30 \u2014 Deploy to staging, verify\n17:00 \u2014 Document what you built', entry: ['CS degree or coding bootcamp (12\u201324 weeks)', 'Self-taught: freeCodeCamp + The Odin Project + build 3 projects', 'Career pivot: any analytical role + learn to code'], salary: { junior: '$70,000\u2013$95,000', mid: '$110,000\u2013$150,000', senior: '$160,000\u2013$220,000', director: '$230,000+' }, fiveYear: 'Year 1: Junior engineer, learn the codebase\nYear 2\u20133: Mid-level engineer, own features end-to-end\nYear 3\u20134: Senior engineer, mentor others\nYear 5: Staff engineer or engineering manager' },
            { title: 'Operations Manager', why: 'The unexpected match: your building instinct applied to systems and processes creates operational excellence.', dayInLife: '8:00 \u2014 Review overnight metrics and incidents\n9:00 \u2014 Team huddle: daily priorities\n10:00 \u2014 Process improvement: map and optimise a workflow\n12:00 \u2014 Lunch\n13:00 \u2014 Vendor management meeting\n14:30 \u2014 Budget review and forecasting\n16:00 \u2014 Cross-functional alignment with other departments\n17:00 \u2014 Document SOPs and best practices', entry: ['Any operational role: logistics, supply chain, customer ops', 'Lean Six Sigma or PMP certification', 'MBA with operations focus'], salary: { junior: '$55,000\u2013$75,000', mid: '$80,000\u2013$115,000', senior: '$120,000\u2013$165,000', director: '$175,000+' }, fiveYear: 'Year 1: Operations coordinator or associate\nYear 2\u20133: Operations manager\nYear 3\u20134: Senior ops manager or director\nYear 5: VP Operations or COO track' }
        ]
    },
    guardian: {
        name: 'The Guardian',
        emoji: '\u{1F6E1}\uFE0F',
        family: 'Executors',
        famousExamples: 'Warren Buffett, Ruth Bader Ginsburg, Florence Nightingale',
        howYouThink: "You think in terms of risk and stability. Your mind automatically scans for what could go wrong, what's been overlooked, and what needs protecting. While others chase innovation, you ensure the foundation holds.",
        howYouFeel: "You feel most at peace when things are orderly and protected. Chaos and uncertainty are genuinely stressful for you \u2014 not because you can't handle them, but because you see the risks others miss. Your emotional stability is your anchor.",
        howYouWork: "You excel in structured roles with clear standards. Quality assurance, compliance, financial analysis \u2014 these are fields where your attention to detail is a superpower, not an obsession. You're the person who reads the contract before signing.",
        careers: [
            { title: 'Financial Analyst / Risk Manager', why: 'Your risk awareness and attention to detail make you a natural in finance. You protect organisations from threats they can\'t see.', dayInLife: '8:00 \u2014 Market scan and risk dashboard review\n9:00 \u2014 Build financial model for new initiative\n10:30 \u2014 Risk assessment meeting with leadership\n12:00 \u2014 Lunch\n13:00 \u2014 Analyse quarterly financial statements\n14:30 \u2014 Compliance check: ensure regulatory alignment\n16:00 \u2014 Write risk report and recommendations\n17:00 \u2014 Update forecasting models', entry: ['Finance or accounting degree', 'CFA or FRM certification for risk management', 'Start in accounting or audit, transition to risk/analytics'], salary: { junior: '$60,000\u2013$80,000', mid: '$90,000\u2013$130,000', senior: '$140,000\u2013$190,000', director: '$200,000+' }, fiveYear: 'Year 1: Financial analyst or audit associate\nYear 2\u20133: Senior analyst or risk specialist\nYear 3\u20134: Risk manager or finance manager\nYear 5: Director of Risk or CFO track' },
            { title: 'Cybersecurity Analyst', why: 'Protecting digital systems from threats is the modern version of your guardian instinct.', dayInLife: '8:00 \u2014 Review overnight security alerts\n9:00 \u2014 Threat hunting: analyse suspicious activity\n10:30 \u2014 Vulnerability assessment of new deployment\n12:00 \u2014 Lunch + security news/research\n13:00 \u2014 Incident response drill with team\n14:30 \u2014 Update security policies and documentation\n16:00 \u2014 Penetration testing or security audit\n17:00 \u2014 Brief leadership on security posture', entry: ['CompTIA Security+ certification (entry-level)', 'CS degree with security focus', 'IT support role + self-study + CTF competitions'], salary: { junior: '$65,000\u2013$85,000', mid: '$95,000\u2013$130,000', senior: '$140,000\u2013$180,000', director: '$190,000+' }, fiveYear: 'Year 1: Junior security analyst or SOC analyst\nYear 2\u20133: Security engineer, specialise in a domain\nYear 3\u20134: Senior security analyst or team lead\nYear 5: CISO track or independent consultant' },
            { title: 'Healthcare Administrator', why: 'The unexpected match: your protective instinct + organisational skill = ensuring healthcare systems work for patients.', dayInLife: '7:30 \u2014 Morning huddle with clinical leadership\n8:30 \u2014 Budget review and resource allocation\n10:00 \u2014 Quality improvement committee meeting\n11:30 \u2014 Patient experience review: analyse feedback\n13:00 \u2014 Lunch\n14:00 \u2014 Regulatory compliance review\n15:30 \u2014 Staff scheduling and capacity planning\n17:00 \u2014 Strategic planning for next quarter', entry: ['MHA (Master of Health Administration) or MBA with healthcare focus', 'Start in hospital administration or clinic operations', 'Nursing or clinical background + management training'], salary: { junior: '$55,000\u2013$75,000', mid: '$80,000\u2013$120,000', senior: '$130,000\u2013$180,000', director: '$190,000+' }, fiveYear: 'Year 1: Administrative coordinator or assistant\nYear 2\u20133: Department manager\nYear 3\u20134: Director of operations\nYear 5: VP or CEO of a healthcare facility' }
        ]
    },
    craftsperson: {
        name: 'The Craftsperson',
        emoji: '\u2728',
        family: 'Executors',
        famousExamples: 'Jiro Ono, Ina Garten, John Ive',
        howYouThink: "While others chase breadth, you pursue depth. Your mind is wired for mastery \u2014 the patient, deliberate process of becoming truly excellent at one thing. You see nuances that others miss because you've invested the time to understand deeply.",
        howYouFeel: "You feel a deep satisfaction in quality work. A job done well is its own reward. You feel frustrated by shortcuts, mediocrity, and environments that value speed over excellence. Your standards aren't perfectionism \u2014 they're craft.",
        howYouWork: "You need time and space to do things properly. Rushing you produces worse outcomes, not faster ones. You work best with a clear domain to own and the freedom to set your own quality bar. Ideal environment: small team of experts who share your standards.",
        careers: [
            { title: 'Specialist Engineer / Artisan Developer', why: 'Your mastery orientation and high standards make you the engineer who writes the code others learn from.', dayInLife: '9:00 \u2014 Deep work: implement complex feature with precision\n11:00 \u2014 Code review: detailed, educational feedback\n12:00 \u2014 Lunch + read technical papers\n13:00 \u2014 Performance optimisation: make it elegant\n15:00 \u2014 Write technical documentation\n16:00 \u2014 Pair with junior developer: teach your craft\n17:00 \u2014 Open source contribution or side project', entry: ['CS degree with focus on a specific domain', 'Self-taught: deep-dive into one technology stack', 'Apprenticeship: find a master engineer and learn from them'], salary: { junior: '$70,000\u2013$90,000', mid: '$110,000\u2013$145,000', senior: '$155,000\u2013$210,000', director: '$220,000+' }, fiveYear: 'Year 1: Junior developer, learn the craft\nYear 2\u20133: Mid-level, develop your specialty\nYear 3\u20134: Senior engineer, recognised expert\nYear 5: Principal engineer or independent consultant' },
            { title: 'UX/UI Designer', why: 'Design is craft applied to human experience. Your attention to detail and quality standards create interfaces that feel right.', dayInLife: '9:00 \u2014 Review user feedback on current designs\n10:00 \u2014 Sketch: explore design concepts (pencil and paper)\n11:00 \u2014 High-fidelity mockup in Figma\n12:00 \u2014 Lunch\n13:00 \u2014 Usability testing: observe users interact with your design\n14:30 \u2014 Iterate based on feedback\n16:00 \u2014 Design system maintenance: ensure consistency\n17:00 \u2014 Inspiration: browse design portfolios and case studies', entry: ['Design bootcamp (Designlab, General Assembly)', 'Self-taught: redesign 5 apps/websites for your portfolio', 'Graphic design background + UX certification'], salary: { junior: '$55,000\u2013$75,000', mid: '$85,000\u2013$120,000', senior: '$130,000\u2013$175,000', director: '$180,000+' }, fiveYear: 'Year 1: Junior designer or design intern\nYear 2\u20133: Product designer with growing portfolio\nYear 3\u20134: Senior designer or design lead\nYear 5: Principal designer or design director' },
            { title: 'Technical Writer / Documentation Engineer', why: 'The unexpected match: your craft instinct applied to words creates documentation that developers actually read and love.', dayInLife: '9:00 \u2014 Review recent code changes: what needs documenting?\n10:00 \u2014 Write: API reference documentation\n11:30 \u2014 Interview engineer about a complex feature\n12:00 \u2014 Lunch\n13:00 \u2014 Create tutorial: step-by-step guide with code samples\n15:00 \u2014 Review documentation PRs from other writers\n16:00 \u2014 Information architecture: reorganise docs structure\n17:00 \u2014 Test: try following your own tutorial to verify accuracy', entry: ['Technical background + strong writing skills', 'Documentation contribution to open source projects', 'Technical communication degree or certification'], salary: { junior: '$60,000\u2013$80,000', mid: '$85,000\u2013$115,000', senior: '$120,000\u2013$160,000', director: '$170,000+' }, fiveYear: 'Year 1: Junior technical writer\nYear 2\u20133: Technical writer owning a product\'s documentation\nYear 3\u20134: Senior writer or documentation lead\nYear 5: Head of Documentation or Developer Experience lead' }
        ]
    }
};

// ---- Big Five trait interpretation templates ----
const BIG_FIVE_LABELS = {
    O: { name: 'Openness', highDesc: 'more curious, creative, and novelty-seeking', lowDesc: 'more practical, conventional, and grounded', workHigh: 'you generate ideas effortlessly, get bored by routine, and need variety to stay engaged. Best environments: startups, R&D, creative agencies.', workLow: 'you prefer proven methods, predictable workflows, and clear processes. Best environments: established companies, operations, quality assurance.', riskHigh: 'May lose interest in projects after the creative phase ends.', riskLow: 'May resist beneficial changes or new approaches.' },
    C: { name: 'Conscientiousness', highDesc: 'more organised, goal-driven, and disciplined', lowDesc: 'more flexible, spontaneous, and adaptive', workHigh: 'you finish what you start and hold yourself to high standards. Naturally suited to project management, structured roles, and any environment that rewards discipline.', workLow: 'you adapt quickly to changing priorities and prefer flexibility over rigid plans. Best in creative, fast-paced environments.', riskHigh: 'May become rigid or overly critical of others\' work standards.', riskLow: 'May struggle with long-term follow-through on complex projects.' },
    E: { name: 'Extraversion', highDesc: 'more outgoing, energetic, and socially driven', lowDesc: 'more reserved, reflective, and independent', workHigh: 'you thrive in collaborative, high-energy environments. You build relationships naturally and draw energy from teamwork.', workLow: 'you do your best thinking alone and prefer deep work over constant collaboration.', riskHigh: 'May struggle with sustained solo focus work.', riskLow: 'May need to push yourself to network and self-promote.' },
    A: { name: 'Agreeableness', highDesc: 'more cooperative, empathetic, and team-oriented', lowDesc: 'more direct, competitive, and analytically detached', workHigh: 'you excel in team environments and naturally mediate conflicts. Your empathy makes you a trusted colleague.', workLow: 'you make tough decisions without emotional interference and give direct feedback. Valuable in leadership and negotiation.', riskHigh: 'May avoid necessary confrontation or sacrifice your needs for others.', riskLow: 'May come across as insensitive even when your analysis is correct.' },
    N: { name: 'Neuroticism (reversed: Emotional Stability)', highDesc: 'more emotionally reactive and sensitive', lowDesc: 'more emotionally stable and resilient', workHigh: 'you detect problems early because you\'re tuned to what could go wrong. Use this awareness strategically while building coping skills.', workLow: 'you stay focused under pressure. This is a genuine asset in high-stakes environments.', riskHigh: 'May experience burnout without strong self-care practices.', riskLow: 'May underestimate others\' emotional needs or stress levels.' }
};

// ---- Schwartz Values labels ----
const VALUES_LABELS = {
    SD: { name: 'Self-Direction', desc: 'Freedom to think and act independently. You need autonomy over your work, the freedom to ask your own questions, and control over your method.', burnout: 'Micromanagement, rigid hierarchies, or being told exactly how to do your job.', question: '"How much autonomy would I have in this role? Can you describe a recent decision you made independently?"' },
    ST: { name: 'Stimulation', desc: 'Novelty, excitement, and challenge. You need variety and new experiences to stay engaged.', burnout: 'Repetitive tasks, predictable routine, or a role that stopped challenging you years ago.', question: '"What\'s the most interesting project your team has worked on recently? How often do priorities or projects change?"' },
    HE: { name: 'Hedonism', desc: 'Pleasure and enjoyment in what you do. Work should feel good, not just pay well.', burnout: 'Joyless grind culture, toxic environment, or work that feels meaningless despite good pay.', question: '"How would you describe the team culture? What do people here enjoy most about working here?"' },
    AC: { name: 'Achievement', desc: 'Personal success and demonstrated competence. You need to see measurable progress and recognition for excellence.', burnout: 'Roles with no metrics, no feedback, or no visible impact. Feeling invisible.', question: '"How is success measured in this role? How often do people get promoted? Can you share an example of someone who excelled?"' },
    PO: { name: 'Power', desc: 'Influence, leadership, and social status. You want to shape decisions and lead others.', burnout: 'Being powerless, voiceless in decisions, or stuck in a role with no influence.', question: '"What decisions would I own? How much influence does this role have on company direction?"' },
    SE: { name: 'Security', desc: 'Safety, stability, and predictability. You need a foundation you can trust.', burnout: 'Constant restructuring, unstable companies, or roles where your future is uncertain.', question: '"What\'s the company\'s financial runway? How long has the average person been in this team?"' },
    CF: { name: 'Conformity', desc: 'Respect for rules, traditions, and social expectations. You value working within established systems.', burnout: 'Chaotic environments, rule-breaking cultures, or pressure to cut corners.', question: '"How well-documented are your processes? What\'s your approach to compliance and quality standards?"' },
    TR: { name: 'Tradition', desc: 'Respect for customs, heritage, and long-standing practices. You value continuity and proven approaches.', burnout: 'Constant disruption for its own sake, or environments that dismiss proven methods.', question: '"How does the company balance innovation with maintaining what already works well?"' },
    BE: { name: 'Benevolence', desc: 'Caring for the wellbeing of people close to you. You need to feel that your work helps real people.', burnout: 'Work that harms people, extractive business models, or environments where people are treated as resources.', question: '"How does this role impact real people? Can you tell me about a time the team went above and beyond for someone?"' },
    UN: { name: 'Universalism', desc: 'Social justice, equality, and protecting the vulnerable. You want your work to make the world better.', burnout: 'Working for organisations that cause harm, inequality, or environmental damage.', question: '"What\'s the company\'s stance on social responsibility? How does the team contribute to the broader community?"' }
};

// ---- PDF Generation ----

function normaliseScores(scores) {
    // Normalise each score to 0-100 percentile (rough approximation)
    // Max possible per dimension depends on questions, but typical range is 0-12
    const maxScore = 12;
    const normalised = {};
    for (const [key, val] of Object.entries(scores)) {
        normalised[key] = Math.min(100, Math.max(0, Math.round((val / maxScore) * 100)));
    }
    return normalised;
}

function getTopValues(scores, n = 3) {
    const valueKeys = ['SD', 'ST', 'HE', 'AC', 'PO', 'SE', 'CF', 'TR', 'BE', 'UN'];
    return valueKeys
        .filter(k => scores[k] !== undefined)
        .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
        .slice(0, n);
}

function getStrengthDomains(scores) {
    const domains = {
        'Strategic Thinking': scores.STR || 0,
        'Relationship Building': scores.REL || 0,
        'Influencing': scores.INF || 0,
        'Executing': scores.EXE || 0
    };
    return Object.entries(domains).sort((a, b) => b[1] - a[1]);
}

async function generateReport({ quizResult, email }) {
    console.log(`[report] Generating Clarity Pro report for ${email}`);
    console.log(`[report] Archetype: ${quizResult.archetype}`);

    const archKey = quizResult.archetype;
    const profile = ARCHETYPE_PROFILES[archKey];
    if (!profile) {
        throw new Error(`Unknown archetype: ${archKey}`);
    }

    const scores = quizResult.scores || {};
    const norm = normaliseScores(scores);
    const topValues = getTopValues(scores);
    const strengthDomains = getStrengthDomains(scores);

    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 50, right: 50 },
        info: {
            Title: `Pathlit Clarity Pro Report - ${profile.name}`,
            Author: 'Pathlit',
            Subject: 'Personalised Career Blueprint',
            Creator: 'Pathlit (pathlit.vercel.app)'
        }
    });

    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));

    const pdfReady = new Promise((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
    });

    const W = doc.page.width - 100; // content width

    // ---- Helper functions ----
    function heading(text, size = 22) {
        doc.font('Helvetica-Bold').fontSize(size).fillColor(COLORS.dark).text(text);
        doc.moveDown(0.3);
    }

    function subheading(text, size = 16) {
        doc.font('Helvetica-Bold').fontSize(size).fillColor(COLORS.orange).text(text);
        doc.moveDown(0.2);
    }

    function body(text, opts = {}) {
        doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.text).text(text, { lineGap: 3, ...opts });
    }

    function muted(text) {
        doc.font('Helvetica').fontSize(9).fillColor(COLORS.muted).text(text, { lineGap: 2 });
    }

    function spacer(n = 0.5) {
        doc.moveDown(n);
    }

    function drawBar(label, pct, x, y, width) {
        const barH = 14;
        const labelW = 130;
        doc.font('Helvetica').fontSize(9).fillColor(COLORS.text).text(label, x, y + 1, { width: labelW });
        // Background bar
        doc.roundedRect(x + labelW, y, width - labelW - 40, barH, 4).fill(COLORS.lightGray);
        // Fill bar
        const fillW = Math.max(4, ((width - labelW - 40) * pct) / 100);
        doc.roundedRect(x + labelW, y, fillW, barH, 4).fill(COLORS.orange);
        // Percentage text
        doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.dark).text(`${pct}%`, x + width - 35, y + 1, { width: 35, align: 'right' });
    }

    function pageBreak() {
        doc.addPage();
    }

    function drawDivider() {
        const y = doc.y;
        doc.moveTo(50, y).lineTo(50 + W, y).strokeColor(COLORS.lightGray).lineWidth(1).stroke();
        doc.moveDown(0.5);
    }

    function ensureSpace(needed) {
        if (doc.y + needed > doc.page.height - 80) {
            pageBreak();
        }
    }

    // ========== PAGE 1: COVER ==========
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.dark);

    // Orange accent circle
    doc.circle(doc.page.width / 2, 200, 60).fill(COLORS.orange);
    doc.font('Helvetica-Bold').fontSize(48).fillColor(COLORS.white)
        .text(profile.emoji, 0, 172, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(28).fillColor(COLORS.white)
        .text(profile.name, 0, 290, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica').fontSize(14).fillColor(COLORS.amber)
        .text('Your Personalised Career Blueprint', 0, 330, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica').fontSize(11).fillColor('#9CA3AF')
        .text(`Prepared for: ${email || 'Pathlit User'}`, 0, 400, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica').fontSize(10).fillColor('#6B7280')
        .text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 0, 420, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.orange)
        .text('CLARITY PRO REPORT', 0, 500, { width: doc.page.width, align: 'center' });

    doc.font('Helvetica').fontSize(9).fillColor('#6B7280')
        .text('pathlit.vercel.app', 0, doc.page.height - 80, { width: doc.page.width, align: 'center' });

    // ========== PAGE 2: FULL ARCHETYPE PROFILE ==========
    pageBreak();
    heading(`${profile.emoji} ${profile.name}`, 24);
    doc.font('Helvetica').fontSize(11).fillColor(COLORS.muted)
        .text(`Family: ${profile.family}  |  Famous examples: ${profile.famousExamples}`);
    spacer(0.5);
    drawDivider();

    subheading('How You Think');
    body(profile.howYouThink);
    spacer(0.8);

    subheading('How You Feel');
    body(profile.howYouFeel);
    spacer(0.8);

    subheading('How You Work');
    body(profile.howYouWork);

    // ========== PAGE 3: BIG FIVE DEEP-DIVE ==========
    pageBreak();
    heading('Your Personality: Big Five Profile', 22);
    muted('Based on the NEO-PI-R framework (Costa & McCrae, 1992) \u2014 the most validated personality model in psychology, with over 20,000 citations.');
    spacer(0.5);

    const bigFiveKeys = ['O', 'C', 'E', 'A', 'N'];
    let barY = doc.y;
    for (const key of bigFiveKeys) {
        const pct = norm[key] || 50;
        drawBar(BIG_FIVE_LABELS[key].name, pct, 50, barY, W);
        barY += 24;
    }
    doc.y = barY + 10;
    drawDivider();

    for (const key of bigFiveKeys) {
        ensureSpace(120);
        const trait = BIG_FIVE_LABELS[key];
        const pct = norm[key] || 50;
        const isHigh = pct >= 50;

        subheading(`${trait.name}: ${pct}th percentile`, 13);
        body(`You scored in the ${pct}th percentile for ${trait.name} \u2014 meaning you're ${isHigh ? trait.highDesc : trait.lowDesc} than ${isHigh ? pct : 100 - pct}% of people. At work, this means: ${isHigh ? trait.workHigh : trait.workLow}`);
        spacer(0.2);
        muted(`Growth edge: ${isHigh ? trait.riskHigh : trait.riskLow}`);
        spacer(0.6);
    }

    // ========== PAGE 4: PERSONALITY AT WORK ==========
    pageBreak();
    heading('Personality at Work', 22);
    muted('How your unique Big Five combination affects your professional life (Judge et al., 2002).');
    spacer(0.5);

    const oScore = norm.O || 50;
    const cScore = norm.C || 50;
    const eScore = norm.E || 50;
    const aScore = norm.A || 50;
    const nScore = norm.N || 50;

    subheading('Team Dynamics');
    const teamStyle = eScore >= 50
        ? `Your higher Extraversion (${eScore}th percentile) means you naturally energise group settings. You're the person who keeps meetings productive and morale high.`
        : `Your more reserved nature (Extraversion: ${eScore}th percentile) means you bring thoughtfulness to team settings. You're the person who listens carefully and contributes high-quality insights.`;
    body(teamStyle + ` Combined with your Agreeableness (${aScore}th percentile), you ${aScore >= 50 ? 'build consensus naturally and make people feel heard' : 'bring directness and honest feedback that teams need, even when it\u2019s uncomfortable'}.`);
    spacer(0.6);

    subheading('Communication Style');
    body(`You communicate ${eScore >= 50 ? 'energetically and persuasively' : 'thoughtfully and precisely'}. Your ${oScore >= 50 ? 'high Openness means you naturally use metaphors and creative framing' : 'practical Openness means you prefer clear, concrete language'}. Others perceive you as ${aScore >= 50 ? 'warm and approachable' : 'direct and competent'}.`);
    spacer(0.6);

    subheading('Conflict Handling');
    body(`When conflict arises, you tend to ${aScore >= 50 ? 'seek compromise and harmony. Your instinct is to find common ground before asserting your position.' : 'address it head-on. You\'d rather have an uncomfortable conversation now than let resentment build.'} Your emotional stability (${100 - nScore}th percentile) means you ${nScore <= 50 ? 'stay calm under pressure, which helps you de-escalate tense situations' : 'feel conflict intensely, which actually gives you valuable data about what\'s going wrong'}.`);
    spacer(0.6);

    subheading('Decision-Making');
    body(`You make decisions ${cScore >= 50 ? 'methodically and thoroughly. You gather data, consider options, and commit with confidence.' : 'quickly and intuitively. You trust your instincts and adapt as new information emerges.'} Your ${oScore >= 50 ? 'creativity means you often consider unconventional options that others miss.' : 'pragmatism means you focus on what\'s proven to work.'}`);
    spacer(0.6);

    subheading('Stress Response');
    body(`Under pressure, you ${nScore <= 50 ? 'maintain focus and composure. Your low Neuroticism (' + (100 - nScore) + 'th percentile stability) is a genuine superpower in high-stakes environments.' : 'feel things intensely, which gives you early warning about problems. Channel this awareness into preparation and proactive problem-solving.'} ${cScore >= 50 ? 'Your discipline helps you maintain structure even when things get chaotic.' : 'Your flexibility lets you pivot quickly when the plan falls apart.'}`);

    // ========== PAGE 5: STRENGTHS MAP ==========
    pageBreak();
    heading('Your Strengths Map', 22);
    muted('Based on the VIA Character Strengths framework (Seligman & Peterson, 2004). Research shows using your top strengths daily increases happiness by 18%.');
    spacer(0.5);

    // Strength domain bars
    barY = doc.y;
    for (const [domain, score] of strengthDomains) {
        const pct = Math.min(100, Math.max(0, Math.round((score / 12) * 100)));
        drawBar(domain, pct, 50, barY, W);
        barY += 24;
    }
    doc.y = barY + 10;
    drawDivider();

    // Top strengths from archetype
    subheading('Your Top 5 Strengths');
    spacer(0.3);
    const strengths = profile.careers ? ARCHETYPE_PROFILES[archKey]?.careers?.[0] : null;
    const archStrengths = ARCHETYPE_PROFILES[archKey];
    if (archStrengths) {
        const strengthsList = [
            { name: strengthDomains[0][0], desc: `Your dominant strength domain. This is where you naturally excel and where you should spend most of your professional energy. Look for roles that require ${strengthDomains[0][0].toLowerCase()} as a core competency.` },
            { name: strengthDomains[1][0], desc: `Your secondary strength. This complements your primary domain and gives you a unique combination that few people share. The intersection of ${strengthDomains[0][0].toLowerCase()} and ${strengthDomains[1][0].toLowerCase()} is where your most distinctive contributions will come from.` },
            ...((ARCHETYPE_PROFILES[archKey]?.careers?.[0]?.title ? [
                { name: 'Pattern Recognition', desc: `As ${profile.name}, you naturally see connections that others miss. This week: take 15 minutes to map the hidden patterns in a problem you're facing.` },
                { name: 'Depth of Focus', desc: 'Your ability to concentrate deeply on complex problems is increasingly rare and valuable. Protect your deep work time.' },
                { name: 'Quality Standards', desc: 'Your instinct for excellence means your work consistently exceeds expectations. This is a career accelerator.' }
            ] : []))
        ];

        for (let i = 0; i < Math.min(5, strengthsList.length); i++) {
            ensureSpace(60);
            doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.dark)
                .text(`${i + 1}. ${strengthsList[i].name}`);
            body(strengthsList[i].desc);
            spacer(0.4);
        }
    }

    // ========== PAGE 6: VALUES COMPASS ==========
    pageBreak();
    heading('Your Values Compass', 22);
    muted('Based on the Schwartz Values framework (1992, 2012) \u2014 validated across 82 countries. Values are your non-negotiables.');
    spacer(0.5);

    subheading('Your Top 3 Values');
    spacer(0.3);

    for (let i = 0; i < topValues.length; i++) {
        ensureSpace(80);
        const valKey = topValues[i];
        const val = VALUES_LABELS[valKey];
        if (!val) continue;

        doc.font('Helvetica-Bold').fontSize(13).fillColor(COLORS.orange)
            .text(`${i + 1}. ${val.name}`);
        body(val.desc);
        spacer(0.5);
    }

    drawDivider();

    // Value conflicts
    subheading('Value Conflicts to Watch');
    body('Some values naturally tension each other. Understanding your internal conflicts prevents decision paralysis:');
    spacer(0.3);

    const v1 = VALUES_LABELS[topValues[0]]?.name || 'Your top value';
    const v2 = VALUES_LABELS[topValues[1]]?.name || 'Your second value';
    const v3 = VALUES_LABELS[topValues[2]]?.name || 'Your third value';
    body(`\u2022 ${v1} + ${v2}: These values ${topValues[0] === 'SD' && topValues[1] === 'CF' ? 'can conflict \u2014 you want freedom but also structure. Find environments that provide a clear framework within which you have autonomy.' : 'generally reinforce each other. Look for roles that honour both simultaneously.'}`);
    spacer(0.2);
    body(`\u2022 The career filter: Only consider roles that honour at least your top 2 values (${v1} and ${v2}). A high salary will not compensate for value misalignment.`);

    // ========== PAGE 7: VALUES + CAREER ALIGNMENT ==========
    pageBreak();
    heading('Values + Career Alignment', 22);
    muted('Kristof-Brown (2005): value-job misalignment is a stronger predictor of burnout than workload.');
    spacer(0.5);

    body('"When your values are honoured at work, you feel energised. When they\'re violated, you burn out." Here\'s how to protect yourself:');
    spacer(0.5);

    for (let i = 0; i < topValues.length; i++) {
        ensureSpace(100);
        const valKey = topValues[i];
        const val = VALUES_LABELS[valKey];
        if (!val) continue;

        subheading(`${val.name}: What to Watch For`, 13);
        spacer(0.2);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.text).text('Burnout trigger:');
        body(val.burnout);
        spacer(0.2);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.text).text('Interview question to ask:');
        body(val.question);
        spacer(0.5);
    }

    // ========== PAGES 8-9: CAREER PATH 1 (PRIMARY) ==========
    pageBreak();
    heading('Career Path 1: Primary Match', 22);
    const career1 = profile.careers[0];
    doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.orange).text(career1.title);
    spacer(0.5);

    subheading('Why This Matches You');
    body(career1.why);
    spacer(0.5);

    subheading('A Day in the Life');
    body(career1.dayInLife);
    spacer(0.5);

    ensureSpace(120);
    subheading('Entry Paths');
    for (const entry of career1.entry) {
        body(`\u2022 ${entry}`);
    }
    spacer(0.5);

    ensureSpace(100);
    subheading('Salary Range (2026)');
    body(`\u2022 Junior: ${career1.salary.junior}`);
    body(`\u2022 Mid-level: ${career1.salary.mid}`);
    body(`\u2022 Senior / Lead: ${career1.salary.senior}`);
    body(`\u2022 Director+: ${career1.salary.director}`);
    spacer(0.5);

    ensureSpace(100);
    subheading('5-Year Path');
    body(career1.fiveYear);

    // ========== PAGE 10: CAREER PATH 2 (SECONDARY) ==========
    pageBreak();
    heading('Career Path 2: Secondary Match', 22);
    const career2 = profile.careers[1];
    doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.orange).text(career2.title);
    spacer(0.5);

    subheading('Why This Matches You');
    body(career2.why);
    spacer(0.5);

    subheading('A Day in the Life');
    body(career2.dayInLife);
    spacer(0.5);

    ensureSpace(120);
    subheading('Entry Paths');
    for (const entry of career2.entry) {
        body(`\u2022 ${entry}`);
    }
    spacer(0.5);

    ensureSpace(100);
    subheading('Salary Range (2026)');
    body(`\u2022 Junior: ${career2.salary.junior}`);
    body(`\u2022 Mid-level: ${career2.salary.mid}`);
    body(`\u2022 Senior / Lead: ${career2.salary.senior}`);
    body(`\u2022 Director+: ${career2.salary.director}`);
    spacer(0.5);

    ensureSpace(100);
    subheading('5-Year Path');
    body(career2.fiveYear);
    spacer(0.5);

    subheading('Compared to Path 1');
    body(`Path 1 (${career1.title}) offers more ${career1.salary.senior > career2.salary.senior ? 'earning potential' : 'creative freedom'}. Path 2 (${career2.title}) offers ${career2.salary.senior > career1.salary.senior ? 'higher earning potential' : 'different daily work and new challenges'}. Choose based on which daily experience excites you more.`);

    // ========== PAGE 11: CAREER PATH 3 (UNEXPECTED) ==========
    pageBreak();
    heading('Career Path 3: The Unexpected Match', 22);
    muted('This is the non-obvious career that matches your profile in surprising ways.');
    spacer(0.3);
    const career3 = profile.careers[2];
    doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.accent).text(career3.title);
    spacer(0.5);

    subheading('Why This Matches You');
    body(career3.why);
    spacer(0.5);

    subheading('A Day in the Life');
    body(career3.dayInLife);
    spacer(0.5);

    ensureSpace(120);
    subheading('Entry Paths');
    for (const entry of career3.entry) {
        body(`\u2022 ${entry}`);
    }
    spacer(0.5);

    ensureSpace(100);
    subheading('Salary Range (2026)');
    body(`\u2022 Junior: ${career3.salary.junior}`);
    body(`\u2022 Mid-level: ${career3.salary.mid}`);
    body(`\u2022 Senior / Lead: ${career3.salary.senior}`);
    body(`\u2022 Director+: ${career3.salary.director}`);
    spacer(0.5);

    ensureSpace(100);
    subheading('5-Year Path');
    body(career3.fiveYear);

    // ========== PAGES 12-13: 30-DAY ACTION PLAN ==========
    pageBreak();
    heading('Your 30-Day Action Plan', 22);
    muted('Gollwitzer (1999): Specific if-then plans increase goal attainment from 22% to 62%.');
    spacer(0.5);

    // Week 1
    subheading('WEEK 1: Self-Reflection');
    body(`Day 1: Re-read your full archetype profile (${profile.name}). Highlight the 3 sentences that feel most true.`);
    body('Day 2: Journal prompt: "When was the last time I felt completely in flow at work or school? What was I doing?"');
    body('Day 3: List 5 moments in the last year where you felt energised and 5 where you felt drained.');
    body(`Day 4: Review your values analysis. Ask: "Is my current situation honouring my top 2 values (${v1} and ${v2})?"`);
    body('Day 5\u20137: Share your archetype with 2 friends. Ask them: "Does this sound like me? What would you add?"');
    spacer(0.5);

    // Week 2
    ensureSpace(120);
    subheading('WEEK 2: Research');
    body(`Day 8: Google your 3 career paths (${career1.title}, ${career2.title}, ${career3.title}). Read 3 articles about each.`);
    body(`Day 9: Find 5 people on LinkedIn who hold your Primary Career Path role (${career1.title}). Study their profiles.`);
    body(`Day 10: Watch 2 YouTube videos: "Day in the life of a ${career1.title.split('/')[0].trim()}."`);
    body('Day 11: Check job postings for your top career. What skills do they require? Which do you already have?');
    body('Day 12\u201314: Take one free online course related to your primary path (see Resources page).');
    spacer(0.5);

    // Week 3
    ensureSpace(120);
    subheading('WEEK 3: Conversations');
    body('Day 15: Message 2 of the LinkedIn people you found. Use this script:');
    body(`"Hi [Name], I'm exploring a career in ${career1.title.split('/')[0].trim()}. I'd love to hear about your experience \u2014 would you be open to a 15-minute call?"`, { indent: 20 });
    body('Day 16: Talk to 1 person in your network who works in a related field.');
    body('Day 17\u201318: Ask 3 people who know you well: "What do you think I\'m naturally best at?"');
    body('Day 19\u201321: Reflect: which career path gets you most excited after talking to real people?');
    spacer(0.5);

    // Week 4
    ensureSpace(140);
    subheading('WEEK 4: Experiment');
    body('Day 22: Pick ONE career path to micro-test.');
    body('Day 23\u201325: Do a 3-hour project that simulates the work: write a research report, design a lesson plan, build a prototype, create a content piece.');
    body('Day 26\u201327: Share the project with someone in the field. Ask for honest feedback.');
    body('Day 28: Journal: "How did this feel? Do I want more of this?"');
    body('Day 29\u201330: Make a decision: pursue, pivot, or keep exploring. Set 3 goals for the next 30 days.');

    // ========== PAGE 14: RESOURCES ==========
    pageBreak();
    heading('Resources', 22);
    muted('Curated for your specific career paths and archetype.');
    spacer(0.5);

    for (let i = 0; i < profile.careers.length; i++) {
        ensureSpace(100);
        subheading(`For ${profile.careers[i].title}:`);
        body('\u2022 Free courses: Coursera, edX, and freeCodeCamp have relevant programmes');
        body('\u2022 Book: "Designing Your Life" by Bill Burnett & Dave Evans');
        body('\u2022 Podcast: "The Career Clarity Show" or "How I Built This"');
        body('\u2022 Community: Join relevant subreddits, Discord servers, or LinkedIn groups');
        body('\u2022 Follow: Search LinkedIn for leaders in this space and engage with their content');
        spacer(0.4);
    }

    drawDivider();
    subheading('General Resources');
    body('\u2022 Career exploration: O*NET OnLine (onetonline.org) \u2014 the gold standard for career data');
    body('\u2022 Salary research: Glassdoor, Levels.fyi (tech), Payscale');
    body('\u2022 Networking: Lunchclub, ADPList (free mentoring)');
    body('\u2022 Mental health: If career uncertainty is causing anxiety, talk to a professional. BetterHelp, Talkspace, or your local services.');
    body('\u2022 Pathlit community: Join other quiz-takers at pathlit.vercel.app');

    // ========== PAGE 15: SUMMARY CARD ==========
    pageBreak();
    heading('Your Summary Card', 22);
    muted('Save this page. Share it on LinkedIn or Instagram.');
    spacer(1);

    // Card background
    const cardX = 70;
    const cardY = doc.y;
    const cardW = W - 40;
    const cardH = 320;

    doc.roundedRect(cardX, cardY, cardW, cardH, 16).fill(COLORS.dark);

    // Card content
    doc.font('Helvetica-Bold').fontSize(36).fillColor(COLORS.white)
        .text(profile.emoji, cardX, cardY + 25, { width: cardW, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(22).fillColor(COLORS.white)
        .text(profile.name, cardX, cardY + 75, { width: cardW, align: 'center' });

    doc.font('Helvetica').fontSize(11).fillColor(COLORS.amber)
        .text(`"${ARCHETYPE_PROFILES[archKey]?.careers?.[0]?.title ? profile.name.replace('The ', '') + ' archetype' : profile.name}"`, cardX + 30, cardY + 110, { width: cardW - 60, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#9CA3AF')
        .text('TOP STRENGTHS', cardX, cardY + 150, { width: cardW, align: 'center' });

    doc.font('Helvetica').fontSize(11).fillColor(COLORS.white)
        .text(strengthDomains.slice(0, 3).map(d => d[0]).join('  \u2022  '), cardX, cardY + 168, { width: cardW, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#9CA3AF')
        .text('PRIMARY CAREER PATH', cardX, cardY + 205, { width: cardW, align: 'center' });

    doc.font('Helvetica').fontSize(12).fillColor(COLORS.orange)
        .text(career1.title, cardX, cardY + 223, { width: cardW, align: 'center' });

    doc.font('Helvetica').fontSize(9).fillColor('#6B7280')
        .text('pathlit.vercel.app', cardX, cardY + cardH - 35, { width: cardW, align: 'center' });

    // Footer
    doc.y = cardY + cardH + 30;
    drawDivider();
    spacer(0.3);
    muted('This report was generated by Pathlit based on your responses to 40 research-backed questions measuring personality (Big Five), interests (Holland Codes), values (Schwartz), and strengths. The career recommendations are personalised to your unique profile.');
    spacer(0.3);
    muted('Research references: Costa & McCrae (1992), Holland (1997), Schwartz (2012), Seligman & Peterson (2004), Judge et al. (2002), Gollwitzer (1999), Kristof-Brown (2005).');
    spacer(0.3);
    muted('\u00A9 2026 Pathlit. All rights reserved. pathlit.vercel.app');

    // ---- Finalise ----
    doc.end();
    const pdfBuffer = await pdfReady;

    console.log(`[report] PDF generated: ${pdfBuffer.length} bytes, ${doc.bufferedPageRange().count} pages`);

    return {
        status: 'generated',
        pdfBuffer,
        pageCount: doc.bufferedPageRange().count,
        archetype: profile.name
    };
}

async function sendReportEmail({ email, pdfBuffer }) {
    console.log(`[report] Sending report email to ${email}`);
    // TODO: Implement with SendGrid or similar
    // For now, we store the PDF and provide a download link
    return { sent: false, message: 'Email delivery coming soon. PDF stored for download.' };
}

module.exports = {
    generateReport,
    sendReportEmail,
    ARCHETYPE_PROFILES
};
