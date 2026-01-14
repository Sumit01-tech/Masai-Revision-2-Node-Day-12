# Day 12: MongoDB Aggregation & Relationships

This document contains **theoretical explanations** for MongoDB Aggregation Framework and Data Modeling concepts. These answers are **interview-ready** and suitable for backend development roles.

---

## 1. What is the aggregation framework in MongoDB?

The **aggregation framework** in MongoDB is a powerful data processing pipeline that allows you to **transform, filter, group, and analyze data** inside the database.

It processes documents **stage by stage**, where the output of one stage becomes the input of the next stage.

**Use cases:**

* Analytics and reporting
* Data transformation
* Complex queries (grouping, joining, calculating totals)

---

## 2. Explain the stages in aggregation pipeline

### $match

Filters documents (similar to `find()`)

```js
{ $match: { status: "active" } }
```

### $group

Groups documents and performs calculations

```js
{ $group: { _id: "$category", total: { $sum: "$price" } } }
```

### $project

Selects or reshapes fields

```js
{ $project: { name: 1, price: 1, _id: 0 } }
```

### $sort

Sorts documents

```js
{ $sort: { createdAt: -1 } }
```

### $limit

Limits number of documents

```js
{ $limit: 10 }
```

---

## 3. What is $lookup? How do you perform joins in MongoDB?

`$lookup` performs a **left outer join** between two collections.

```js
{
  $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "userId",
    as: "orders"
  }
}
```

MongoDB does **joins at query time**, not like relational databases.

---

## 4. What is $unwind? When would you use it?

`$unwind` breaks an **array field into multiple documents**.

```js
{ $unwind: "$orders" }
```

**Use cases:**

* Flatten array data
* Apply `$group` or `$match` on array elements

---

## 5. What are aggregation expressions and operators?

Aggregation expressions are used to **compute values** inside pipelines.

### Common operators:

* `$sum`
* `$avg`
* `$min`, `$max`
* `$concat`
* `$cond`
* `$ifNull`

Example:

```js
{ $group: { _id: null, avgPrice: { $avg: "$price" } } }
```

---

## 6. How do you handle one-to-many relationships in MongoDB?

### Method 1: Referencing (Recommended)

```js
// User
{ _id: 1, name: "John" }

// Orders
{ orderId: 101, userId: 1 }
```

Use `$lookup` to join.

### Method 2: Embedding

```js
{ _id: 1, name: "John", orders: [...] }
```

**Rule:** Embed if data is small and accessed together.

---

## 7. How do you handle many-to-many relationships in MongoDB?

### Referencing on both sides

```js
// Students
{ _id: 1, courses: [101, 102] }

// Courses
{ _id: 101, students: [1, 2] }
```

Or use a **junction collection**:

```js
{ studentId: 1, courseId: 101 }
```

---

## 8. What is data modeling in MongoDB? Explain the 6 rules of thumb.

Data modeling is the process of **structuring data** based on application needs.

### 6 Rules of Thumb:

1. Favor embedding over referencing
2. One-to-few → embed
3. One-to-many → reference
4. Avoid unbounded arrays
5. Duplicate data if it improves performance
6. Design schema based on queries, not storage

---

## 9. What are atomic operations in MongoDB?

Atomic operations ensure **single-document operations are fully completed or not applied at all**.

Examples:

* `$set`
* `$inc`
* `$push`
* `$pull`

MongoDB guarantees atomicity at **document level**.

---

## 10. What is a transaction in MongoDB? When should you use it?

A **transaction** allows multiple operations across **multiple documents or collections** to execute atomically.

### Use transactions when:

* Updating multiple collections
* Financial operations
* Maintaining strict consistency

```js
session.startTransaction();
```

Transactions have performance cost — use only when required.

---



