import { formatRelativeTime } from '@utils/helpers.js'
import { Card, CardHeader, CardBody, CardTitle } from '@components/common/Card.jsx'
import { Badge } from '@components/common/Badge.jsx'

export function ParticipantsTable({ participants, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Participants</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/6 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!participants || participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Participants</CardTitle>
        </CardHeader>
        <CardBody className="text-center py-8">
          <p className="text-gray-500">No participants yet</p>
          <p className="text-sm text-gray-400 mt-1">Users will appear here as they register and join the experiment</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Participants</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {participants.slice(0, 20).map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
                        {participant.profiles?.full_name?.[0]?.toUpperCase() || participant.profiles?.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{participant.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={participant.variation === 'daily_practice' ? 'primary' : 'success'}>
                      {participant.variation === 'daily_practice' ? 'Daily Practice' : 'Roadmap'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatRelativeTime(participant.assigned_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success-500"></span>
                      </span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

export function EventsTable({ events, loading }) {
  const eventIcons = {
    dashboard_viewed: '📊',
    practice_started: '🚀',
    practice_completed: '✅',
    roadmap_viewed: '🗺️',
    learning_goal_completed: '🎯',
  }

  const eventLabels = {
    dashboard_viewed: 'Dashboard Viewed',
    practice_started: 'Practice Started',
    practice_completed: 'Practice Completed',
    roadmap_viewed: 'Roadmap Viewed',
    learning_goal_completed: 'Goal Completed',
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-8 w-8 rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardBody className="text-center py-8">
          <p className="text-gray-500">No events recorded yet</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.slice(0, 20).map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{eventIcons[event.event_name] || '📝'}</span>
                      <span className="text-sm font-medium text-gray-900">{eventLabels[event.event_name] || event.event_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={event.variation === 'daily_practice' ? 'primary' : 'success'}>
                      {event.variation === 'daily_practice' ? 'A' : 'B'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatRelativeTime(event.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {JSON.stringify(event.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}