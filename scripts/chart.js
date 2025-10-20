import { BankAPI } from "./api.js";

export class Charts {
    static curentChart
    constructor() {
    }
  static async renderWeeklyChart(userId) {

    if(Charts.curentChart===undefined)document.querySelector(".dashboard-charts").style.display = "flex";

    const ctx = document.getElementById("weeklyTransactionsChart");
    if (!ctx) return console.error("❌ canvas پیدا نشد");

    const transactions = await BankAPI.getWeeklyTransactions(userId);
    if (!transactions.length)
      return console.warn("هیچ تراکنشی برای هفته اخیر نیست");

    // محاسبه مجموع تراکنش‌های هر روز
    const days = Array(7)
      .fill(0)
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

    const deposits = new Array(7).fill(0);
    const withdraws = new Array(7).fill(0);
    const balances = new Array(7).fill(0);

    transactions.forEach((t) => {
      const txDate = new Date(t.date).toISOString().split("T")[0];
      const index = days.indexOf(txDate);
      if (index === -1) return;

      if (t.toID === userId) deposits[index] += t.amount;
      if (t.fromID === userId) withdraws[index] += t.amount;
    });
   
    // محاسبه بالانس (واریز - برداشت)
    for (let i = 0; i < 7; i++) {
      balances[i] = deposits[i] - withdraws[i];
    }

    this.curentChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: days.map((d) => d.slice(5)), // فقط ماه و روز
        datasets: [
          {
            label: "واریز",
            data: deposits,
            backgroundColor: "rgba(46, 204, 113, 0.6)",
            borderColor: "rgba(46, 204, 113, 1)",
            borderWidth: 1,
          },
          {
            label: "برداشت",
            data: withdraws,
            backgroundColor: "rgba(231, 76, 60, 0.6)",
            borderColor: "rgba(231, 76, 60, 1)",
            borderWidth: 1,
          },
          {
            label: "تغییر موجودی",
            data: balances,
            type: "line",
            borderColor: "rgba(52, 152, 219, 1)",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: "#666",
              font: (ctx) => ({
                size: Math.max(10, ctx.chart.width / 60),
                family: "Vazirmatn, sans-serif",
              }),
              maxRotation: 0,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#444",
              font: (ctx) => ({
                size: Math.max(10, ctx.chart.height / 40),
                family: "Vazirmatn, sans-serif",
              }),
              callback: (v) => v.toLocaleString() + " ریال",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#333",
              font: (ctx) => ({
                size: Math.max(11, ctx.chart.width / 70),
                family: "Vazirmatn, sans-serif",
              }),
            },
          },
          tooltip: {
            bodyFont: { size: 12 },
            titleFont: { size: 13 },
            boxPadding: 5,
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 8,
          },
        },
        animation: {
          duration: 800,
          easing: "easeOutQuart",
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });
  }

  static async renderWeeklyTransactionsChart(userId) {
    const transactions = await BankAPI.getWeeklyTransactions(userId);

    // محاسبه مجموع تراکنش‌ها برای هر روز هفته
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    console.log(days);
    const dataPerDay = days.map((day) => {
      return transactions
        .filter((t) => new Date(t.date).getDay() === days.indexOf(day))
        .reduce((sum, t) => sum + t.amount, 0);
    });
    console.log(dataPerDay);

    const ctx = document
      .querySelector("#weeklyTransactionsChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "تراکنش (تومان)",
            data: dataPerDay,
            backgroundColor: "#3182ce",
            borderRadius: 6, // گوشه‌های گرد
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label +
                  ": " +
                  context.parsed.y.toLocaleString() +
                  " تومان"
                );
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString() + " تومان";
              },
            },
          },
        },
      },
    });
  }

  static BankChart = class {
    constructor(canvasId, dataPerDay) {
      // آرایه برچسب روزهای هفته (انگلیسی)
      const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

      // گرفتن context از canvas
      const ctx = document.querySelector("#" + canvasId)?.getContext("2d");
      console.log(ctx);
      if (!ctx) {
        console.error(`❌ Canvas with id "${canvasId}" not found!`);
        return;
      }

      // ساخت چارت
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: days,
          datasets: [
            {
              label: "تراکنش‌ها (تومان)",
              data: dataPerDay,
              backgroundColor: "#3182ce",
              hoverBackgroundColor: "#63b3ed",
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 800,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "تراکنش‌های هفتگی",
              color: "#2d3748",
              font: { size: 18, weight: "bold" },
            },
            tooltip: {
              backgroundColor: "#2b6cb0",
              titleFont: { size: 14 },
              bodyFont: { size: 13 },
              callbacks: {
                label: (context) =>
                  `${context.parsed.y.toLocaleString()} تومان`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value.toLocaleString() + " تومان",
              },
            },
          },
        },
      });
    }
  };
}
