import { MetadataRoute } from "next";
import { BASE_URL } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/legal`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
