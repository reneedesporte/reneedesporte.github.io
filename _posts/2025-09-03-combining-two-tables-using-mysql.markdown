---
layout: post
title:  "Combining Two Tables Using MySQL"
date:   2025-09-03
categories: [mysql, leetcode]
---
I'm diving headfirst into MySQL with [this problem](https://leetcode.com/problems/combine-two-tables/description/) on [LeetCode](https://leetcode.com/u/rdesporte/), wherein I must "report the first name, last name, city, and state of each person in the `Person` table". The `Person` table has no city and state data &mdash; that's found in the `Address` table.

My completed submission on LeetCode can be found [here](https://leetcode.com/problems/combine-two-tables/submissions/1758801509/).

# Loops in MySQL
I need to report the data for each person ID in the `Person` table, which makes me think of **loops**. [GeeksforGeeks](https://www.geeksforgeeks.org/sql/loops-in-mysql/) says I can loop in MySQL with the `LOOP` command, so I begin my LeetCode entry by trying to execute this simple `SQL` code:

```sql
people: LOOP
  IF 1=0 THEN
    LEAVE people;
  END IF;
END LOOP people;
```

But this doesn't work because I need to create a `PROCEDURE` when writing compound statements ([source](https://dev.mysql.com/doc/refman/8.4/en/begin-end.html)).

## Procedures
A [`PROCEDURE`](https://dev.mysql.com/doc/refman/8.4/en/create-procedure.html) is often wrapped in a temporary change in the `DELIMETER` to avoid clashes between internal and external statements, but that seems to throw errors in LeetCode. So my code now looks like this:

```sql
CREATE PROCEDURE test()
 BEGIN
 people: LOOP
  IF 1=0 THEN
    LEAVE people;
  END IF;
 END LOOP people;
END;
```
This code reports no syntax errors, so I can move on to solving the problem itself: selecting the data.

# Selecting Data
Ok, sadly I wasted my time a bit with the `LOOP` stuff, since I can extract all the data I need with the [`SELECT`](https://dev.mysql.com/doc/refman/8.4/en/select.html) command, e.g.,

```sql
SELECT * FROM Person
```

The statement above just reports the entire `Person` table. I also need to report the `Address` data associated with each `Person` ID. The following statement gives me the subset of `Address` for people in `Person`:

```sql
SELECT city, state FROM Address WHERE personID IN (SELECT personID FROM Person);
```

So I need to combine these two statements and report null when `personID` from `Person` is not in `Address`. It seems like `JOIN` is the right tool for the job, and [this video](https://www.youtube.com/watch?v=G3lJAxg1cy8) was really helpful to explain it.

# Combining Data
Again, check out Bro Code's video (linked above). My code is now

```sql
SELECT *
FROM Person INNER JOIN Address
ON Person.personId = Address.personId;
```
which reports

![First submission](/assets/img/leetcode_combine_two_tables_first_submission.png)

You can probably see where this is going. A bit more tweaking here and there gives me **the final answer**:

```sql
SELECT firstName, lastName, city, state
FROM Person LEFT JOIN Address
ON Person.personId = Address.personId;
```

# Conclusion
I just applied some of the most basic MySQL commands to [complete an Easy LeetCode problem](https://leetcode.com/problems/combine-two-tables/submissions/1758801509/).
