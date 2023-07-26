# Extended MUI Data Grid

This library contains an extended version of the [MUI X Data Grid](https://mui.com/x/react-data-grid/) that includes custom implementations of some of the paid features so that they can be used for free. All of these extended features are 100% opt in, and by default the `<ExtendedDataGrid />` component will function identically to the out-of-the-box MUI X `<DataGrid />`.

## Supported Paid Features

<details>
<summary>Multiple Column Sorting</summary>

[comparable MUI X feature](https://mui.com/x/react-data-grid/sorting/#multi-sorting)

```tsx
import { ExtendedDataGrid } from "extended-mui-data-grid";

const data = new Array(100).fill(null).map((_, idx) => ({
  name: `Column ${idx}`,
  someOtherField: `Value ${idx % 13}`,
  id: `${idx}`,
}));

const MyComponent: FC = () => {
  return (
    <ExtendedDataGrid
      rows={data}
      columns={[
        { field: "id" },
        { field: "name", sortable: true },
        { field: "someOtherField", sortable: true },
      ]}
    />
  );
};
```

</details>

<details>
<summary>Multiple Column Filtering</summary>

[comparable MUI X feature](https://mui.com/x/react-data-grid/filtering/multi-filters/)

```tsx
import { ExtendedDataGrid } from "extended-mui-data-grid";

const data = new Array(100).fill(null).map((_, idx) => ({
  name: `Column ${idx}`,
  someOtherField: `Value ${idx % 13}`,
  id: `${idx}`,
}));

const MyComponent: FC = () => {
  return (
    <ExtendedDataGrid
      rows={data}
      columns={[
        { field: "id" },
        { field: "name", filterable: true },
        { field: "someOtherField", filterable: true },
      ]}
    />
  );
};
```

</details>

<details>
<summary>Copy Row Data</summary>

[comparable MUI X feature](https://mui.com/x/react-data-grid/clipboard/#clipboard-copy)

Currently only supports single row selection/copying.

```tsx
import { ExtendedDataGrid, serializeRow } from "extended-mui-data-grid";

const data = new Array(100).fill(null).map((_, idx) => ({
  name: `Column ${idx}`,
  someOtherField: `Value ${idx % 13}`,
  id: `${idx}`,
}));

const MyComponent: FC = () => {
  return (
    <ExtendedDataGrid
      enableRowCopy
      onRowsCopied={(rows, serializedRows) => alert(serializedRows)}
      /**
       * optional, can use a custom serializing function to convert the selected
       * row(s) to a string. The default function (serializeRow) will convert the
       * row(s) to a csv-like string.
       */
      serializeRow={(row, idx) => serializeRow(row, idx)}
      rows={data}
      columns={[
        { field: "id" },
        { field: "name" },
        { field: "someOtherField" },
      ]}
    />
  );
};
```

</details>

<summary>Paste Row Data</summary>

[comparable MUI X feature](https://mui.com/x/react-data-grid/clipboard/#clipboard-paste)

Currently only supports full new row pasting, not pasting edits into an existing row

```tsx
import { ExtendedDataGrid, serializeRow } from "extended-mui-data-grid";

const data = new Array(100).fill(null).map((_, idx) => ({
  name: `Column ${idx}`,
  someOtherField: `Value ${idx % 13}`,
  id: `${idx}`,
}));

const MyComponent: FC = () => {
  const [rows, setRows] = useState(data);

  return (
    <ExtendedDataGrid
      enableRowCopy
      enableRowPaste
      onValidRowsPasted={(newRows) => {
        // presumably this gets sent to an api
        const savedRows = newRows.map((r) => ({ ...r, id: Math.random() }));
        setRows([...rows, ...savedRows]);
        return Promise.resolve(savedRows);
      }}
      onRowsCopied={(rows, serializedRows) => alert(serializedRows)}
      rows={rows}
      columns={[
        { field: "id" },
        { field: "name" },
        { field: "someOtherField" },
      ]}
    />
  );
};
```

</details>
