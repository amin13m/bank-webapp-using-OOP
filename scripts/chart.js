import { BankAPI } from "./api.js";
import { Bank } from "../models/Bank.js";
import { Auth } from "../models/Auth.js";


export class Charts {
  static curentChart;
  static curentPieChart
  constructor() {}
  static async renderWeeklyChart(userId) {
    if (Charts.curentChart === undefined)
      document.querySelector(".chart-card").style.display = "flex";

    const ctx = document
      .getElementById("weeklyTransactionsChart")
      .getContext("2d");
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

    const gradientGreen = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientGreen.addColorStop(0, "rgba(46, 204, 112, 1)"); 
    gradientGreen.addColorStop(1, "rgba(46, 204, 112, 0.49)"); 

    const gradientRed = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientRed.addColorStop(0, "rgba(231, 76, 60, 1)"); 
    gradientRed.addColorStop(1, "rgba(231, 77, 60, 0.53)"); 

const gradientBlue = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientBlue.addColorStop(0, "rgba(52, 152, 219, 0.06)"); 
    gradientBlue.addColorStop(1, "rgba(52, 152, 219, 0.36)"); 

    if(this.curentChart !== undefined)this.curentChart.destroy()

    this.curentChart = new Chart(ctx, {
      type: "bar",
      data: {

        labels: days.map((d) => d.slice(5)), // فقط ماه و روز
        datasets: [
          {
            label: "واریز",
            data: deposits,
            backgroundColor: gradientGreen,
            borderColor: "rgba(46, 204, 113, 1)",
            borderWidth: 1,
            borderRadius: 10
          },
          {
            label: "برداشت",
            data: withdraws,
            backgroundColor: gradientRed,
            borderColor: "rgba(231, 76, 60, 1)",
            borderWidth: 1,
            borderRadius: 10
          },
          {
            label: "تغییر موجودی",
            data: balances,
            type: "line",
            borderColor: "rgba(52, 152, 219, 1)",
            backgroundColor: gradientBlue,
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
              color: "#f8f6f6ff",
              font: (ctx) => ({
                size: Math.max(10, ctx.chart.width / 60),
                family: "Vazirmatn, sans-serif",
              }),
              maxRotation: 0,
              autoSkip: true,
            },
             grid: {
                    color: "rgba(255, 255, 255, 0.3)" // رنگ خطوط عمودی
                }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#f8f6f6ff",
              font: (ctx) => ({
                size: Math.max(10, ctx.chart.height / 40),
                family: "Vazirmatn, sans-serif",
              }),
              callback: (v) => v.toLocaleString() + " تومان",
            },
            grid: {
                    color: "rgba(255, 255, 255, 0.3)" // رنگ خطوط افقی
                }
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#f8f6f6ff",
              font: (ctx) => ({
                size: Math.max(11, ctx.chart.width / 70),
                family: "Vazirmatn, sans-serif",
              }),
              usePointStyle: true, 
              pointStyle: 'circle',
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
          legend: { 
            display: false ,
            usePointStyle: true, 
            pointStyle: 'circle',
        },
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



///////pie chart

  

  static async renderBalancePie() {
    document.querySelector("#balancePieChart")
      .classList.remove("hidden");

    const ctx = document.getElementById("balancePieChart").getContext("2d");
    if (!ctx) return console.error("❌ canvas برای Pie Chart پیدا نشد");

       const gradientGreen = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientGreen.addColorStop(0, "rgba(46, 204, 112, 0.29)"); 
    gradientGreen.addColorStop(1, "rgba(204, 207, 3, 1)"); 

    const gradientRed = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientRed.addColorStop(0, "rgba(231, 77, 60, 0.27)"); 
    gradientRed.addColorStop(1, "rgba(238, 78, 4, 1)"); 

const gradientBlue = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
    gradientBlue.addColorStop(0, "rgba(52, 105, 219, 0.2)"); 
    gradientBlue.addColorStop(1, "rgba(0, 4, 223, 1)"); 




    // فرض بر این که اکانت‌های یوزر از بانک گرفته می‌شوند
    
    const userAccounts = Bank.findUsersAccounts(Auth.currentUser);

    if (userAccounts.length === 0) {
      console.warn("⚠️ هیچ حسابی برای کاربر وجود ندارد");
      return;
    }

    const labels = userAccounts.map(acc =>  acc.id);
    const balances = userAccounts.map(acc => acc.balence);

    if(this.curentPieChart !== undefined)this.curentPieChart.destroy()

    this.curentPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "موجودی حساب‌ها",
            data: balances,
            backgroundColor: [
              gradientBlue,
              gradientGreen,
              gradientRed,
              "rgba(231, 60, 217, 0.7)"
            ],
            borderColor: "#fff",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {  
                font: { family: "IRANSans", size: 10 ,color :"#f8f6f6ff" } ,
                usePointStyle: true, 
                pointStyle: 'circle', //  دایره‌ای ('rect', 'triangle', 'rectRounded', 'rectRot', 'cross', 'star', 'line')
                color: "#f8f6f6ff"
            }
            
        },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: (${ctx.parsed.toLocaleString()} تومان)`
            }
          },
        }
      }
    });
  }
}
