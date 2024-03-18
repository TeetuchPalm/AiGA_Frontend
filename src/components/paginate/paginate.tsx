import "./paginate.css"
export type Props = {
    currentPage: number
    lastPage: number
    isLastPage?: boolean
    setCurrentPage: (page: number) => void
}
export default function Pagination({
    currentPage,
    setCurrentPage,
    lastPage,
    isLastPage
}: Props) {
    const generatePageNumbers = () => {
        const results: JSX.Element[] = []
        let startPage = Math.max(currentPage - 1, 1)
        let endPage = Math.min(startPage + 2, lastPage)
        if (currentPage === lastPage) {
            startPage = Math.max(currentPage - 2, 1)
            endPage = currentPage
        } else if (currentPage === 1) {
            startPage = currentPage
            endPage = Math.min(currentPage + 2, lastPage)
        }
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                results.push(
                    <button
                        className="btn btn-sm page-button-active"
                        type="button"
                        disabled >
                            <div className="symbol">
                                {i}
                            </div>
                        </button>
                )
            }
            else {
                results.push(
                    <button
                        className="btn btn-sm page-button"
                        type="button"
                        onClick={() => setCurrentPage(i)}>
                            <div className="symbol">
                                {i}
                            </div>
                        </button>
                )
            }
        }
        return results
    }

    return (
        <div id = "paginate">
            <button className="btn btn-light btn-sm page-button" type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"
                    className="bi bi-arrow-left symbol" >
                    <path fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z">
                    </path>
                </svg></button>
                {generatePageNumbers()}  
            <button className="btn btn-light btn-sm page-button" type="button" disabled={isLastPage} onClick={() => setCurrentPage(currentPage + 1)}><svg
                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"
                className="bi bi-arrow-right symbol">
                <path fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z">
                </path>
            </svg></button>
        </div>
    )
}
