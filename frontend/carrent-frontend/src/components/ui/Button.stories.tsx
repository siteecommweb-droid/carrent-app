import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Book Now",
    variant: "default",
    asChild: false
  },
};

export const Outline: Story = {
  args: {
    children: "View Fleet",
    variant: "outline",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete Booking",
    variant: "destructive",
  },
};




