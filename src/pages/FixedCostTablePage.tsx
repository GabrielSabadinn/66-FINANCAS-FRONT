import React from "react";
import FixedCostTable from "@/components/FixedCostTable";

const FixedCostTablePage: React.FC = () => {
  const backgroundStyle = {
    background:
      "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
  };

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-6 text-white"
      style={backgroundStyle}
    >
      <div className="max-w-4xl mx-auto w-full pt-14 md:pt-16">
        <FixedCostTable />
      </div>
    </div>
  );
};

export default FixedCostTablePage;
