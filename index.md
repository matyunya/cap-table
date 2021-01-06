# Cap table

## Introduction

Cap table is a tool for startup financing. It allows to calculate stakeholder's share at any given moment, share price and other useful data. It is a visualization of all the startup's investors' position at any given moment.

In the beginning founder or founders own 100% of arbitrary amount of shares which are being sold at each round to interested parties until the IPO. Let's illustrate the first two steps as a simple markup table and a few inputs.
#### Initial state when founded

{ fndShares = input({ type: "number", label: "founder shares", value: 3000 }) }

{ initialSharePrice = input({ type: "number", label: "share price, ¥", value: 1000 }) }

| Investor | # shares      | % shares                            |
|----------|---------------|-------------------------------------|
|Founder   | { fndShares } | { calcShare(fndShares, fndShares) } |

{
  b = roundResults({
    sharePrice: initialSharePrice,
    sharesEmitted: fndShares
  })
}

#### Angel round 1

{ angelShares = input({ type: "number", label: "angel 1 purchased shares", value: 576 }) }

{ angelOnesharePrice = input({ type: "number", label: "share price", value: 80000 }) }

Total number of shares: { totalShares = Number(angelShares) + Number(fndShares) }.

| Investor | # shares         | % shares                                |
|----------|------------------|-----------------------------------------|
|Founder   | { fndShares }    | { calcShare(fndShares, totalShares) }   |
|Angels 1  | { angelShares }  | { calcShare(angelShares, totalShares) } |

{
  a = roundResults({
    sharePrice: angelOnesharePrice,
    sharesEmitted: angelShares,
    previousTotalShares: fndShares,
  })
}

There are a few options we need to introduce but this is the simplest version of the model.

## Table component

Next, we need to create a simple expandable table component. Just like in the example above we want to be able to add new investors and rounds. For now, our application will contain a Map of investors and a Map of rounds.

We're using ellx spreadsheet component to build a simple expandable table.

Rows: { nRows = slider({ value: 3, max: 15 }) }

Columns: { nCols = slider({ value: 3, max: 7 }) }

{ sheet({ nRows, nCols }) }

Next let's figure out how to convert tabular data to ellx blocks format. Please refer to the `testBlocks` node on the [sheet](https://ellx.io/matyunya/cap-table/index.ellx).

{ output(testBlocks.get(0)) }

`Position` stands for `[topLeftY, topLeftX, bottomRightY, bottomRightX]`.

{ sheet({ nRows, nCols, blocks: testBlocks }) }

Next, let's add [headlong](https://ellx.io/matyunya/headlong) styles to cells.

{ output(testBlocksWithStyle.get(0)) }

{ sheet({ nRows, nCols, blocks: testBlocksWithStyle }) }

At this point we have everything to render the cap table statically before we bring in user interaction. Let's take a closer look at the table structure.

Rows:
- Three top rows are reserved for headers;
- Row 4 is always founder;
- Then come rows of _groups of investors participating in each round_, top row grouping all data;
- Next comes row with column totals;
- Finally we have four rows for round results: share price, new equity, pre- and post-money.

Columns:
- Column 1 is names/labels;
- Columns 2 and 3 are always initial "founded" round with number and percent of shares;
- All following columns are investment rounds data:
  - share±
  - #shares
  - $shares
  - Potentially voting (TODO: clarify meaning)
    - share±
    - #shares
  - Total #shares
  - Total %shares

Let's put all of it together in a function which accepts our store and returns blocks. Next we're building a simple form which allows to add investors and rounds, and display their labels in the table reactively.

First, we need to calculate total rows/columns for the table:

<div class="font-mono text-xs px-4 py-2 bg-gray-100">

Headers (3) + Investors ({ $investors.size }) + Total + Round results =  **{ rows = rowsCount($investorsRowSpan) } ROWS **

First column (1) + (Each round * round type column span) = **{ cols = colsCount($roundsRowSpan) } COLUMNS**

</div>

Next we must modify ellx gridline code to allow row and colspan.

{ makeSheetWith(storeWithRowSpan) }

{ investorFormName = input({ label: "Name", size: 2 }) }
{ investorFormType = select({ label: "Type", value: "Employees", options: investorTypes }) }

{ button({ label: "Add investor", onClick: () => storeWithRowSpan.appendInvestors([uid(), {
  name: investorFormName,
  type: investorFormType || "employee",
}]) })}

{ roundFormName = input({ label: "Name", size: 2 }) }
{ roundFormDate = input({ size: 2, type: "date" }) }
{ roundFormType = select({ label: "Type", value: "Rounds", options: roundTypes }) }

{ button({ label: "Add round", onClick: () => storeWithRowSpan.appendRounds([uid(), {
  name: roundFormName,
  date: roundFormDate,
  type: roundFormType || "angel",
}]) })}

## Intermediate results

At this point we have:

- Functioning table view of given store consisting of rounds/investors;
- Store mutations allowing CRUD operations on data;
- Round result calculations.

Next steps:

- Share calculation/storage logic;
- Individual cell calculations;
- Aggregate rows (investor groups);
- Editable cells;
- Add round/investor button;
- Investors' table view.

## Share calculation and display

Any non-label cell in the cap table must belong to a round and an investor or a group of investors. Depending on column type it may require calculation results from the same or previous round, or may aggregate calculations from the same column.

We should also keep in mind that display and real value of a cell should differ like in Excel.

Individual cell may be editable and have a bound mutation, otherwise any cell is derived, hence not editable. So we're adding [`onChange`](https://ellx.io/matyunya/cap-table/options.js) prop to columns to signify editable cells. At the moment editable cell is discerned only by hand cursor pointer.

{ makeSheetWith(shareCalcStore) }

## Aggregate rows

Next we need to introduce aggregate rows for each investor group and each column total at the bottom right above round results. Before we do actual aggregate calculations we need to add group labels, recalculate row positions to provide space for aggregates. Luckily all cells' positions are determined by `getPosition` function which has all required data to split investors into groups.

Next to calculate aggregate data we simply need to reduce individual cell values over grouped data.

## Kinds of rounds

### Common

### J-kiss

J-Kiss is a kind of convertible equity method based on [SAFE](https://www.ycombinator.com/documents/) originally invented by Y-combinator.

J-kiss is Japanese version of SAFE and made by 500 startups (now they are
called coral capital) and a little bit different from the original. But the basic
concept is the same. At the J-Kiss round, investors cannot know how many
shares they can get. They just invest some amount of money to the company
with the conditions, which are valuation cap and discount rate. They will know
the number of shares they can get just before the next round.
Before the next round, they need to decide the share price for J-Kiss investors.
If valuation cap is smaller than Pre Money, then the share price will be
(valuation cap)/(total number of shares issued before J-kiss round). And
once the share price is fixed, the number of share J-kiss investors get will be
decided by dividing the amount of money they invest by the share price.

### Preferred

When they choose prefered instead of J-kiss or common, conditions need to be added such as "Liquidation Preference", "Optional Conversion" and so on. (TBD)

### Stock split?

## Potentially voting?

## Employee stock options

## IPO
