import { useMemo, useState } from "react"
import { IdObj, PaginateProps } from "~/types/table"

type UsePaginationProps = {
  data: IdObj[]
  paginate: boolean | PaginateProps
  search: boolean
  searchTerm: string
}

type UsePaginationReturn = {
  paginatedData: IdObj[]
  perPage: number
  totalPages: number
  totalData: IdObj[]
  page: number
  handlePageChange: (newPage: number) => void
}

export const usePagination = ({
  data,
  paginate,
  search,
  searchTerm,
}: UsePaginationProps): UsePaginationReturn => {
  const [page, setPage] = useState(
    typeof paginate === "boolean" || !paginate ? 1 : paginate.page ?? 1,
  )

  const perPage = useMemo(
    () => (typeof paginate === "boolean" || !paginate ? 5 : paginate.perPage ?? 5),
    [paginate],
  )

  const totalData = useMemo(
    () =>
      search && searchTerm
        ? data.filter((row) => {
            const columns = Object.values(row).map((column) =>
              typeof column === "object" ? column.value : column,
            )
            const filter = columns.join().toLowerCase().trim()
            const exists = filter.includes(searchTerm.toLowerCase().trim())
            return exists
          })
        : data,
    [data, search, searchTerm],
  )

  const totalPages = useMemo(
    () =>
      typeof paginate === "boolean" || !paginate
        ? Math.ceil(totalData.length / perPage)
        : paginate.totalPages ?? Math.ceil(totalData.length / perPage),
    [totalData, perPage, paginate],
  )

  const paginatedData = useMemo(
    () => (paginate ? totalData.slice((page - 1) * perPage, page * perPage) : totalData),
    [totalData, paginate, page, perPage],
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return { paginatedData, perPage, totalPages, totalData, page, handlePageChange }
}
