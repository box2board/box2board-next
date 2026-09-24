import type { MetadataRoute } from "next";
import { publicLeagues } from "@/lib/leagues";
import { PRODUCTION_URL } from "@/lib/site";
const baseUrl = PRODUCTION_URL;
export default function sitemap(): MetadataRoute.Sitemap { return ["/", "/daily", "/about", ...publicLeagues.map((league) => league.path)].map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: route === "/about" ? "monthly" : "hourly", priority: route === "/" ? 1 : .8 })); }
