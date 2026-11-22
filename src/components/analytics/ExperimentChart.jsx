import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardBody, CardTitle } from '@components/common/Card.jsx'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4']

export function CompletionRateChart({ data }) {
  const chartData = [
    { name: 'Daily Practice', rate: data.variationA?.completionRate || 0, fullName: 'Variation A' },
    { name: 'Personalized Roadmap', rate: data.variationB?.completionRate || 0, fullName: 'Variation B' },
  ]

  if (chartData.every(d => d.rate === 0)) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle>Practice Completion Rate</CardTitle>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-[300px]">
          <div className="text-center text-gray-500">
            <p className="font-medium">No experiment data yet</p>
            <p className="text-sm mt-1">Completion rates will appear once users complete practice sessions</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>Practice Completion Rate by Variation</CardTitle>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={140} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Completion Rate']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export function DailyEngagementChart({ data }) {
  const chartData = data.dailyEngagement || []

  if (chartData.length === 0) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle>Daily Engagement (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-[300px]">
          <div className="text-center text-gray-500">
            <p className="font-medium">No engagement data yet</p>
            <p className="text-sm mt-1">Daily activity will appear as users interact with the platform</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>Daily Engagement (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="Dashboard Views"
            />
            <Line
              type="monotone"
              dataKey="starts"
              stroke={COLORS[1]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="Practice Started"
            />
            <Line
              type="monotone"
              dataKey="completions"
              stroke={COLORS[2]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="Practice Completed"
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export function ExperimentFunnelChart({ data }) {
  const funnelData = [
    { stage: 'Assigned', count: data.totalParticipants || 0, color: COLORS[3] },
    { stage: 'Viewed Dashboard', count: data.events?.filter(e => e.event_name === 'dashboard_viewed').length || 0, color: COLORS[0] },
    { stage: 'Started Practice', count: data.events?.filter(e => e.event_name === 'practice_started').length || 0, color: COLORS[1] },
    { stage: 'Completed Practice', count: data.events?.filter(e => e.event_name === 'practice_completed').length || 0, color: COLORS[2] },
  ]

  const maxCount = Math.max(...funnelData.map(d => d.count), 1)

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>Experiment Funnel</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {funnelData.map((item, index) => (
            <div key={item.stage} className="flex items-center gap-4">
              <div className="w-32 text-right text-sm font-medium text-gray-600">{item.stage}</div>
              <div className="flex-1 h-10 bg-gray-100 rounded overflow-hidden relative">
                <div
                  className="h-full rounded-l"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="w-20 text-left text-sm font-semibold text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export function VariationComparisonChart({ data }) {
  const chartData = [
    {
      name: 'Daily Practice',
      participants: data.variationA?.participants || 0,
      sessions: data.variationA?.sessionsStarted || 0,
      completed: data.variationA?.sessionsCompleted || 0,
      color: COLORS[0],
    },
    {
      name: 'Personalized Roadmap',
      participants: data.variationB?.participants || 0,
      sessions: data.variationB?.sessionsStarted || 0,
      completed: data.variationB?.sessionsCompleted || 0,
      color: COLORS[1],
    },
  ]

  if (chartData.every(d => d.participants === 0)) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle>Variation Comparison</CardTitle>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-[300px]">
          <div className="text-center text-gray-500">
            <p className="font-medium">No experiment participants yet</p>
            <p className="text-sm mt-1">Data will appear once users are assigned to variations</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>Variation Comparison</CardTitle>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={160} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="participants" radius={[0, 4, 4, 0]} maxBarSize={30} name="Participants" fill={COLORS[3]} />
            <Bar dataKey="sessions" radius={[0, 4, 4, 0]} maxBarSize={30} name="Sessions Started" fill={COLORS[0]} />
            <Bar dataKey="completed" radius={[0, 4, 4, 0]} maxBarSize={30} name="Sessions Completed" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export function PieChartComponent({ data, title, dataKey, nameKey, colors = COLORS }) {
  if (!data || data.length === 0 || data.every(d => d[dataKey] === 0)) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody className="flex items-center justify-center h-[300px]">
          <div className="text-center text-gray-500">
            <p className="font-medium">No data available</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, '']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}