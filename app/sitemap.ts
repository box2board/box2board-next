import type { MetadataRoute } from "next";
import { leagues } from "@/lib/leagues";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://box2board.vercel.app";
  const leagueRoutes = leagues.flatMap((league) => [
    league.path,
    `${league.path}/lines`,
    `${league.path}/game-props`,
    `${league.path}/player-props`,
  ]);

  return ["/", ...leagueRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
