import React from "react";
import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

const StorePagination = ({
	currentPage,
	setCurrentPage,
	totalPages,
	paginationItemsToDisplay = 3,
}: {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalPages: number;
	paginationItemsToDisplay?: number;
}) => {
	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay,
	});

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between max-w-full">
			<Pagination>
				<PaginationContent className="px-4 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					{/* First page button */}
					<PaginationItem>
						<PaginationLink
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							onClick={() => {
								setCurrentPage(1);
							}}
							aria-label="Go to first page"
							aria-disabled={currentPage === 1 ? true : undefined}
							role={currentPage === 1 ? "link" : undefined}>
							<ChevronFirstIcon size={16} aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Previous page button */}
					<PaginationItem>
						<PaginationLink
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							onClick={() => {
								if (currentPage > 1) setCurrentPage(currentPage - 1);
							}}
							aria-label="Go to previous page"
							aria-disabled={currentPage === 1 ? true : undefined}
							role={currentPage === 1 ? "link" : undefined}>
							<ChevronLeftIcon size={16} aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Left ellipsis (...) */}
					{showLeftEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Page number links */}
					{pages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
								onClick={() => setCurrentPage(page)}
								isActive={page === currentPage}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Right ellipsis (...) */}
					{showRightEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Next page button */}
					<PaginationItem>
						<PaginationLink
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							onClick={() => {
								if (currentPage < totalPages) setCurrentPage(currentPage + 1);
							}}
							aria-label="Go to next page"
							aria-disabled={currentPage === totalPages ? true : undefined}
							role={currentPage === totalPages ? "link" : undefined}>
							<ChevronRightIcon size={16} aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Last page button */}
					<PaginationItem>
						<PaginationLink
							className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							onClick={() => {
								setCurrentPage(totalPages);
							}}
							aria-label="Go to last page"
							aria-disabled={currentPage === totalPages ? true : undefined}
							role={currentPage === totalPages ? "link" : undefined}>
							<ChevronLastIcon size={16} aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export default StorePagination;
