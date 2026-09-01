import { createContext, useContext, useState, ReactNode } from "react";

export type Ticket = {
  id: string;
  type: "website" | "email";
  subject: string;
  message: string;
  customerName: string;
  email: string;
  phone?: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  linkedBookingId?: string;
};

type TicketContextType = {
  tickets: Ticket[];
  createTicket: (ticket: Omit<Ticket, "id" | "createdAt">) => void;
  updateTicketStatus: (id: string, status: Ticket["status"]) => void;
};

const TicketContext = createContext<TicketContextType>(
  {} as TicketContextType
);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const createTicket = (ticket: Omit<Ticket, "id" | "createdAt">) => {
    const newTicket: Ticket = {
      ...ticket,
      id: "TKT-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  return (
    <TicketContext.Provider
      value={{ tickets, createTicket, updateTicketStatus }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  return useContext(TicketContext);
}




