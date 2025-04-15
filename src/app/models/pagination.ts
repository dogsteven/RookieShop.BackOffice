export default interface Pagination<TItem> {
  count: number
  pageNumber: number
  pageSize: number
  items: TItem[]
}