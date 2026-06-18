"use client";

import { Tabs, Tab } from "@heroui/react";
import { MapPin, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui";
import DeliveryCitiesList from "./DeliveryCitiesList";
import DeliveryDaysList from "./DeliveryDaysList";

const DeliveryManager = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Livraison"
        description="Gérez les villes desservies et les jours de livraison"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Livraison" },
        ]}
      />

      <Tabs
        aria-label="Configuration de la livraison"
        variant="underlined"
        classNames={{
          tabList: "gap-6 border-b border-[#E8E4DC] p-0",
          cursor: "bg-[#2D5A3D]",
          tab: "px-0 h-10",
          tabContent:
            "text-[0.83rem] text-[#888880] group-data-[selected=true]:text-[#2D5A3D] group-data-[selected=true]:font-semibold",
        }}
      >
        <Tab
          key="cities"
          title={
            <div className="flex items-center gap-2">
              <MapPin size={15} />
              <span>Villes</span>
            </div>
          }
        >
          <DeliveryCitiesList />
        </Tab>
        <Tab
          key="days"
          title={
            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>Jours de livraison</span>
            </div>
          }
        >
          <DeliveryDaysList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default DeliveryManager;
