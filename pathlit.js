// PATHLIT — Site JavaScript
// Quiz engine, scoring, archetype assignment, hamburger menu, FAQ accordion, animations

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    //  MOBILE HAMBURGER MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ==========================================
    //  FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    //  SCROLL ANIMATIONS
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.benefit-card, .step-card, .testimonial-card, .stat-card, .feature-item, .trust-badge, .glass-card, .archetype-card'
    ).forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ==========================================
    //  NAVBAR SHADOW
    // ==========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.style.boxShadow = window.scrollY > 10
                ? '0 4px 24px rgba(0,0,0,0.06)'
                : 'none';
        }, { passive: true });
    }

    // ==========================================
    //  PARALLAX BLOBS
    // ==========================================
    if (window.innerWidth > 768) {
        const blobs = document.querySelectorAll('.gradient-blob');
        let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
        }, { passive: true });

        function animateBlobs() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            blobs.forEach((blob, i) => {
                const factor = (i % 3 + 1) * 0.4;
                blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
            });
            requestAnimationFrame(animateBlobs);
        }
        animateBlobs();
    }

    // ==========================================
    //  QUIZ ENGINE
    // ==========================================
    if (!document.getElementById('quizSection')) return;

    // --- FULL 40-QUESTION BANK ---
    const questions = [
        // SECTION A: Who You Are (Big Five) — Q1-Q12
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "It's Friday night. You have zero plans. What sounds most like you?",
            options: [
                { text: 'Text a group chat: "Who\'s out tonight?" and make something happen', scores: { E: 2 } },
                { text: 'Call one close friend for a deep conversation at a quiet bar', scores: { E: -1, A: 1 } },
                { text: 'Stay in, explore a random Wikipedia rabbit hole or new podcast', scores: { O: 2 } },
                { text: 'Plan tomorrow: meal prep, clean the apartment, set up the week', scores: { C: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'Your friend asks you to try a completely new hobby this weekend — pottery, rock climbing, improv comedy. Your gut reaction?',
            options: [
                { text: '"Yes! When do we start?" — I love trying new things', scores: { O: 2 } },
                { text: '"Maybe — tell me more first." — I need to think it through', scores: { O: 1, C: 1 } },
                { text: '"Can we do something I already know I\'m good at instead?"', scores: { O: -1 } },
                { text: '"I\'d rather watch a tutorial first and go next week prepared"', scores: { O: -1, C: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "You're working on a group project. One person isn't pulling their weight. What do you do?",
            options: [
                { text: 'Talk to them directly: "Hey, I noticed you\'re behind — what\'s going on?"', scores: { A: 1, E: 1 } },
                { text: 'Pick up their slack quietly to avoid conflict', scores: { A: 2 } },
                { text: "Bring it up in the group so everyone's accountable", scores: { E: 2, A: -1 } },
                { text: 'Restructure the project plan so their part is smaller', scores: { C: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "When you're stressed, what's your default coping strategy?",
            options: [
                { text: 'Talk it out with someone I trust', scores: { E: 2, N: -1 } },
                { text: 'Go for a run, gym, or long walk', scores: { N: -1, C: 1 } },
                { text: 'Make a list and start solving problems one by one', scores: { C: 2, N: -1 } },
                { text: 'Withdraw and process it internally before doing anything', scores: { N: 1, E: -1 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "Imagine you're at a networking event. 50 strangers. What happens?",
            options: [
                { text: "I work the room — I'll talk to 15 people before the night's over", scores: { E: 2 } },
                { text: 'I find 2–3 interesting people and have real conversations', scores: { E: 1, A: 1 } },
                { text: 'I feel drained after 30 minutes and look for the exit', scores: { E: -2 } },
                { text: 'I bring a friend so I have a home base', scores: { E: -1, A: 1 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "Someone gives you strong criticism on work you're proud of. Honest reaction?",
            options: [
                { text: "I feel hurt but try to see if there's truth in it", scores: { N: 1, A: 1 } },
                { text: 'I get defensive at first, then calm down and reflect', scores: { N: 1, O: 1 } },
                { text: 'I appreciate direct feedback — it helps me improve', scores: { N: -2, C: 1 } },
                { text: 'I spiral a bit — criticism hits me harder than I wish it did', scores: { N: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'Your desk/workspace looks like:',
            options: [
                { text: "Organised chaos — I know where everything is even if others don't", scores: { O: 1 } },
                { text: 'Clean and minimal. Everything has a place.', scores: { C: 2 } },
                { text: 'Covered in sticky notes, books, half-finished projects', scores: { O: 2, C: -1 } },
                { text: "I don't really have a fixed workspace — I work from everywhere", scores: { O: 1, C: -1 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'A friend comes to you with a problem. What\'s your instinct?',
            options: [
                { text: 'Listen first, then help them see the situation clearly', scores: { A: 1, O: 1 } },
                { text: 'Give practical advice: "Here\'s what I\'d do..."', scores: { C: 1, E: 1 } },
                { text: 'Just listen — they probably need to vent, not solutions', scores: { A: 2 } },
                { text: 'Research the problem and send them useful articles/resources', scores: { O: 2, C: 1 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'You get an unexpected day off. No obligations. What do you actually do?',
            options: [
                { text: 'Something spontaneous — road trip, new restaurant, explore', scores: { O: 2, E: 1 } },
                { text: "Catch up on personal projects and goals I've been postponing", scores: { C: 2 } },
                { text: 'Sleep in, recharge, do absolutely nothing productive', scores: { N: 1, E: -1 } },
                { text: "Learn something new — online course, documentary, book", scores: { O: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: "In a group setting, you're most often the person who:",
            options: [
                { text: 'Brings the energy — I keep things moving and fun', scores: { E: 2 } },
                { text: 'Brings the plan — I organise and make sure things happen', scores: { C: 2 } },
                { text: 'Brings the ideas — I see connections others miss', scores: { O: 2 } },
                { text: 'Brings the glue — I make sure everyone feels included', scores: { A: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'When making a big life decision, you tend to:',
            options: [
                { text: "Go with your gut — you usually know intuitively what's right", scores: { O: 1, E: 1 } },
                { text: 'Make a pros-and-cons list and analyse it thoroughly', scores: { C: 2 } },
                { text: 'Ask 5 people for their opinions and weigh them all', scores: { A: 1, E: 1 } },
                { text: 'Delay the decision as long as possible because it feels overwhelming', scores: { N: 2 } }
            ]
        },
        {
            section: 'A', sectionLabel: 'Section A: Who You Are',
            text: 'Which statement feels most true about you?',
            options: [
                { text: "I'd rather have an exciting life than a comfortable one", scores: { O: 2, E: 1 } },
                { text: "I'd rather have a stable life than a thrilling one", scores: { C: 2, N: -1 } },
                { text: "I'd rather have a meaningful life than a successful one", scores: { A: 1, O: 1 } },
                { text: "I'd rather have a connected life than an independent one", scores: { A: 2, E: 1 } }
            ]
        },

        // SECTION B: What Interests You (Holland Codes) — Q13-Q22
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Building a piece of furniture with your hands', scores: { R: 1 } },
                { text: 'Analysing data to find a hidden pattern', scores: { I: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Designing a brand identity for a startup', scores: { AR: 1 } },
                { text: 'Teaching a workshop on public speaking', scores: { S: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Pitching an investor on your business idea', scores: { EN: 1 } },
                { text: 'Creating a filing system that organises an entire department', scores: { CO: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Fixing a broken machine to understand how it works', scores: { R: 1 } },
                { text: 'Writing a poem or short story', scores: { AR: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Running a scientific experiment to test a hypothesis', scores: { I: 1 } },
                { text: 'Mentoring a younger person through a tough life decision', scores: { S: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Leading a team through a high-stakes project', scores: { EN: 1 } },
                { text: 'Building a garden, renovating a room, or cooking an elaborate meal', scores: { R: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Creating a photo series or video documentary', scores: { AR: 1 } },
                { text: 'Organising a community event or charity drive', scores: { S: 1, EN: 0.5 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: 'Debugging code to make an app work perfectly', scores: { I: 1, CO: 0.5 } },
                { text: 'Negotiating a deal that benefits both sides', scores: { EN: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'Which sounds more appealing?',
            options: [
                { text: "Reading a 50-page research paper on a topic you're curious about", scores: { I: 1 } },
                { text: 'Planning and managing the budget for a small project', scores: { CO: 1 } }
            ]
        },
        {
            section: 'B', sectionLabel: 'Section B: What Interests You',
            text: 'If you could master one skill overnight, which would you pick?',
            options: [
                { text: 'Carpentry, welding, or mechanical repair', scores: { R: 2 } },
                { text: 'Data science, coding, or neuroscience', scores: { I: 2 } },
                { text: 'Photography, music production, or creative writing', scores: { AR: 2 } },
                { text: 'Public speaking, fundraising, or leadership', scores: { EN: 1, S: 1 } }
            ]
        },

        // SECTION C: What Matters to You (Schwartz Values) — Q23-Q32
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: "You're offered two jobs. Same pay. Job A gives you total creative freedom but no structure. Job B has clear processes and guaranteed stability. Which do you take?",
            options: [
                { text: 'Job A — freedom and creativity matter more to me', scores: { SD: 2 } },
                { text: 'Job B — security and structure help me do my best work', scores: { SE: 2 } },
                { text: 'Depends on the team — I need good people around me either way', scores: { BE: 1 } },
                { text: "Neither — I'd look for a third option that has both", scores: { SD: 1, AC: 1 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: "You've been promoted, but the new role means less time helping your team directly. What feels more true?",
            options: [
                { text: 'The promotion excites me — I want to lead at a higher level', scores: { PO: 1, AC: 1 } },
                { text: "I'd miss the direct impact — helping people is what drives me", scores: { BE: 2 } },
                { text: "I'd take it but reshape the role to stay connected to the team", scores: { BE: 1, SD: 1 } },
                { text: "I'd think about what this means for my long-term goals first", scores: { AC: 2 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'What would make you feel most fulfilled at the end of a work week?',
            options: [
                { text: "I built or created something that didn't exist before", scores: { SD: 2 } },
                { text: 'I helped someone solve a real problem in their life', scores: { BE: 2 } },
                { text: 'I hit a personal goal I set for myself', scores: { AC: 2 } },
                { text: 'I contributed to something bigger than myself', scores: { UN: 2 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'You discover a company you admire has questionable ethical practices. What\'s your priority?',
            options: [
                { text: 'Speak up publicly — injustice needs to be called out', scores: { UN: 2 } },
                { text: 'Research it more before reacting — context matters', scores: { SD: 1, CF: 1 } },
                { text: 'Quietly stop supporting them and move on', scores: { CF: 1, SE: 1 } },
                { text: 'It depends — can I change things from the inside?', scores: { SD: 1, PO: 1 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'Your perfect life at 35 looks like:',
            options: [
                { text: 'Running my own thing — business, project, or creative practice', scores: { SD: 2 } },
                { text: 'A meaningful role where I help people every day', scores: { BE: 2 } },
                { text: 'A respected position with financial security and stability', scores: { SE: 1, AC: 1 } },
                { text: 'Travelling, learning, having a variety of experiences', scores: { ST: 2 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'You have to pick one to optimise for in your career. Which one?',
            options: [
                { text: "Meaning — the work matters, even if it doesn't pay the most", scores: { BE: 1, UN: 1 } },
                { text: 'Money — financial security gives me freedom to live my life', scores: { SE: 1, PO: 1 } },
                { text: 'Growth — constant learning and new challenges', scores: { ST: 1, SD: 1 } },
                { text: 'Impact — I want to change things at scale', scores: { UN: 2 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'When you think about "success," which image comes closest?',
            options: [
                { text: 'Waking up every day excited about what I get to work on', scores: { ST: 1, SD: 1 } },
                { text: 'Having a comfortable home, financial security, and time for family', scores: { SE: 2 } },
                { text: 'Being known as someone who made a real difference', scores: { UN: 2 } },
                { text: 'Building something that outlives me', scores: { AC: 1, PO: 1 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'You find out your close friend is making a career choice you think is a mistake. What do you do?',
            options: [
                { text: 'Tell them honestly what I think — real friends are direct', scores: { SD: 1, BE: 1 } },
                { text: "Support their decision — it's their life to live", scores: { CF: 1, BE: 1 } },
                { text: "Ask questions to help them think it through, but don't push", scores: { BE: 2 } },
                { text: "Share my experience but make clear it's their call", scores: { BE: 1, SD: 1 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'Which risk would you most willingly take?',
            options: [
                { text: 'Quit a stable job to start my own business', scores: { SD: 2 } },
                { text: 'Move to a new country where I know no one', scores: { ST: 2 } },
                { text: 'Take a 50% pay cut for a job with deep personal meaning', scores: { BE: 2 } },
                { text: 'Publicly advocate for an unpopular cause I believe in', scores: { UN: 2 } }
            ]
        },
        {
            section: 'C', sectionLabel: 'Section C: What Matters to You',
            text: 'When you daydream about the future, what shows up most?',
            options: [
                { text: 'A creative studio, workshop, or lab where I make things', scores: { SD: 2 } },
                { text: 'A team of people I lead and inspire', scores: { PO: 1, AC: 1 } },
                { text: "A community I've built or meaningfully contributed to", scores: { UN: 2 } },
                { text: 'A simple, peaceful life with deep relationships and enough', scores: { SE: 1, BE: 1 } }
            ]
        },

        // SECTION D: What Energises You (Strengths) — Q33-Q40
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: "You feel most alive when you're:",
            options: [
                { text: "Solving a complex problem no one else has cracked", scores: { STR: 2 } },
                { text: 'Connecting with someone on a deep, personal level', scores: { REL: 2 } },
                { text: 'Convincing someone to see things your way', scores: { INF: 2 } },
                { text: 'Checking things off a list and seeing progress', scores: { EXE: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: 'At the end of a great workday, what made it great?',
            options: [
                { text: 'I learned something that changed how I think', scores: { STR: 2 } },
                { text: 'I helped someone have a breakthrough', scores: { REL: 2 } },
                { text: 'I moved a project forward significantly', scores: { EXE: 2 } },
                { text: 'I came up with an idea that excited everyone', scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: "People come to you because you're the person who:",
            options: [
                { text: "Sees the big picture when everyone's stuck in details", scores: { STR: 2 } },
                { text: 'Makes people feel heard and understood', scores: { REL: 2 } },
                { text: 'Gets things done, no matter what', scores: { EXE: 2 } },
                { text: 'Speaks up and takes charge when things are drifting', scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: 'Which activity would you happily do for hours without getting bored?',
            options: [
                { text: 'Researching a topic until I understand it inside and out', scores: { STR: 2 } },
                { text: 'Having deep conversations with people about their lives', scores: { REL: 2 } },
                { text: 'Building, organising, or improving a system or process', scores: { EXE: 2 } },
                { text: 'Writing, presenting, or creating content that persuades people', scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: 'When you join a new team, what role do you naturally fall into?',
            options: [
                { text: 'The strategist — I map out the approach before we start', scores: { STR: 2 } },
                { text: 'The connector — I build relationships and keep morale up', scores: { REL: 2 } },
                { text: "The doer — I start executing while others are still planning", scores: { EXE: 2 } },
                { text: 'The voice — I present our work and advocate for the team', scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: 'Which frustration bothers you MOST?',
            options: [
                { text: 'When decisions are made without thinking them through', scores: { STR: 2 } },
                { text: 'When people are treated unfairly or ignored', scores: { REL: 2 } },
                { text: 'When plans are made but no one follows through', scores: { EXE: 2 } },
                { text: 'When good ideas die because no one champions them', scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: 'Imagine you have unlimited resources to solve one problem. You pick:',
            options: [
                { text: "Climate change — I'd design the best system to reverse it", scores: { STR: 1, EXE: 1 } },
                { text: "Loneliness epidemic — I'd build communities that truly connect people", scores: { REL: 2 } },
                { text: "Education inequality — I'd make high-quality learning accessible everywhere", scores: { EXE: 1, STR: 1 } },
                { text: "Political apathy — I'd inspire people to care and take action", scores: { INF: 2 } }
            ]
        },
        {
            section: 'D', sectionLabel: 'Section D: What Energises You',
            text: "When you're in \"flow\" — that state where time disappears — what are you usually doing?",
            options: [
                { text: 'Analysing, researching, mapping out ideas', scores: { STR: 2 } },
                { text: 'Listening, mentoring, having meaningful conversations', scores: { REL: 2 } },
                { text: 'Building, making progress, completing tasks', scores: { EXE: 2 } },
                { text: 'Creating, presenting, influencing, writing', scores: { INF: 2 } }
            ]
        }
    ];

    // --- 12 ARCHETYPE DEFINITIONS ---
    const archetypes = {
        architect: {
            name: 'The Architect',
            emoji: '&#129504;',
            tagline: "I don't just solve problems — I redesign the system so the problem can't exist.",
            description: "You see structures where others see chaos. Your mind naturally maps complexity into elegant systems. You're driven by understanding how things work at the root. People come to you when they need someone to think three steps ahead.",
            strengths: ['Systems thinking', 'Pattern recognition', 'Analytical depth', 'Long-term planning', 'Intellectual rigour'],
            rarity: '11%',
            careerHint: 'Your archetype thrives in roles that require building frameworks from scratch — software architecture, data science, management consulting, urban planning.',
            // Profile vector: Strategic + Investigative + Self-Direction + High O/C
            match: { STR: 2, I: 2, CO: 1, SD: 1, O: 2, C: 2 }
        },
        explorer: {
            name: 'The Explorer',
            emoji: '&#128301;',
            tagline: "Curiosity is my compass. I'd rather ask a great question than give a safe answer.",
            description: "Your mind is wired for discovery — new ideas, new perspectives, new connections between fields. You come alive when learning IS the job. You see patterns where others see noise.",
            strengths: ['Intellectual curiosity', 'Cross-disciplinary thinking', 'Research depth', 'Pattern-spotting', 'Adaptability'],
            rarity: '9%',
            careerHint: 'Your archetype thrives in roles that reward curiosity and breadth — research, journalism, product strategy, venture capital analysis, documentary filmmaking.',
            match: { STR: 2, I: 2, AR: 1, ST: 2, O: 3 }
        },
        visionary: {
            name: 'The Visionary',
            emoji: '&#128640;',
            tagline: "I see the future others can't imagine yet — and I can't rest until I build it.",
            description: "Where others see what is, you see what could be. Your mind naturally generates ideas, possibilities, and innovations. You're not just a dreamer — you're a dreamer with plans.",
            strengths: ['Future-oriented thinking', 'Creative problem-solving', 'Big-picture clarity', 'Inspiring others', 'Innovation'],
            rarity: '7%',
            careerHint: 'Your archetype thrives in roles that let you imagine and build the future — startup founder, innovation lead, creative director, social entrepreneur.',
            match: { STR: 1, INF: 1, EN: 2, AR: 1, SD: 2, AC: 1, O: 2, E: 1 }
        },
        healer: {
            name: 'The Healer',
            emoji: '&#128154;',
            tagline: 'I see people — not just what they show, but what they carry.',
            description: "You have an almost supernatural ability to sense what people are feeling. Your presence creates safety. People open up to you without knowing why. You're drawn to work that helps people become more whole.",
            strengths: ['Deep empathy', 'Active listening', 'Emotional intelligence', 'Creating safety', 'Holding space'],
            rarity: '10%',
            careerHint: 'Your archetype thrives in roles that create healing and safety — psychotherapy, counselling, coaching, occupational therapy, DEI work.',
            match: { REL: 3, S: 2, BE: 2, A: 2, N: 1 }
        },
        connector: {
            name: 'The Connector',
            emoji: '&#129309;',
            tagline: "I build bridges between people who don't know they need each other yet.",
            description: "You collect people the way others collect books. Your gift is seeing complementary strengths between people and bringing them together. Communities form naturally around you.",
            strengths: ['Networking', 'Community building', 'Remembering details', 'Creating belonging', 'Social energy'],
            rarity: '8%',
            careerHint: 'Your archetype thrives in roles that connect people — community management, partnerships, recruiting, event production, PR.',
            match: { REL: 2, INF: 1, S: 1, EN: 1, BE: 1, UN: 1, E: 2, A: 1 }
        },
        mentor: {
            name: 'The Mentor',
            emoji: '&#127793;',
            tagline: 'I see potential in people before they see it in themselves.',
            description: "You're wired to develop others. Your greatest satisfaction comes from watching someone achieve something they didn't think they could. You invest in people for the long game.",
            strengths: ['Developmental instinct', 'Patience', 'Belief in potential', 'Teaching', 'Constructive feedback'],
            rarity: '8%',
            careerHint: 'Your archetype thrives in roles that develop others — teaching, coaching, youth work, leadership development, career counselling.',
            match: { REL: 2, S: 2, BE: 2, A: 1, C: 1 }
        },
        catalyst: {
            name: 'The Catalyst',
            emoji: '&#9889;',
            tagline: "I don't wait for permission. I make things happen.",
            description: "You're the spark that turns talk into action. Your energy is contagious — people follow you not because you ask them to, but because your conviction is magnetic. You thrive in fast, high-stakes environments.",
            strengths: ['Bias toward action', 'Decisiveness', 'Energy', 'Mobilising others', 'Thriving under pressure'],
            rarity: '7%',
            careerHint: 'Your archetype thrives in high-energy, high-stakes roles — startup leadership, sales, crisis management, campaign directing.',
            match: { INF: 2, EXE: 1, EN: 2, AC: 2, PO: 1, E: 2 }
        },
        storyteller: {
            name: 'The Storyteller',
            emoji: '&#9997;&#65039;',
            tagline: 'I turn ideas into feelings and feelings into movements.',
            description: "Words are your superpower. You can take a complex idea and make it feel urgent, personal, and real. Whether writing, speaking, filming, or designing — you translate truth into impact.",
            strengths: ['Narrative construction', 'Emotional persuasion', 'Clarity of expression', 'Content creation', 'Audience empathy'],
            rarity: '9%',
            careerHint: 'Your archetype thrives in roles where communication is the craft — content strategy, copywriting, brand marketing, filmmaking, podcasting.',
            match: { INF: 2, AR: 2, SD: 1, O: 1, E: 1 }
        },
        challenger: {
            name: 'The Challenger',
            emoji: '&#128293;',
            tagline: "I question what everyone accepts. That's how things change.",
            description: "You see through conventional wisdom. You're not contrarian for sport — you genuinely believe improvement requires disruption. You're the person in the room who says what everyone's thinking.",
            strengths: ['Critical thinking', 'Courage to dissent', 'Reform energy', 'Challenging authority', 'Independence'],
            rarity: '6%',
            careerHint: 'Your archetype thrives in roles that disrupt the status quo — investigative journalism, civil rights law, activism, policy reform.',
            match: { INF: 1, STR: 1, I: 1, EN: 1, UN: 2, SD: 1, O: 1, A: -1 }
        },
        builder: {
            name: 'The Builder',
            emoji: '&#128296;',
            tagline: "I turn blueprints into reality. Give me a plan and I'll make it exist.",
            description: "You feel most alive when you're making tangible progress. Others dream; you deliver. Your discipline and follow-through are rare gifts in a world that over-indexes on vision.",
            strengths: ['Reliability', 'Follow-through', 'Craftsmanship', 'Discipline', 'Quality standards'],
            rarity: '10%',
            careerHint: 'Your archetype thrives in roles that build tangible things — product management, software development, operations, construction, engineering.',
            match: { EXE: 3, R: 2, AC: 1, C: 2 }
        },
        guardian: {
            name: 'The Guardian',
            emoji: '&#128737;&#65039;',
            tagline: "I protect what matters. Stability isn't boring — it's the foundation of everything.",
            description: "You bring order to chaos. You're the person who reads the contract, notices the risk, and prepares the backup plan. In a world obsessed with disruption, you understand that stability is a superpower.",
            strengths: ['Risk management', 'Attention to detail', 'Process improvement', 'Reliability', 'Institutional memory'],
            rarity: '8%',
            careerHint: 'Your archetype thrives in roles that protect and organise — compliance, financial analysis, QA, cybersecurity, healthcare administration.',
            match: { EXE: 2, CO: 2, SE: 2, CF: 1, C: 2, N: -1 }
        },
        craftsperson: {
            name: 'The Craftsperson',
            emoji: '&#10024;',
            tagline: 'I care about doing one thing exceptionally well.',
            description: "While others chase breadth, you pursue depth. You're drawn to mastery — the patient, deliberate process of becoming truly excellent at one thing. Quality is your signature.",
            strengths: ['Deep focus', 'Mastery orientation', 'Patience', 'High standards', 'Pride in craft'],
            rarity: '7%',
            careerHint: 'Your archetype thrives in specialist roles — specialist engineering, surgery, artisan work, data specialisation, calligraphy.',
            match: { EXE: 2, STR: 1, R: 1, I: 1, AC: 1, C: 1, O: -1 }
        }
    };

    // --- STATE ---
    let currentQuestion = 0;
    const answers = [];
    const scores = {
        // Big Five
        O: 0, C: 0, E: 0, A: 0, N: 0,
        // Holland Codes (RIASEC) — using AR for Artistic, EN for Enterprising, CO for Conventional to avoid collision
        R: 0, I: 0, AR: 0, S: 0, EN: 0, CO: 0,
        // Schwartz Values
        SD: 0, ST: 0, HE: 0, AC: 0, PO: 0, SE: 0, CF: 0, TR: 0, BE: 0, UN: 0,
        // Strengths
        STR: 0, REL: 0, INF: 0, EXE: 0
    };

    // --- DOM REFS ---
    const quizStart = document.getElementById('quizStart');
    const quizActive = document.getElementById('quizActive');
    const quizCalculating = document.getElementById('quizCalculating');
    const quizResults = document.getElementById('quizResults');
    const startBtn = document.getElementById('startQuizBtn');
    const backBtn = document.getElementById('backBtn');
    const progressFill = document.getElementById('progressFill');
    const sectionLabel = document.getElementById('sectionLabel');
    const questionCounter = document.getElementById('questionCounter');
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');

    if (!startBtn) return;

    // --- START QUIZ ---
    startBtn.addEventListener('click', () => {
        quizStart.style.display = 'none';
        quizActive.style.display = 'block';
        renderQuestion();
    });

    // --- BACK BUTTON ---
    backBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            // Undo last answer's scores
            const lastAnswer = answers.pop();
            if (lastAnswer) {
                Object.entries(lastAnswer.scores).forEach(([key, val]) => {
                    scores[key] -= val;
                });
            }
            currentQuestion--;
            renderQuestion();
        }
    });

    // --- RENDER QUESTION ---
    function renderQuestion() {
        const q = questions[currentQuestion];
        progressFill.style.width = `${((currentQuestion) / questions.length) * 100}%`;
        sectionLabel.textContent = q.sectionLabel;
        questionCounter.textContent = `${currentQuestion + 1} / ${questions.length}`;
        questionText.textContent = q.text;
        backBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';

        quizOptions.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span class="option-text">${opt.text}</span>`;
            btn.addEventListener('click', () => selectOption(i));
            quizOptions.appendChild(btn);
        });

        // Animate in
        const wrap = document.getElementById('questionWrap');
        wrap.classList.remove('quiz-slide-in');
        void wrap.offsetWidth;
        wrap.classList.add('quiz-slide-in');
    }

    // --- SELECT OPTION ---
    function selectOption(optIndex) {
        const q = questions[currentQuestion];
        const selected = q.options[optIndex];

        // Apply scores
        Object.entries(selected.scores).forEach(([key, val]) => {
            scores[key] += val;
        });

        answers.push({ question: currentQuestion, option: optIndex, scores: { ...selected.scores } });

        // Mark selected briefly
        const buttons = quizOptions.querySelectorAll('.quiz-option');
        buttons.forEach(b => b.classList.remove('selected'));
        buttons[optIndex].classList.add('selected');

        // Next question after brief delay
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                renderQuestion();
            } else {
                showCalculating();
            }
        }, 300);
    }

    // --- CALCULATING SCREEN ---
    function showCalculating() {
        quizActive.style.display = 'none';
        quizCalculating.style.display = 'block';
        progressFill.style.width = '100%';

        const steps = document.querySelectorAll('.calc-step');
        steps.forEach((step, i) => {
            setTimeout(() => {
                step.classList.add('active');
            }, 600 * (i + 1));
        });

        setTimeout(() => {
            showResults();
        }, 4000);
    }

    // --- CALCULATE ARCHETYPE ---
    function calculateArchetype() {
        // Build user profile vector from all score dimensions
        const userVector = { ...scores };

        let bestMatch = null;
        let bestScore = -Infinity;

        Object.entries(archetypes).forEach(([key, archetype]) => {
            let dotProduct = 0;
            let magA = 0;
            let magB = 0;

            // Calculate weighted cosine similarity
            Object.entries(archetype.match).forEach(([dim, weight]) => {
                const userVal = userVector[dim] || 0;
                dotProduct += userVal * weight;
                magB += weight * weight;
            });

            Object.values(userVector).forEach(v => { magA += v * v; });

            magA = Math.sqrt(magA);
            magB = Math.sqrt(magB);

            const similarity = (magA > 0 && magB > 0) ? dotProduct / (magA * magB) : 0;

            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = key;
            }
        });

        return bestMatch || 'explorer';
    }

    // --- SHOW RESULTS ---
    function showResults() {
        quizCalculating.style.display = 'none';
        document.querySelector('.quiz-section').style.display = 'none';
        quizResults.style.display = 'block';

        const archetypeKey = calculateArchetype();
        const arch = archetypes[archetypeKey];

        document.getElementById('resultEmoji').innerHTML = arch.emoji;
        document.getElementById('resultName').textContent = arch.name;
        document.getElementById('resultTagline').textContent = arch.tagline;
        document.getElementById('resultDescription').textContent = arch.description;
        document.getElementById('resultRarity').innerHTML = `<span class="rarity-percent">${arch.rarity}</span> of Pathlit users share this archetype`;
        document.getElementById('careerHint').textContent = arch.careerHint;

        const strengthTags = document.getElementById('strengthTags');
        strengthTags.innerHTML = arch.strengths.map(s => `<span class="strength-tag">${s}</span>`).join('');

        // Store result for sharing
        window.pathlitResult = { key: archetypeKey, ...arch };

        // Save quiz results to server (non-blocking)
        fetch('/api/quiz-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scores: { ...scores },
                archetype: archetypeKey,
                answers: [...answers]
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.id) {
                localStorage.setItem('pathlit_quiz_id', data.id);
                console.log('[pathlit] Quiz saved:', data.id);
            }
        })
        .catch(err => {
            console.log('[pathlit] Could not save quiz to server (offline mode):', err.message);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- SHARE ---
    window.shareResult = function(platform) {
        const result = window.pathlitResult;
        if (!result) return;

        const text = `I just discovered I'm ${result.name} on Pathlit! "${result.tagline}" \n\nTake the free quiz:`;
        const url = 'https://pathlit.app/quiz';

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                const btn = document.querySelector('.share-btn:last-child');
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
            });
        }
    };
});
