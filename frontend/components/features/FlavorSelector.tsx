import React from "react";
import MultipleSelector, { Option } from "../ui/multiselect";
import { FLAVORS } from "@/constants";

const FlavorSelector = ({
	selectedFlavors,
	setSelectedFlavors,
}: {
	selectedFlavors: Option[];
	setSelectedFlavors: (flavors: Option[]) => void;
}) => {
	return (
		<div className="w-full">
			<MultipleSelector
				options={Object.entries(FLAVORS).map(([key, label]) => ({
					value: key,
					label,
				}))}
				value={selectedFlavors}
				onChange={setSelectedFlavors}
				placeholder="Sélectionner des saveurs"
				className="w-full text-base lg:text-sm bg-white/80 backdrop-blur-sm border-slate-200/60 focus:border-slate-400 dark:bg-slate-800/80 dark:border-slate-700/60 dark:focus:border-slate-500"
				hidePlaceholderWhenSelected
			/>
		</div>
	);
};

export default FlavorSelector;
