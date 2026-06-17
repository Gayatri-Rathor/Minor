import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  income: "#10b981",
  expense: "#f43f5e",
  budget: "#6366f1",
  savings: "#f59e0b",
  chart: ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#06b6d4", "#ec4899"],
};

// ─── Sample / Default Data ────────────────────────────────────────────────────
const DEFAULT_MONTHLY = [
  { month: "Jan", income: 52000, expense: 38000, savings: 14000 },
  { month: "Feb", income: 48000, expense: 41000, savings: 7000 },
  { month: "Mar", income: 55000, expense: 37000, savings: 18000 },
  { month: "Apr", income: 60000, expense: 44000, savings: 16000 },
  { month: "May", income: 58000, expense: 40000, savings: 18000 },
  { month: "Jun", income: 63000, expense: 47000, savings: 16000 },
];

const DEFAULT_CATEGORY = [
  { name: "Housing", value: 14000 },
  { name: "Food", value: 8500 },
  { name: "Transport", value: 4200 },
  { name: "Health", value: 3100 },
  { name: "Shopping", value: 5800 },
  { name: "Others", value: 3400 },
];

const DEFAULT_BUDGET = [
  { category: "Housing", budget: 15000, spent: 14000 },
  { category: "Food", budget: 9000, spent: 8500 },
  { category: "Transport", budget: 4000, spent: 4200 },
  { category: "Health", budget: 4000, spent: 3100 },
  { category: "Shopping", budget: 5000, spent: 5800 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={styles.tooltip}>
      <p style={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ ...styles.tooltipItem, color: p.color }}>
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

// ─── Chart Cards ─────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>{title}</h3>
          {subtitle && <p style={styles.cardSubtitle}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Income vs Expense Area Chart ─────────────────────────────────────────────
function IncomeExpenseChart({ data = DEFAULT_MONTHLY }) {
  return (
    <ChartCard
      title="Income vs Expenses"
      subtitle="Monthly cash flow overview"
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.25} />
              <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.expense} stopOpacity={0.25} />
              <stop offset="95%" stopColor={COLORS.expense} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={styles.axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={styles.axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={styles.legend} />
          <Area type="monotone" dataKey="income" stroke={COLORS.income} strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
          <Area type="monotone" dataKey="expense" stroke={COLORS.expense} strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Savings Trend Line Chart ─────────────────────────────────────────────────
function SavingsTrendChart({ data = DEFAULT_MONTHLY }) {
  return (
    <ChartCard title="Savings Trend" subtitle="Net savings per month">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={styles.axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={styles.axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="savings"
            stroke={COLORS.savings}
            strokeWidth={3}
            dot={{ fill: COLORS.savings, r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7 }}
            name="Savings"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Category Pie Chart ───────────────────────────────────────────────────────
function CategoryPieChart({ data = DEFAULT_CATEGORY }) {
  const [active, setActive] = useState(null);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const pct = ((data[index].value / total) * 100).toFixed(0);
    if (pct < 7) return null;
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {pct}%
      </text>
    );
  };

  return (
    <ChartCard title="Spending by Category" subtitle="Where your money goes">
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <ResponsiveContainer width="55%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS.chart[i % COLORS.chart.length]}
                  opacity={active === null || active === i ? 1 : 0.45}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex: 1, minWidth: 120 }}>
          {data.map((d, i) => (
            <div
              key={i}
              style={styles.legendRow}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span style={{ ...styles.legendDot, background: COLORS.chart[i % COLORS.chart.length] }} />
              <span style={styles.legendName}>{d.name}</span>
              <span style={styles.legendValue}>₹{d.value.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ─── Budget vs Spent Bar Chart ─────────────────────────────────────────────────
function BudgetChart({ data = DEFAULT_BUDGET }) {
  return (
    <ChartCard title="Budget vs Actual" subtitle="Track how close you are to your limits">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="category" tick={styles.axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={styles.axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={styles.legend} />
          <Bar dataKey="budget" fill={COLORS.budget} radius={[4, 4, 0, 0]} name="Budget" opacity={0.5} />
          <Bar dataKey="spent" radius={[4, 4, 0, 0]} name="Spent">
            {data.map((d, i) => (
              <Cell key={i} fill={d.spent > d.budget ? COLORS.expense : COLORS.income} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={styles.note}>
        🔴 Red bars = over budget &nbsp;|&nbsp; 🟢 Green bars = within budget
      </p>
    </ChartCard>
  );
}

// ─── Summary Stats Row ────────────────────────────────────────────────────────
function SummaryStats({ data = DEFAULT_MONTHLY }) {
  const latest = data[data.length - 1] || {};
  const prev = data[data.length - 2] || {};
  const savRate = latest.income ? ((latest.savings / latest.income) * 100).toFixed(1) : 0;
  const expDelta = prev.expense ? (((latest.expense - prev.expense) / prev.expense) * 100).toFixed(1) : 0;

  const stats = [
    { label: "Monthly Income", value: `₹${(latest.income || 0).toLocaleString("en-IN")}`, color: COLORS.income, icon: "↑" },
    { label: "Monthly Expenses", value: `₹${(latest.expense || 0).toLocaleString("en-IN")}`, color: COLORS.expense, icon: expDelta > 0 ? "↑" : "↓" },
    { label: "Net Savings", value: `₹${(latest.savings || 0).toLocaleString("en-IN")}`, color: COLORS.savings, icon: "◈" },
    { label: "Savings Rate", value: `${savRate}%`, color: COLORS.budget, icon: "%" },
  ];

  return (
    <div style={styles.statsRow}>
      {stats.map((s, i) => (
        <div key={i} style={styles.statCard}>
          <span style={{ ...styles.statIcon, color: s.color }}>{s.icon}</span>
          <p style={styles.statLabel}>{s.label}</p>
          <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Tab Selector ─────────────────────────────────────────────────────────────
const TABS = ["Overview", "Trends", "Categories", "Budget"];

// ─── Main Charts Component ────────────────────────────────────────────────────
export default function Charts({
  monthlyData,
  categoryData,
  budgetData,
}) {
  const [tab, setTab] = useState("Overview");

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.heading}>Analytics</h2>
        <p style={styles.subheading}>Visual breakdown of your financial health</p>
      </div>

      {/* Summary */}
      <SummaryStats data={monthlyData} />

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Chart Grid */}
      <div style={styles.grid}>
        {(tab === "Overview" || tab === "Trends") && (
          <IncomeExpenseChart data={monthlyData} />
        )}
        {(tab === "Overview" || tab === "Trends") && (
          <SavingsTrendChart data={monthlyData} />
        )}
        {(tab === "Overview" || tab === "Categories") && (
          <CategoryPieChart data={categoryData} />
        )}
        {(tab === "Overview" || tab === "Budget") && (
          <BudgetChart data={budgetData} />
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: { marginBottom: "20px" },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: 0,
  },
  subheading: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statIcon: { fontSize: "20px", fontWeight: 700 },
  statLabel: { fontSize: "12px", color: "#64748b", margin: 0 },
  statValue: { fontSize: "20px", fontWeight: 700, margin: 0 },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "8px 20px",
    borderRadius: "999px",
    border: "1px solid #1e293b",
    background: "transparent",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.18s",
  },
  tabActive: {
    background: "#6366f1",
    border: "1px solid #6366f1",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "22px 20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#e2e8f0",
    margin: 0,
  },
  cardSubtitle: {
    fontSize: "12px",
    color: "#64748b",
    margin: "3px 0 0",
  },
  axisTick: { fill: "#475569", fontSize: 11 },
  legend: { fontSize: "12px", color: "#94a3b8" },
  tooltip: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
  },
  tooltipLabel: { color: "#94a3b8", margin: "0 0 6px", fontWeight: 600 },
  tooltipItem: { margin: "2px 0", fontWeight: 500 },
  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 6px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendName: { fontSize: "12px", color: "#94a3b8", flex: 1 },
  legendValue: { fontSize: "12px", color: "#e2e8f0", fontWeight: 600 },
  note: {
    fontSize: "11px",
    color: "#475569",
    margin: "10px 0 0",
    textAlign: "center",
  },
};
