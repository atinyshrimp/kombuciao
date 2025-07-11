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
	paginationItemsToDisplay = 5,
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

	return (
		<Pagination>
			<PaginationContent>
				{/* First page button */}
				<PaginationItem>
					<PaginationLink
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
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
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
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
							className="cursor-pointer"
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
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
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
						className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
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
	);
};

export default StorePagination;
