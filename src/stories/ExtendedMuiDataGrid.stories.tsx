// YourComponent.stories.ts|tsx
import { faker } from "@faker-js/faker";
import { GridValidRowModel } from "@mui/x-data-grid";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExtendedDataGrid } from "../components";

interface RowItem extends GridValidRowModel {
  name: string;
  address: string;
  annoyingValues: string;
  id: number;
}

const meta: Meta<typeof ExtendedDataGrid> = {
  component: ExtendedDataGrid,
};

export default meta;
type Story = StoryObj<typeof ExtendedDataGrid>;

export const FirstStory: Story = {
  render: () => {
    const [rows, setRows] = useState<RowItem[]>(
      new Array(5).fill(null).map<RowItem>((_, idx) => ({
        id: idx,
        name: `Column ${idx + 1}`,
        address: faker.location.streetAddress().toString(),
        annoyingValues: `this "is" a,, "test '," with troublesome " characters`,
      }))
    );
    const [loading, setLoading] = useState(false);

    const simulatedApiSave = useCallback(
      async (newRows: RowItem[]) => {
        setLoading(true);
        try {
          const savedRows = await new Promise<RowItem[]>((resolve, reject) => {
            setTimeout(() => {
              if (Math.random() < 0.3) return reject(new Error("API error"));
              resolve(newRows.map((r) => ({ ...r, id: Math.random() })));
            }, 1000);
          });
          setRows([...rows, ...savedRows]);
          toast.success("Row Saved");
          setLoading(false);
          return savedRows;
        } catch (err) {
          toast.error("Failed to save");
          setLoading(false);
          throw err;
        }
      },
      [rows]
    );

    return (
      <div>
        <ExtendedDataGrid
          loading={loading}
          columns={[
            { field: "name", sortable: true, filterable: true, width: 130 },
            { field: "address", filterable: true, width: 200 },
            { field: "annoyingValues", width: 200 },
          ]}
          enableRowCopy={true}
          enableClipboardPaste={true}
          rows={rows}
          onValidRowsPasted={simulatedApiSave}
        />
        <ToastContainer />
      </div>
    );
  },
};
