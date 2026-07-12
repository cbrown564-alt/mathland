# Module 2 comprehension question bank and scoring key

**Facilitator copy — do not show this file during a lesson.** Status: draft for mathematical/editorial review and a wording pilot before scored sessions. Freeze the reviewed revision with the study wave.

Ask the three items for the assigned lesson immediately after the participant leaves the lesson. Do not permit reopening it. Read prompts exactly, accept mathematically equivalent wording, record the response before scoring, and give no partial credit. Each item scores 0 or 1 according to the key.

## 2.1 Vector Basics

1. **Explain:** What information makes a vector different from a scalar?  
   **Score 1:** states that a vector has both magnitude/size and direction, while a scalar has magnitude/size only.
2. **Apply:** A displacement is 6 units east and 8 units north. Write its vector and find its magnitude.  
   **Score 1:** `[6, 8]` (or equivalent column vector) and magnitude `10`, with no material error.
3. **Misconception:** Is `[0, 0]` a unit vector because it starts at the origin? Explain.  
   **Score 1:** no; its magnitude is 0, while a unit vector has magnitude 1.

## 2.2 Addition and Scalar Multiplication

1. **Explain:** What does adding two movement vectors represent geometrically?  
   **Score 1:** describes tip-to-tail composition and/or the resultant from the original start to the final endpoint.
2. **Apply:** Calculate `[2, -1] + 3[1, 2]`.  
   **Score 1:** `[5, 5]`.
3. **Misconception:** Does multiplying a nonzero vector by `-2` only double its length? Explain.  
   **Score 1:** no; it doubles the magnitude and reverses the direction.

## 2.3 The Dot Product

1. **Explain:** What does the sign of a dot product tell you about two nonzero vectors?  
   **Score 1:** positive means broadly aligned/acute, zero means perpendicular, and negative means broadly opposed/obtuse. All three relationships are required.
2. **Apply:** Calculate `[2, 3] · [4, -1]`.  
   **Score 1:** `5`.
3. **Misconception:** Two long vectors have dot product zero. Must one of them be the zero vector? Explain.  
   **Score 1:** no; two nonzero perpendicular vectors also have dot product zero.

## 2.4 Vector Norms

1. **Explain:** Why might L1 and L2 give different distances for the same displacement?  
   **Score 1:** distinguishes axis-aligned/city-block travel (L1) from straight-line Euclidean distance (L2).
2. **Apply:** For `v = [-3, 4]`, give its L1, L2, and L-infinity norms.  
   **Score 1:** `7`, `5`, and `4`, assigned to the correct norms.
3. **Misconception:** Does normalizing a nonzero vector change the direction it points? Explain.  
   **Score 1:** no; dividing by its norm changes the magnitude to 1 while preserving direction.

## 2.5 Linear Combinations

1. **Explain:** In your own words, what is the span of a set of vectors?  
   **Score 1:** every vector/result obtainable from all scalar-weighted combinations of the given vectors.
2. **Apply:** Using `u = [1, 0]` and `v = [0, 1]`, choose coefficients that make `[3, -2]`.  
   **Score 1:** `3u - 2v`, or coefficients `3` and `-2` in the correct order.
3. **Misconception:** Do two vectors in R2 always span the whole plane? Explain.  
   **Score 1:** no; they must be non-parallel/linearly independent (and neither can add only the same direction).

## 2.6 Linear Independence

1. **Explain:** What makes one vector redundant in a set?  
   **Score 1:** it can be expressed as a linear combination of the other vectors and therefore adds no new direction/capability.
2. **Apply:** Are `[1, 0]`, `[0, 1]`, and `[1, 1]` linearly independent? Explain briefly.  
   **Score 1:** no; `[1, 1] = [1, 0] + [0, 1]` (or equivalent nontrivial zero-combination reasoning).
3. **Misconception:** Can three vectors be linearly independent in R2 if none is the zero vector? Explain.  
   **Score 1:** no; R2 has dimension 2, so any set of more than two vectors is dependent.

## 2.7 Basis and Dimension

1. **Explain:** What two properties must a set have to be a basis for a vector space?  
   **Score 1:** linear independence and spanning the whole space.
2. **Apply:** Do `[1, 0]` and `[1, 1]` form a basis for R2? If so, express `[3, 2]` in that basis.  
   **Score 1:** yes, with coefficients `1` and `2`: `1[1,0] + 2[1,1]`.
3. **Misconception:** Can two different bases of the same vector space contain different numbers of vectors? Explain.  
   **Score 1:** no; every basis of a given finite-dimensional space has the same number of vectors, its dimension.

## 2.8 Vector Spaces

1. **Explain:** Name the two operations a vector space must support and one kind of rule they must obey.  
   **Score 1:** vector addition and scalar multiplication, plus at least one valid rule such as closure, associativity, commutativity of addition, distributivity, zero, additive inverses, or scalar identity.
2. **Apply:** Treating 2×2 real matrices as vectors, what is the zero vector and what is the dimension of the space?  
   **Score 1:** the all-zero 2×2 matrix and dimension `4`.
3. **Misconception:** Must the elements of a vector space be geometric arrows? Explain.  
   **Score 1:** no; matrices, polynomials/functions, coordinate tuples, and other objects can be vectors if the operations satisfy the vector-space rules.

## 2.9 Forest Mapping Capstone

1. **Explain:** Give one mapping decision suited to vector addition and a different decision suited to linear independence.  
   **Score 1:** valid distinct examples, such as combining trail legs for addition and avoiding redundant camera/coverage directions for independence.
2. **Apply:** A route goes from `[0,0]` to `[3,4]`, then to `[6,8]`. Give the two leg vectors, resultant displacement, and total L2 path length.  
   **Score 1:** legs `[3,4]` and `[3,4]`, resultant `[6,8]`, total path length `10`.
3. **Misconception:** If two proposed coordinate directions span the park map, are they automatically a basis? Explain.  
   **Score 1:** not automatically; they must also be linearly independent (if one is redundant, the set is not a basis).

## Review record

| Review | Reviewer | Date | Revision / notes |
|---|---|---|---|
| Mathematical accuracy | | | pending |
| Plain-language/editorial | | | pending |
| Non-participant wording pilot | | | pending |

