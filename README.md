# Extended MUI Data Grid

This library contains an extended version of the [MUI X Data Grid](https://mui.com/x/react-data-grid/) that includes custom implementations of some of the paid features so that they can be used for free. All of these extended features are 100% opt in, and by default the `<ExtendedDataGrid />` component will function identically to the out-of-the-box MUI X `<DataGrid />`.

## Supported Paid Features

- multiple column sorting [mui doc](https://mui.com/x/react-data-grid/sorting/#multi-sorting)
<details>
<summary>Example</summary>

```tsx
import { ExtendedDataGrid } from "extended-mui-data-grid";

const data = new Array(100)
  .fill(null)
  .map((_, idx) => ({ name: `Column ${idx}`, id: `${idx}` }));

const MyComponent: FC = () => {
  return (
    <ExtendedDataGrid
      rows={data}
      columns={[{ field: "id" }, { field: "name", sortable: true }]}
    />
  );
};
```

</details>

- multiple column filtering with multiple concurrent filters on a given column [mui doc](https://mui.com/x/react-data-grid/filtering/multi-filters/)
- copy row data (currently only single row selection supported) [mui doc](https://mui.com/x/react-data-grid/clipboard/#clipboard-copy)
