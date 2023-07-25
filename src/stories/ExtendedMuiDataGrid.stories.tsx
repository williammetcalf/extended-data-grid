// YourComponent.stories.ts|tsx

import type { Meta, StoryObj } from "@storybook/react";
import { ExtendedDataGrid } from "../components";
import { faker } from "@faker-js/faker";

const meta: Meta<typeof ExtendedDataGrid> = {
  component: ExtendedDataGrid,
};

export default meta;
type Story = StoryObj<typeof ExtendedDataGrid>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
    columns: [
      { field: "name", sortable: true, filterable: true, width: 130 },
      { field: "address", filterable: true, width: 200 },
    ],
    rows: new Array(200).fill(null).map((_, idx) => ({
      id: idx,
      name: `Column ${idx + 1}`,
      address: faker.location.streetAddress().toString(),
    })),
  },
};
