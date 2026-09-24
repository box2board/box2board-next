import type { MetadataRoute } from "next";
import { isProductionDeployment, PRODUCTION_URL } from "@/lib/site";
export default function robots(): MetadataRoute.Robots { return { rules: isProductionDeployment() ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" }, sitemap: `${PRODUCTION_URL}/sitemap.xml` }; }
