window.TPM_DATA = {
  nodes: [
    // ---------- domains ----------
    {
      id: "planning",
      type: "domain",
      label: "Program planning",
      summary: "Turning a goal into a plan people can commit to: scope, milestones, estimates and the dependencies between teams.",
      author: "ai"
    },
    {
      id: "execution",
      type: "domain",
      label: "Delivery execution",
      summary: "Keeping a program moving once it starts: the operating rhythm, status, releases and how change is handled.",
      author: "ai"
    },
    {
      id: "risk",
      type: "domain",
      label: "Risk and issues",
      summary: "Seeing trouble early, deciding what to do about it, and escalating when the team cannot solve it alone.",
      author: "ai"
    },
    {
      id: "stakeholders",
      type: "domain",
      label: "Stakeholders and communication",
      summary: "Knowing who cares about the program, what each of them needs to hear, and how decisions get made.",
      author: "ai"
    },
    {
      id: "technical",
      type: "domain",
      label: "Technical depth",
      summary: "Enough engineering understanding to follow design discussions, spot risk in architecture and earn credibility with engineers.",
      author: "ai"
    },
    {
      id: "metrics",
      type: "domain",
      label: "Metrics and outcomes",
      summary: "Measuring whether the program delivers value, not only whether it ships, and using data to steer.",
      author: "ai"
    },
    {
      id: "leadership",
      type: "domain",
      label: "Leadership and influence",
      summary: "Getting many teams to move together without formal authority over any of them.",
      author: "ai"
    },

    // ---------- program planning ----------
    {
      id: "scope-definition",
      type: "concept",
      parent: "planning",
      label: "Scope definition",
      summary: "Writing down what the program will and will not deliver, and the outcome it is meant to achieve.",
      why: "Most late programs are not slow, they are bigger than anyone agreed to. A clear scope, including explicit non-goals, gives you something to point at when new requests arrive.",
      pitfalls: [
        "Listing features without the outcome they serve, so nobody can judge trade-offs.",
        "Skipping non-goals, which leaves room for silent scope creep.",
        "Treating the first scope as fixed instead of revisiting it as you learn."
      ],
      reflect: [
        "When did unclear scope cause a program to drift?",
        "How did you get agreement on what was out of scope?"
      ],
      related: ["change-control", "okrs"],
      author: "ai"
    },
    {
      id: "milestones-critical-path",
      type: "concept",
      parent: "planning",
      label: "Milestones and critical path",
      summary: "Breaking the program into checkpoints and finding the chain of dependent work that sets the earliest finish date.",
      why: "Only delays on the critical path move the end date. Knowing which work is on it tells you where to focus attention and where slack exists.",
      pitfalls: [
        "Milestones defined as activities (\"start testing\") rather than verifiable results.",
        "Forgetting that the critical path shifts as work finishes or slips.",
        "Ignoring near-critical paths that have very little slack."
      ],
      reflect: [
        "Which milestone in a past program was the real gate for the launch?",
        "How did you notice the critical path had moved?"
      ],
      related: ["dependency-mapping", "status-reporting"],
      author: "ai"
    },
    {
      id: "estimation",
      type: "concept",
      parent: "planning",
      label: "Estimation and forecasting",
      summary: "Giving a likely range for when work will finish, based on evidence, and updating it as you learn.",
      why: "Leaders plan around your dates. A range with stated confidence is more honest and more useful than a single date that everyone quietly doubts.",
      pitfalls: [
        "Committing to a single date before the unknowns are explored.",
        "Adding up optimistic task estimates and calling it a plan.",
        "Not re-forecasting until the date has already been missed."
      ],
      reflect: [
        "How did you communicate uncertainty in a date?",
        "What signal told you a forecast needed to change?"
      ],
      related: ["flow-metrics", "exec-communication"],
      author: "ai"
    },
    {
      id: "dependency-mapping",
      type: "concept",
      parent: "planning",
      label: "Dependency mapping",
      summary: "Identifying which teams, systems or decisions your program relies on, and who relies on you.",
      why: "Cross-team dependencies are where programs most often stall, because no single team owns the gap between them.",
      pitfalls: [
        "Recording a dependency without an owner and a needed-by date on the other side.",
        "Assuming the other team has the same priority for your request.",
        "Only mapping inbound dependencies and forgetting who is waiting on you."
      ],
      reflect: [
        "Which dependency surprised you late in a program?",
        "How did you get another team to commit to a date?"
      ],
      related: ["cross-team-coordination", "milestones-critical-path", "risk-register"],
      author: "ai"
    },

    // ---------- delivery execution ----------
    {
      id: "operating-cadence",
      type: "concept",
      parent: "execution",
      label: "Operating cadence",
      summary: "The regular rhythm of meetings, updates and reviews that keeps a program coordinated.",
      why: "A predictable cadence means problems surface on a schedule instead of by accident, and people know where decisions get made.",
      pitfalls: [
        "Adding meetings until the cadence costs more time than it saves.",
        "Status meetings that only read out what is already written down.",
        "Keeping the same cadence after the program's phase has changed."
      ],
      reflect: [
        "Which meeting did you remove or change, and why?",
        "How did your cadence differ between planning and launch phases?"
      ],
      related: ["status-reporting", "retrospectives"],
      author: "ai"
    },
    {
      id: "status-reporting",
      type: "concept",
      parent: "execution",
      label: "Status reporting",
      summary: "A short, regular summary of progress, risks and asks, aimed at the people who need to act on it.",
      why: "Good status reporting turns into decisions and help. Bad status reporting turns into a green dashboard right up until the launch slips.",
      pitfalls: [
        "\"Watermelon\" status: green on the outside, red inside.",
        "Reporting activity instead of progress against milestones.",
        "Burying the ask at the bottom of a long update."
      ],
      reflect: [
        "When did you change a status to red, and what happened next?",
        "How did you structure updates for different audiences?"
      ],
      related: ["exec-communication", "milestones-critical-path"],
      author: "ai"
    },
    {
      id: "release-management",
      type: "concept",
      parent: "execution",
      label: "Release management",
      summary: "Planning and running the steps that take finished work safely into production and to users.",
      why: "The release is where many teams' work meets real users at once. Clear go/no-go criteria, rollback plans and ownership reduce the blast radius when something goes wrong.",
      pitfalls: [
        "No agreed go/no-go criteria, so the decision becomes a debate on the day.",
        "A rollback plan that has never been tested.",
        "Launching everything at once instead of staging or using feature flags."
      ],
      reflect: [
        "What were the go/no-go criteria on a release you ran?",
        "Have you ever called a no-go? How did you make the case?"
      ],
      related: ["ci-cd", "incident-management", "mitigation-contingency"],
      author: "ai"
    },
    {
      id: "change-control",
      type: "concept",
      parent: "execution",
      label: "Change control",
      summary: "A light, agreed way to evaluate and accept or reject changes to scope, dates or resources.",
      why: "Change is normal. Without a process, each change is accepted quietly and its cost to the plan is never made visible.",
      pitfalls: [
        "A process so heavy that people work around it.",
        "Accepting changes without saying what moves out or what date shifts.",
        "Not recording the decision and who made it."
      ],
      reflect: [
        "How did you handle a late, high-priority request?",
        "What trade-off did you present when scope grew?"
      ],
      related: ["scope-definition", "decision-making"],
      author: "ai"
    },

    // ---------- risk and issues ----------
    {
      id: "risk-register",
      type: "concept",
      parent: "risk",
      label: "Risk register",
      summary: "A living list of things that might go wrong, with likelihood, impact, an owner and a response.",
      why: "Writing risks down with owners turns vague worry into actions. Reviewing it regularly keeps attention on what could hurt the program most.",
      pitfalls: [
        "A register created at kickoff and never opened again.",
        "Risks with no owner or no response, just a description.",
        "Confusing risks (might happen) with issues (already happening)."
      ],
      reflect: [
        "Which risk on your list actually happened, and were you ready?",
        "How often did you review risks, and with whom?"
      ],
      related: ["mitigation-contingency", "pre-mortem", "dependency-mapping"],
      author: "ai"
    },
    {
      id: "mitigation-contingency",
      type: "concept",
      parent: "risk",
      label: "Mitigation and contingency",
      summary: "Mitigation lowers the chance or impact of a risk ahead of time; contingency is the plan you switch to if it happens.",
      why: "Having both means you are not inventing a response under pressure. A clear trigger for the contingency makes the switch a decision, not a debate.",
      pitfalls: [
        "Contingency plans with no trigger, so nobody knows when to use them.",
        "Mitigations that cost more than the risk they address.",
        "Assuming a risk is handled because it has been discussed."
      ],
      reflect: [
        "When did you activate a fallback plan?",
        "What did a mitigation cost, and was it worth it?"
      ],
      related: ["risk-register", "release-management"],
      author: "ai"
    },
    {
      id: "escalation",
      type: "concept",
      parent: "risk",
      label: "Escalation",
      summary: "Bringing a problem to people with more authority when the team cannot resolve it within its own scope.",
      why: "Escalating early and clearly is a tool, not a failure. It gets decisions made while there are still options.",
      pitfalls: [
        "Escalating too late, after the options have run out.",
        "Escalating a complaint instead of a decision with clear options.",
        "Surprising peers by escalating without telling them first."
      ],
      reflect: [
        "What made an escalation you raised effective?",
        "How did you keep the relationship with the other team intact?"
      ],
      related: ["exec-communication", "conflict-resolution"],
      author: "ai"
    },
    {
      id: "pre-mortem",
      type: "concept",
      parent: "risk",
      label: "Pre-mortem",
      summary: "Imagining the program has failed and working backwards to list the most likely reasons.",
      why: "It gives people permission to voice doubts they would otherwise keep to themselves, and it fills the risk register with real concerns.",
      pitfalls: [
        "Running it once and not turning the findings into owned risks.",
        "Letting the most senior voice dominate the list.",
        "Only listing technical failures and missing people or process ones."
      ],
      reflect: [
        "What did a pre-mortem surface that nobody had said out loud?"
      ],
      related: ["risk-register", "retrospectives"],
      author: "ai"
    },

    // ---------- stakeholders and communication ----------
    {
      id: "stakeholder-mapping",
      type: "concept",
      parent: "stakeholders",
      label: "Stakeholder mapping",
      summary: "Listing who is affected by or has influence over the program, and what each of them needs.",
      why: "Programs fail politically as often as technically. Knowing who to involve, inform or win over prevents late surprises.",
      pitfalls: [
        "Only mapping the people in the room, missing quiet but powerful stakeholders.",
        "Treating all stakeholders the same way.",
        "Not revisiting the map when the organization changes."
      ],
      reflect: [
        "Which stakeholder did you underestimate, and what did you learn?"
      ],
      related: ["raci", "influence"],
      author: "ai"
    },
    {
      id: "raci",
      type: "concept",
      parent: "stakeholders",
      label: "RACI and ownership",
      summary: "Making clear who is Responsible, Accountable, Consulted and Informed for each key decision or deliverable.",
      why: "Unclear ownership causes both gaps (nobody does it) and conflicts (two people think they decide). One accountable person per item avoids both.",
      pitfalls: [
        "More than one Accountable for the same item.",
        "A detailed chart nobody reads; the value is in the conversation.",
        "Consulting so many people that decisions stall."
      ],
      reflect: [
        "When did unclear ownership cause a problem, and how did you fix it?"
      ],
      related: ["decision-making", "stakeholder-mapping"],
      author: "ai"
    },
    {
      id: "exec-communication",
      type: "concept",
      parent: "stakeholders",
      label: "Executive communication",
      summary: "Communicating with senior leaders: bottom line first, short, and clear about what you need from them.",
      why: "Executives have little time and many inputs. If the decision or ask is not obvious in the first lines, it will likely be missed.",
      pitfalls: [
        "Leading with background instead of the conclusion.",
        "Hiding bad news in the details.",
        "Presenting a problem without options or a recommendation."
      ],
      reflect: [
        "How did you deliver bad news to leadership?",
        "What format worked best for a busy executive?"
      ],
      related: ["status-reporting", "escalation"],
      author: "ai"
    },
    {
      id: "decision-making",
      type: "concept",
      parent: "stakeholders",
      label: "Decision-making",
      summary: "Making sure decisions have a clear owner, the right input and a written record.",
      why: "Programs slow down when decisions are reopened or nobody knows who decides. A short decision log saves a lot of repeated debate.",
      pitfalls: [
        "Seeking consensus when a single owner should decide.",
        "Decisions made in a hallway and never recorded.",
        "Not separating reversible decisions (decide fast) from irreversible ones (decide carefully)."
      ],
      reflect: [
        "How did you unblock a decision that had stalled?",
        "When did a decision get reopened, and how did you handle it?"
      ],
      related: ["raci", "change-control", "conflict-resolution"],
      author: "ai"
    },

    // ---------- technical depth ----------
    {
      id: "system-design",
      type: "concept",
      parent: "technical",
      label: "System design basics",
      summary: "How services, data stores, APIs and queues fit together, and the trade-offs between common patterns.",
      why: "You do not need to design the system, but you need to follow the discussion, ask good questions and see where design choices create schedule or risk.",
      pitfalls: [
        "Staying silent in design reviews because the topic feels too technical.",
        "Pretending to understand instead of asking a clarifying question.",
        "Missing that a design choice creates a new cross-team dependency."
      ],
      reflect: [
        "What question in a design review changed the plan?"
      ],
      related: ["non-functional-requirements", "dependency-mapping"],
      author: "ai"
    },
    {
      id: "non-functional-requirements",
      type: "concept",
      parent: "technical",
      label: "Non-functional requirements",
      summary: "Qualities like performance, reliability, security, scalability and accessibility, not just features.",
      why: "They are often discovered late, during load tests or security reviews, where they become the reason a launch slips.",
      pitfalls: [
        "Not writing them down until a review blocks the launch.",
        "Targets with no way to measure them.",
        "Scheduling security and privacy reviews at the very end."
      ],
      reflect: [
        "Which non-functional requirement nearly blocked a launch?"
      ],
      related: ["system-design", "release-management"],
      author: "ai"
    },
    {
      id: "tech-debt",
      type: "concept",
      parent: "technical",
      label: "Technical debt",
      summary: "Shortcuts in code or architecture that speed up delivery now and cost extra effort later.",
      why: "Some debt is a sensible trade-off. The TPM's job is to make it visible and make sure the cost is paid down deliberately rather than ignored.",
      pitfalls: [
        "Treating all debt as bad, or all debt as acceptable.",
        "Debt that is never recorded, so it cannot be prioritized.",
        "No regular capacity set aside to pay it down."
      ],
      reflect: [
        "How did you make the case for paying down debt over new features?"
      ],
      related: ["delivery-metrics", "change-control"],
      author: "ai"
    },
    {
      id: "ci-cd",
      type: "concept",
      parent: "technical",
      label: "CI/CD and deployment",
      summary: "Automated build, test and deployment pipelines that let teams ship small changes often and safely.",
      why: "Pipeline health directly shapes how fast and how safely a program can deliver. Slow or flaky pipelines are a hidden schedule risk.",
      pitfalls: [
        "Ignoring flaky tests until nobody trusts the pipeline.",
        "Manual deployment steps that only one person knows.",
        "Big-bang releases instead of small, frequent ones."
      ],
      reflect: [
        "How did deployment practices affect a program you ran?"
      ],
      related: ["release-management", "delivery-metrics"],
      author: "ai"
    },
    {
      id: "incident-management",
      type: "concept",
      parent: "technical",
      label: "Incident management",
      summary: "Responding to production problems with clear roles, communication and follow-up reviews.",
      why: "Calm, structured incident response limits user impact, and blameless reviews turn incidents into improvements.",
      pitfalls: [
        "No clear incident lead, so everyone debugs and nobody communicates.",
        "Post-incident reviews that assign blame.",
        "Action items from reviews that are never completed."
      ],
      reflect: [
        "What was your role in an incident, and what changed afterwards?"
      ],
      related: ["release-management", "retrospectives"],
      author: "ai"
    },

    // ---------- metrics and outcomes ----------
    {
      id: "okrs",
      type: "concept",
      parent: "metrics",
      label: "OKRs and goals",
      summary: "Objectives with measurable key results that describe the outcome a program should produce.",
      why: "Good goals let teams make trade-offs on their own, because everyone knows what success looks like.",
      pitfalls: [
        "Key results that are task lists rather than outcomes.",
        "Too many objectives, so nothing is really a priority.",
        "Setting goals and not checking them until the end of the period."
      ],
      reflect: [
        "How did you tie a program's milestones to a measurable outcome?"
      ],
      related: ["scope-definition", "leading-lagging"],
      author: "ai"
    },
    {
      id: "delivery-metrics",
      type: "concept",
      parent: "metrics",
      label: "Delivery metrics (DORA)",
      summary: "Deployment frequency, lead time for changes, change failure rate and time to restore service.",
      why: "They give a balanced view of speed and stability, so teams do not improve one at the expense of the other.",
      pitfalls: [
        "Using them to compare or rank teams.",
        "Chasing the number instead of the underlying practice.",
        "Measuring speed without stability, or the reverse."
      ],
      reflect: [
        "Which delivery metric did you use to argue for a change?"
      ],
      related: ["ci-cd", "flow-metrics"],
      author: "ai"
    },
    {
      id: "flow-metrics",
      type: "concept",
      parent: "metrics",
      label: "Flow metrics",
      summary: "Cycle time, throughput and work in progress, which describe how work moves through a team.",
      why: "They give an evidence-based basis for forecasts and show where work waits, which is usually more than where it is worked on.",
      pitfalls: [
        "Too much work in progress, which slows everything down.",
        "Forecasting from story points alone instead of actual throughput.",
        "Looking at averages and missing the long tail of slow items."
      ],
      reflect: [
        "Where did work wait the longest in a team you supported?"
      ],
      related: ["estimation", "delivery-metrics"],
      author: "ai"
    },
    {
      id: "leading-lagging",
      type: "concept",
      parent: "metrics",
      label: "Leading and lagging indicators",
      summary: "Lagging indicators confirm a result after the fact; leading indicators predict it early enough to act.",
      why: "Steering a program only on lagging indicators means you find out too late. Pairing them gives both early warning and confirmation.",
      pitfalls: [
        "Tracking only what is easy to measure.",
        "Leading indicators that do not actually predict the outcome.",
        "Too many metrics, so none of them drive decisions."
      ],
      reflect: [
        "What early signal warned you a program was off track?"
      ],
      related: ["okrs", "status-reporting"],
      author: "ai"
    },

    // ---------- leadership and influence ----------
    {
      id: "influence",
      type: "concept",
      parent: "leadership",
      label: "Influence without authority",
      summary: "Getting people who do not report to you to commit, through shared goals, trust and clear reasoning.",
      why: "It is the core of the TPM role. Most of the people a program depends on have their own managers and priorities.",
      pitfalls: [
        "Relying on borrowed authority (\"the VP wants this\") too often.",
        "Asking for help without explaining why it matters to them.",
        "Building relationships only when you need something."
      ],
      reflect: [
        "How did you get a team with other priorities to commit to your work?"
      ],
      related: ["stakeholder-mapping", "cross-team-coordination"],
      author: "ai"
    },
    {
      id: "cross-team-coordination",
      type: "concept",
      parent: "leadership",
      label: "Cross-team coordination",
      summary: "Aligning several teams on shared plans, interfaces and timing so their work fits together.",
      why: "The integration points between teams are where work falls through the cracks. Someone has to own the whole picture.",
      pitfalls: [
        "Coordinating only through tickets, without shared conversations.",
        "Each team optimizing its own plan at the expense of the program.",
        "Late integration, so mismatches are found at the end."
      ],
      reflect: [
        "How did you keep several teams' plans in sync?"
      ],
      related: ["dependency-mapping", "influence", "operating-cadence"],
      author: "ai"
    },
    {
      id: "conflict-resolution",
      type: "concept",
      parent: "leadership",
      label: "Conflict resolution",
      summary: "Helping people with different goals or views reach a decision they can both commit to.",
      why: "Unresolved conflict quietly slows programs down. Surfacing it and focusing on shared goals keeps work moving.",
      pitfalls: [
        "Avoiding conflict until it becomes a crisis.",
        "Taking sides instead of clarifying the trade-off.",
        "Treating a disagreement about facts as a disagreement about people."
      ],
      reflect: [
        "How did you resolve a disagreement between two teams?"
      ],
      related: ["decision-making", "escalation"],
      author: "ai"
    },
    {
      id: "retrospectives",
      type: "concept",
      parent: "leadership",
      label: "Retrospectives and learning",
      summary: "Regularly looking back at what worked and what did not, and turning that into concrete changes.",
      why: "A program that learns gets easier over time. Without follow-through, retrospectives become a ritual that people stop believing in.",
      pitfalls: [
        "The same issues raised every time with no change.",
        "Action items with no owner.",
        "An atmosphere where people do not feel safe being honest."
      ],
      reflect: [
        "What change came out of a retrospective you ran?"
      ],
      related: ["incident-management", "operating-cadence", "pre-mortem"],
      author: "ai"
    },

    // ---------- stories ----------
    {
      id: "story-high-stakes-release",
      type: "story",
      label: "A high-stakes release",
      summary: "Running a release where a lot was riding on getting it right.",
      related: ["release-management", "mitigation-contingency", "exec-communication", "risk-register"],
      prompts: [
        "What kind of release was it, and why were the stakes high?",
        "How did you decide go or no-go?",
        "What was your fallback if it went wrong?",
        "What was the outcome, and what would you do differently?"
      ],
      experience: null,
      author: "ai"
    },
    {
      id: "story-cross-team-dependency",
      type: "story",
      label: "A blocking cross-team dependency",
      summary: "Getting a program unblocked when it depended on another team with different priorities.",
      related: ["dependency-mapping", "influence", "escalation", "cross-team-coordination"],
      prompts: [
        "What did you need from the other team, and why was it stuck?",
        "How did you try to resolve it before escalating?",
        "What did you offer or trade to get commitment?",
        "How did it end, and how was the relationship afterwards?"
      ],
      experience: null,
      author: "ai"
    },
    {
      id: "story-recovering-slip",
      type: "story",
      label: "Recovering a slipping program",
      summary: "Noticing a program was off track and bringing it back to a credible plan.",
      related: ["estimation", "status-reporting", "scope-definition", "leading-lagging"],
      prompts: [
        "What signal told you the program was slipping?",
        "What options did you lay out (scope, dates, people)?",
        "How did you communicate the new plan?",
        "What was the result?"
      ],
      experience: null,
      author: "ai"
    },
    {
      id: "story-difficult-tradeoff",
      type: "story",
      label: "A difficult trade-off decision",
      summary: "Helping leaders choose between competing priorities when not everything could fit.",
      related: ["decision-making", "change-control", "conflict-resolution", "okrs"],
      prompts: [
        "What were the competing options?",
        "How did you frame the trade-off for the decision maker?",
        "Who disagreed, and how did you handle it?",
        "What was decided, and how did it turn out?"
      ],
      experience: null,
      author: "ai"
    },
    {
      id: "story-incident",
      type: "story",
      label: "A production incident",
      summary: "Your role during a production problem and what changed afterwards.",
      related: ["incident-management", "retrospectives", "exec-communication"],
      prompts: [
        "What happened, at a high level, and what was the user impact?",
        "What was your role during the incident?",
        "What came out of the post-incident review?",
        "Which follow-up actions actually got done?"
      ],
      experience: null,
      author: "ai"
    },
    {
      id: "story-process-improvement",
      type: "story",
      label: "Improving how teams deliver",
      summary: "Building a delivery cockpit that made the team's work visible to anyone and moved forecasting from estimates to throughput.",
      related: ["flow-metrics", "delivery-metrics", "estimation", "status-reporting", "stakeholder-mapping", "operating-cadence"],
      prompts: [
        "What problem did you see in how work was getting done?",
        "What did you change, and how did you get buy-in?",
        "How did you measure whether it helped?",
        "What would you keep or drop next time?"
      ],
      experience: "I built an internal delivery cockpit to act as an information radiator: one place where anyone, from leadership to engineers, could see what the team was building and how it was progressing. It pulls data from the code host and the task tracker, and shows where effort goes, how long work spends in each phase, review flow, release quality, scope changes against each sprint and release baseline, and a forecast of when open work is likely to land.\n\nThe forecast runs on historical throughput, not estimates. Estimates are guesses made before the work is understood; throughput is what the team has actually delivered. For that to hold, items need to be of a fairly consistent size, so the tool came with a behaviour change: small pull requests, each linked one-to-one to a ticket.\n\nOne deliberate choice was keeping per-engineer stats out of sight. The goal was to make the team's work visible, not to make anyone feel monitored, and individual numbers would have undermined trust in the whole thing.\n\nThe biggest change was in the conversations. Instead of \"when will it be done?\", people started asking \"how can we move faster?\" and \"why do we need this now?\". Status questions answered themselves, and the discussion moved to priorities and trade-offs.",
      author: "ai"
    }
  ]
};
