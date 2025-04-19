import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { range } from "@/lib/utils";

interface RookieShopPaginationProps {
  currentPageNumber: number
  numberOfPages?: number
  setCurrentPageNumber: (pageNumber: number) => void
}

function RookieShopPagination({ currentPageNumber, numberOfPages, setCurrentPageNumber }: RookieShopPaginationProps) {
  if (numberOfPages) {
    return (
      <div className="flex flex-row content-center">
        <Pagination>
          <PaginationContent>
            {currentPageNumber > 1
            &&
            <PaginationItem key={"previous"}>
              <PaginationPrevious onClick={() => setCurrentPageNumber(currentPageNumber - 1)} />
            </PaginationItem>}

            {numberOfPages <= 6
            &&
            range(1, numberOfPages).map((index) => {
              return (
                <PaginationItem key={index}>
                  <PaginationLink isActive={currentPageNumber == index} onClick={() => setCurrentPageNumber(index)}>
                    {index}
                  </PaginationLink>
                </PaginationItem>
              );
            })
            }

            {numberOfPages > 6
            &&
            <>
              <PaginationItem key={1}>
                <PaginationLink isActive={currentPageNumber == 1} onClick={() => setCurrentPageNumber(1)}>
                  1
                </PaginationLink>
              </PaginationItem>

              {(currentPageNumber - 1 > 2) && <PaginationEllipsis />}

              {
                range(Math.max(2, currentPageNumber - 1), Math.min(numberOfPages - 1, currentPageNumber + 1)).map((index) => {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink isActive={currentPageNumber == index} onClick={() => setCurrentPageNumber(index)}>
                        {index}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })
              }

              {(currentPageNumber + 1 < numberOfPages - 1) && <PaginationEllipsis />}

              <PaginationItem key={numberOfPages}>
                <PaginationLink isActive={currentPageNumber == numberOfPages} onClick={() => setCurrentPageNumber(numberOfPages)}>
                  {numberOfPages}
                </PaginationLink>
              </PaginationItem>
            </>
            }

            {currentPageNumber < numberOfPages
            &&
            <PaginationItem key={"next"}>
              <PaginationNext onClick={() => setCurrentPageNumber(currentPageNumber + 1)} />
            </PaginationItem>}
          </PaginationContent>
        </Pagination>
      </div>
    );
  }

  return (
    <div className="flex flex-row content-center">
        <Pagination>
          <PaginationContent>
            {currentPageNumber > 1
            &&
            <PaginationItem key={"previous"}>
              <PaginationPrevious onClick={() => setCurrentPageNumber(currentPageNumber - 1)} />
            </PaginationItem>}

            <PaginationItem key={"next"}>
              <PaginationNext onClick={() => setCurrentPageNumber(currentPageNumber + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination> 
    </div>
  );
}

export default RookieShopPagination;