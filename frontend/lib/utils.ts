import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALLOWED_TYPES } from "@/constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAllowedTypes(types: string[] | undefined): string {
	if (!types || types.length === 0) return "supermarket";

	const validTypes = types.filter((type) => ALLOWED_TYPES.includes(type));
	if (validTypes.length > 0) {
		return validTypes[0]; // Return the first valid type
	}

	// Fallback to default type if no valid types found
	return "supermarket";
}

export function getUserId() {
	const userIdKey = "kombuciao-user-id";
	let userId = localStorage.getItem(userIdKey);
	if (!userId) {
		userId = crypto.randomUUID();
		localStorage.setItem(userIdKey, userId);
	}
	return userId;
}

export function getDateString(date: Date) {
	return `${date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})} à ${date.toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
}

export function formatNumber(number: number, fractionDigits = 1) {
	return number.toLocaleString("fr-FR", {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}
