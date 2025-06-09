import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
  type WhereFilterOp,
  type OrderByDirection,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./firebase"

export interface QueryOptions {
  filters?: Array<{
    field: string
    operator: WhereFilterOp
    value: any
  }>
  sort?: Array<{
    field: string
    direction?: OrderByDirection
  }>
  pageSize?: number
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  collectionPath: string
}

export interface PaginatedResult<T> {
  items: T[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

export const firestoreUtils = {
  /**
   * Execute an optimized query with pagination support
   */
  async executeQuery<T>(options: QueryOptions): Promise<PaginatedResult<T>> {
    const { filters = [], sort = [], pageSize = 10, startAfterDoc, collectionPath } = options

    // Build query constraints
    const constraints: QueryConstraint[] = []

    // Add filters
    filters.forEach(({ field, operator, value }) => {
      constraints.push(where(field, operator, value))
    })

    // Add sorting
    sort.forEach(({ field, direction = "asc" }) => {
      constraints.push(orderBy(field, direction))
    })

    // Add pagination
    constraints.push(limit(pageSize + 1)) // Get one extra to check if there are more

    // Create base query
    let q = query(collection(db, collectionPath), ...constraints)

    // Add start after for pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    // Execute query
    const snapshot = await getDocs(q)

    // Process results
    const items: T[] = []
    let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
    let hasMore = false

    // Check if we have more results than requested page size
    if (snapshot.docs.length > pageSize) {
      hasMore = true
      // Remove the extra item
      snapshot.docs.pop()
    }

    // Get the last document for pagination
    if (snapshot.docs.length > 0) {
      lastDoc = snapshot.docs[snapshot.docs.length - 1]
    }

    // Convert documents to data
    snapshot.docs.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as T)
    })

    return { items, lastDoc, hasMore }
  },

  /**
   * Create a compound searchable field for text search
   */
  createSearchableField(fields: Record<string, string>): string {
    // Combine all fields into a single searchable string
    return Object.values(fields)
      .filter(Boolean)
      .map((value) => value.toLowerCase())
      .join(" ")
  },

  /**
   * Create a date range query
   */
  createDateRangeQuery(
    collectionPath: string,
    dateField: string,
    startDate: Date,
    endDate: Date,
    additionalConstraints: QueryConstraint[] = [],
  ) {
    return query(
      collection(db, collectionPath),
      where(dateField, ">=", startDate),
      where(dateField, "<=", endDate),
      ...additionalConstraints,
    )
  },

  /**
   * Execute a batch operation for multiple documents
   */
  async batchOperation(
    operations: Array<{
      type: "set" | "update" | "delete"
      path: string
      id: string
      data?: any
    }>,
  ): Promise<void> {
    // Implementation would use Firebase batch operations
    // This is a placeholder for the actual implementation
  },
}
