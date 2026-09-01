import type { Meta, StoryObj } from "@storybook/react-vite";
import StatCard from "./StatCard";
import { Calendar, DollarSign, Car, CheckCircle } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Admin/StatCard",
  component: StatCard,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    title: "Total Bookings",
    value: 154,
    icon: <Calendar size={20} />,
    color: "blue",
    trend: "+12%",
    trendUp: true,
  },
};

export const Revenue: Story = {
  args: {
    title: "Total Revenue",
    value: "Rs 2,450,000",
    icon: <DollarSign size={20} />,
    color: "green",
  },
};

export const Compact: Story = {
  args: {
    title: "Available Car IN STOCK",
    value: 24,
    icon: <Car size={20} />,
    color: "emerald",
    compact: true,
  },
};

export const NegativeTrend: Story = {
  args: {
    title: "Cancelled",
    value: 20,
    icon: <CheckCircle size={20} />,
    color: "sky",
    trend: "-5%",
    trendUp: false,
  },
};