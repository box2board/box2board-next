export type DailyStory = {
  title: string;
  summary: string;
  whyItMatters?: string;
  league?: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type DailyBriefing = {
  date: string;
  dek: string;
  topStories: DailyStory[];
  performances: DailyStory[];
  trends: DailyStory[];
  rosterWatch: DailyStory[];
  watchToday: DailyStory[];
  quickHits: DailyStory[];
};

export const dailyBriefings: DailyBriefing[] = [
  {
    date: "2026-09-24",
    dek: "The Yankees' Ben Rice joins the AL home-run lead, Shohei Ohtani returns to the Dodgers, the WNBA playoff bracket takes shape, and an unusual wave of quarterback injuries hangs over the NFL.",
    topStories: [
      {
        league: "MLB",
        title: "Rice powers Yankees into October with another statement night",
        summary: "Ben Rice hit his 40th and 41st home runs in a 9-2 win over Tampa Bay. Ryan McMahon drove in five, Gerrit Cole struck out eight, and New York secured home-field advantage for its upcoming Wild Card Series.",
        whyItMatters: "Rice moved into a tie for the American League home-run lead while the Yankees locked in a meaningful postseason advantage.",
        sourceUrl: "https://www.cbssports.com/mlb/news/ben-rice-hits-two-homers-as-yankees-rout-rays-9-2/",
        sourceLabel: "AP via CBS Sports"
      },
      {
        league: "WNBA",
        title: "WNBA playoff picture comes into focus on the final day",
        summary: "Atlanta secured the No. 4 seed with an 83-65 win over New York. The Liberty are locked into the No. 8 seed against top-seeded Minnesota, while several remaining first-round matchups depend on Thursday's finales.",
        whyItMatters: "Half of the postseason positions are set, but Thursday still determines multiple first-round pairings.",
        sourceUrl: "https://staging-aws.sports.yahoo.com/articles/atlanta-clinches-no-4-seed-045338223.html",
        sourceLabel: "AP via Yahoo Sports"
      }
    ],
    performances: [
      {
        league: "MLB",
        title: "Ben Rice: 2 HR, including Nos. 40 and 41",
        summary: "Rice finished with three hits and his fifth career multi-homer game in the Yankees' 9-2 victory over Tampa Bay.",
        sourceUrl: "https://www.cbssports.com/mlb/news/ben-rice-hits-two-homers-as-yankees-rout-rays-9-2/",
        sourceLabel: "AP via CBS Sports"
      },
      {
        league: "WNBA",
        title: "Jessica Shepard closes the season with a triple-double",
        summary: "Shepard posted 20 points, 11 rebounds and 12 assists in Dallas' 103-91 win over Seattle, her WNBA-leading sixth triple-double of the season.",
        sourceUrl: "https://staging-aws.sports.yahoo.com/articles/atlanta-clinches-no-4-seed-045338223.html",
        sourceLabel: "AP via Yahoo Sports"
      }
    ],
    trends: [
      {
        league: "WNBA",
        title: "Dallas completes a historic turnaround",
        summary: "The Wings finished 27-16 after winning only 10 games last season, a 17-win year-over-year improvement reported as the best single-season turnaround in WNBA history. Dallas has also won seven of its last eight.",
        sourceUrl: "https://staging-aws.sports.yahoo.com/articles/atlanta-clinches-no-4-seed-045338223.html",
        sourceLabel: "AP via Yahoo Sports"
      }
    ],
    rosterWatch: [
      {
        league: "MLB",
        title: "Ohtani returns after more than two weeks out",
        summary: "Shohei Ohtani went 1-for-4 with a walk in his return to the Dodgers lineup after missing more than two weeks with right biceps discomfort. Los Angeles lost 5-1 to San Diego.",
        whyItMatters: "The Dodgers are getting their star back just before the postseason, but Wednesday's loss cost them a chance to clinch a first-round bye.",
        sourceUrl: "https://www.latimes.com/sports/dodgers/story/2026-09-23/shohei-ohtani-dodgers-padres",
        sourceLabel: "Los Angeles Times"
      },
      {
        league: "NFL",
        title: "Quarterback injuries reshape the early NFL season",
        summary: "An unusual early wave of quarterback injuries could leave as many as six teams starting backups this week, with Caleb Williams, Jayden Daniels and Jaxson Dart among the quarterbacks hurt in Week 2.",
        sourceUrl: "https://gorgenewscenter.com/2026/09/24/9-23-sports-brief-2/",
        sourceLabel: "AP"
      }
    ],
    watchToday: [
      {
        league: "NFL",
        title: "Falcons-Packers opens the NFL slate tonight",
        summary: "Green Bay hosts Atlanta at 8:15 p.m. ET. The Packers have ruled out wide receiver Jayden Reed with a neck injury; Atlanta has ruled out defensive end Samson Ebukam.",
        sourceUrl: "https://amp.nfl.com/news/nfl-week-3-injury-report-player-statuses-for-all-16-games",
        sourceLabel: "NFL.com"
      },
      {
        league: "GOLF",
        title: "Presidents Cup begins at Medinah",
        summary: "The Presidents Cup opens Thursday with five fourball matches. NCAA champion Jackson Koivun is making his Presidents Cup debut only months after leading Auburn to a national title.",
        sourceUrl: "https://gorgenewscenter.com/2026/09/24/9-23-sports-brief-2/",
        sourceLabel: "AP"
      }
    ],
    quickHits: [
      {
        league: "MLB",
        title: "Wednesday's MLB board had October implications",
        summary: "Boston shut out Cleveland 1-0, Milwaukee beat Philadelphia 4-1, Seattle edged Houston 6-5, and San Diego beat the Dodgers 5-1 among Wednesday's results.",
        sourceUrl: "https://www.977theriver.com/2026/09/24/scoreboard-roundup-9-23-26/",
        sourceLabel: "ABC Audio"
      }
    ]
  }
];

export function getDailyBriefing(date: string) {
  return dailyBriefings.find((briefing) => briefing.date === date);
}

export function getLatestDailyBriefing() {
  return [...dailyBriefings].sort((a, b) => b.date.localeCompare(a.date))[0];
}
