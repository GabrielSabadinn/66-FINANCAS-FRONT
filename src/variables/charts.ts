// src/variables/charts.ts
import { useTranslation } from "react-i18next";

// Define the type for recharts data
export interface RechartsDataPoint {
  name: string;
  [key: string]: number | string; // Dynamic keys for values (e.g., "Mobile Apps", "Websites")
}

// Define the type for recharts options (simplified, as recharts doesn't use the same options structure as ApexCharts)
export interface RechartsOptions {
  // Add any custom options if needed (recharts uses props directly, so this can be minimal)
}

// Data for the bar chart (Active Users)
export const getBarChartDataDashboard = (): RechartsDataPoint[] => {
  const { t } = useTranslation();
  const months = [
    t("charts.months.apr"),
    t("charts.months.may"),
    t("charts.months.jun"),
    t("charts.months.jul"),
    t("charts.months.aug"),
    t("charts.months.sep"),
    t("charts.months.oct"),
    t("charts.months.nov"),
    t("charts.months.dec"),
  ];
  const data = [330, 250, 110, 300, 490, 350, 270, 130, 425];
  return months.map((month, index) => ({
    name: month,
    [t("charts.sales")]: data[index],
  }));
};

// Options for the bar chart (not used directly by recharts, but kept for reference)
export const getBarChartOptionsDashboard = () => {
  const { t } = useTranslation();
  return {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: "Plus Jakarta Display",
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: "Plus Jakarta Display",
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: [
        t("charts.months.apr"),
        t("charts.months.may"),
        t("charts.months.jun"),
        t("charts.months.jul"),
        t("charts.months.aug"),
        t("charts.months.sep"),
        t("charts.months.oct"),
        t("charts.months.nov"),
        t("charts.months.dec"),
      ],
      show: false,
      labels: {
        show: false,
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      color: "#fff",
      labels: {
        show: true,
        style: {
          colors: "#fff",
          fontSize: "12px",
          fontFamily: "Plus Jakarta Display",
        },
      },
    },
    grid: {
      show: false,
    },
    fill: {
      colors: "#fff",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "12px",
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
            },
          },
        },
      },
    ],
  };
};

// Data for the line chart (Data by Month)
export const getLineChartDataDashboard = (): RechartsDataPoint[] => {
  const { t } = useTranslation();
  const months = [
    t("charts.months.jan"),
    t("charts.months.feb"),
    t("charts.months.mar"),
    t("charts.months.apr"),
    t("charts.months.may"),
    t("charts.months.jun"),
    t("charts.months.jul"),
    t("charts.months.aug"),
    t("charts.months.sep"),
    t("charts.months.oct"),
    t("charts.months.nov"),
    t("charts.months.dec"),
  ];
  const mobileAppsData = [
    500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400,
  ];
  const websitesData = [
    200, 230, 300, 350, 370, 420, 550, 350, 400, 500, 330, 550,
  ];

  return months.map((month, index) => ({
    name: month,
    [t("user.entries")]: mobileAppsData[index],
    [t("user.expenses")]: websitesData[index],
  }));
};

// Options for the line chart (not used directly by recharts, but kept for reference)
export const getLineChartOptionsDashboard = () => {
  const { t } = useTranslation();
  return {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        t("charts.months.jan"),
        t("charts.months.feb"),
        t("charts.months.mar"),
        t("charts.months.apr"),
        t("charts.months.may"),
        t("charts.months.jun"),
        t("charts.months.jul"),
        t("charts.months.aug"),
        t("charts.months.sep"),
        t("charts.months.oct"),
        t("charts.months.nov"),
        t("charts.months.dec"),
      ],
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: "#56577A",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#2CD9FF", "#582CFF"],
    },
    colors: ["#2CD9FF", "#582CFF"],
  };
};

// Data for the line chart (Profile 1)
export const getLineChartDataProfile1 = (): RechartsDataPoint[] => {
  const { t } = useTranslation();
  const months = [
    t("charts.months.jan"),
    t("charts.months.feb"),
    t("charts.months.mar"),
    t("charts.months.apr"),
    t("charts.months.may"),
    t("charts.months.jun"),
    t("charts.months.jul"),
    t("charts.months.aug"),
    t("charts.months.sep"),
    t("charts.months.oct"),
    t("charts.months.nov"),
    t("charts.months.dec"),
  ];
  const mobileAppsData = [
    100, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400,
  ];

  return months.map((month, index) => ({
    name: month,
    [t("user.entries")]: mobileAppsData[index],
  }));
};

// Options for the line chart (Profile 1)
export const getLineChartOptionsProfile1 = () => {
  const { t } = useTranslation();
  return {
    chart: {
      height: "50px",
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        t("charts.months.jan"),
        t("charts.months.feb"),
        t("charts.months.mar"),
        t("charts.months.apr"),
        t("charts.months.may"),
        t("charts.months.jun"),
        t("charts.months.jul"),
        t("charts.months.aug"),
        t("charts.months.sep"),
        t("charts.months.oct"),
        t("charts.months.nov"),
        t("charts.months.dec"),
      ],
      labels: {
        show: false,
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      borderColor: "#56577A",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#01B574"],
    },
    colors: ["#01B574"],
  };
};

// Data for the line chart (Profile 2)
export const getLineChartDataProfile2 = (): RechartsDataPoint[] => {
  const { t } = useTranslation();
  const months = [
    t("charts.months.jan"),
    t("charts.months.feb"),
    t("charts.months.mar"),
    t("charts.months.apr"),
    t("charts.months.may"),
    t("charts.months.jun"),
    t("charts.months.jul"),
    t("charts.months.aug"),
    t("charts.months.sep"),
    t("charts.months.oct"),
    t("charts.months.nov"),
    t("charts.months.dec"),
  ];
  const mobileAppsData = [
    100, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400,
  ];

  return months.map((month, index) => ({
    name: month,
    [t("user.entries")]: mobileAppsData[index],
  }));
};

// Options for the line chart (Profile 2)
export const getLineChartOptionsProfile2 = () => {
  const { t } = useTranslation();
  return {
    chart: {
      height: "50px",
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        t("charts.months.jan"),
        t("charts.months.feb"),
        t("charts.months.mar"),
        t("charts.months.apr"),
        t("charts.months.may"),
        t("charts.months.jun"),
        t("charts.months.jul"),
        t("charts.months.aug"),
        t("charts.months.sep"),
        t("charts.months.oct"),
        t("charts.months.nov"),
        t("charts.months.dec"),
      ],
      labels: {
        show: false,
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      borderColor: "#56577A",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#582CFF"],
    },
    colors: ["#582CFF"],
  };
};
