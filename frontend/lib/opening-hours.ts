export interface ParsedHours {
	day: string;
	dayFrench: string;
	open: string;
	close: string;
}

export interface OpeningStatus {
	isOpen: boolean;
	status: string;
	nextChange?: string;
}

// French day names
const FRENCH_DAYS: Record<string, string> = {
	Mon: "Lundi",
	Tue: "Mardi",
	Wed: "Mercredi",
	Thu: "Jeudi",
	Fri: "Vendredi",
	Sat: "Samedi",
	Sun: "Dimanche",
};

// Support multiple day abbreviation formats
const DAY_MAPPINGS: Record<string, string> = {
	Mo: "Mon",
	Tu: "Tue",
	We: "Wed",
	Th: "Thu",
	Fr: "Fri",
	Sa: "Sat",
	Su: "Sun",
	Lun: "Mon",
	Mar: "Tue",
	Mer: "Wed",
	Jeu: "Thu",
	Ven: "Fri",
	Sam: "Sat",
	Dim: "Sun",
};

export function parseOpeningHours(openingHours: string): ParsedHours[] {
	if (!openingHours || openingHours.trim() === "") return [];

	try {
		// Handle formats like "Mon-Fri 9-18", "Mon-Fri 09:00-18:00", "Mon 9-17; Tue-Fri 8-19"
		const schedules = openingHours.split(";").map((s) => s.trim());
		const parsed: ParsedHours[] = [];

		for (const schedule of schedules) {
			const parts = schedule.split(" ");
			if (parts.length < 2) continue;

			const dayRange = parts[0];
			const timeRange = parts.slice(1).join(" ");

			// Parse time range
			const timeMatch = timeRange.match(
				/(\d{1,2}):?(\d{0,2})-(\d{1,2}):?(\d{0,2})/
			);
			if (!timeMatch) continue;

			const [, startH, startM = "00", endH, endM = "00"] = timeMatch;
			const open = `${startH.padStart(2, "0")}:${startM.padStart(2, "0")}`;
			const close = `${endH.padStart(2, "0")}:${endM.padStart(2, "0")}`;

			// Parse day range
			if (dayRange.includes("-")) {
				const [start, end] = dayRange.split("-");
				const days = expandDayRange(start, end);
				days.forEach((day) => {
					parsed.push({ day, dayFrench: FRENCH_DAYS[day] || day, open, close });
				});
			} else {
				const normalizedDay = DAY_MAPPINGS[dayRange] || dayRange;
				parsed.push({
					day: normalizedDay,
					dayFrench: FRENCH_DAYS[normalizedDay] || normalizedDay,
					open,
					close,
				});
			}
		}

		return parsed;
	} catch (error) {
		console.warn("Failed to parse opening hours:", openingHours, error);
		return [];
	}
}

function expandDayRange(start: string, end: string): string[] {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	// Normalize day abbreviations
	const normalizedStart = DAY_MAPPINGS[start] || start;
	const normalizedEnd = DAY_MAPPINGS[end] || end;

	const startIndex = days.indexOf(normalizedStart);
	const endIndex = days.indexOf(normalizedEnd);

	if (startIndex === -1 || endIndex === -1) return [normalizedStart];

	const result: string[] = [];
	for (let i = startIndex; i <= endIndex; i++) {
		result.push(days[i]);
	}
	return result;
}

export function getOpeningStatus(openingHours: string): OpeningStatus {
	const parsed = parseOpeningHours(openingHours);

	if (parsed.length === 0) {
		return {
			isOpen: false,
			status: "Horaires inconnus",
		};
	}

	const now = new Date();
	const currentDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
		now.getDay()
	];
	const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
		.getMinutes()
		.toString()
		.padStart(2, "0")}`;

	// Find today's hours
	const todayHours = parsed.find((h) => h.day === currentDay);

	if (!todayHours) {
		return {
			isOpen: false,
			status: "Fermé aujourd'hui",
		};
	}

	// Check if currently open
	const isCurrentlyOpen =
		currentTime >= todayHours.open && currentTime <= todayHours.close;

	if (isCurrentlyOpen) {
		return {
			isOpen: true,
			status: `Ouvert jusqu'à ${todayHours.close}`,
			nextChange: todayHours.close,
		};
	} else if (currentTime < todayHours.open) {
		return {
			isOpen: false,
			status: `Ouvre à ${todayHours.open}`,
			nextChange: todayHours.open,
		};
	} else {
		// Find next opening day
		const nextDay = findNextOpeningDay(parsed, currentDay);
		return {
			isOpen: false,
			status: nextDay
				? `Ouvre ${nextDay.dayFrench} à ${nextDay.open}`
				: "Fermé",
			nextChange: nextDay?.open,
		};
	}
}

function findNextOpeningDay(
	parsed: ParsedHours[],
	currentDay: string
): ParsedHours | null {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const currentIndex = days.indexOf(currentDay);

	// Check next 7 days
	for (let i = 1; i <= 7; i++) {
		const nextDayIndex = (currentIndex + i) % 7;
		const nextDay = days[nextDayIndex];
		const nextDayHours = parsed.find((h) => h.day === nextDay);

		if (nextDayHours) return nextDayHours;
	}

	return null;
}
