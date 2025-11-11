import React from 'react'
import { Box, Flex, Text, Card, Grid } from '@radix-ui/themes'

const Dashboard = () => {
  // Sample data for KPIs
  const kpis = {
    totalBookings: 142,           // number of bookings this month
    activeTrips: 8,                // number of trips currently underway
    deviceUsagePct: 78,            // maybe % of mobile vs desktop usage
    customerSatisfactionPct: 92,  // e.g., survey rating
  }

  // Sample data for “Bookings Over Time” (bar chart)
  const bookingsOverTime = [
    { time: 'Week 1', value: 32 },
    { time: 'Week 2', value: 45 },
    { time: 'Week 3', value: 28 },
    { time: 'Week 4', value: 37 },
  ]

  // Sample data for “Traveler Activity” (line chart)
  const travelerActivity = [
    { day: 'Mon', newSignups: 12, bookings: 25 },
    { day: 'Tue', newSignups: 18, bookings: 30 },
    { day: 'Wed', newSignups: 14, bookings: 22 },
    { day: 'Thu', newSignups: 20, bookings: 35 },
    { day: 'Fri', newSignups: 16, bookings: 28 },
    { day: 'Sat', newSignups: 22, bookings: 40 },
    { day: 'Sun', newSignups: 15, bookings: 32 },
  ]

  // Sample data for “Destination Share” (donut chart)
  const destinationShare = [
    { name: 'Himachal & Kashmir', value: 39, color: '#FFA500' },
    { name: 'Kerala &-South', value: 27, color: '#87CEEB' },
    { name: 'International', value: 34, color: '#9370DB' },
  ]

  // Sample data for “Trip Completion Progress” (horizontal bar chart)
  const tripProgress = [
    { name: 'Manali–Kasol (next depart)', value: 48, color: '#FFA500' },
    { name: 'Kerala Monsoon Escape', value: 65, color: '#87CEEB' },
    { name: 'Ladakh Summer Circuit', value: 82, color: '#DA70D6' },
  ]

  // --- Donut chart calculations
  const donutSize = 200
  const donutRadius = 80
  const donutCenter = donutSize / 2
  let currentAngle = -90   // start from top

  const donutPaths = destinationShare.map((item) => {
    const angle = (item.value / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad   = (endAngle   * Math.PI) / 180

    const x1 = donutCenter + donutRadius * Math.cos(startAngleRad)
    const y1 = donutCenter + donutRadius * Math.sin(startAngleRad)
    const x2 = donutCenter + donutRadius * Math.cos(endAngleRad)
    const y2 = donutCenter + donutRadius * Math.sin(endAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    return {
      path: `M ${donutCenter} ${donutCenter} L ${x1} ${y1} A ${donutRadius} ${donutRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      color: item.color,
      name: item.name,
      value: item.value,
    }
  })

  const maxBookingValue = Math.max(...bookingsOverTime.map(d => d.value))
  const maxActivityValue = Math.max(...travelerActivity.flatMap(d => [d.newSignups, d.bookings]))

  return (
    <Box style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box mb="6">
        <Text size="8" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}>
          Admin Dashboard – Safar Wanderlust
        </Text>
        <Text size="3" style={{ color: 'var(--accent-11)' }}>
          Here’s your travel business overview at a glance.
        </Text>
      </Box>

      {/* Summary Cards */}
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4" mb="6">
        <Card style={{ padding: '20px' }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="2" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                Total Bookings (Month)
              </Text>
              <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                {kpis.totalBookings}
              </Text>
            </Box>
            <Box style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 165, 0, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 a10 10 0 1 0 0 20 10 10 0 0 0 0 -20zM12 8v4l2 2" />
              </svg>
            </Box>
          </Flex>
        </Card>

        <Card style={{ padding: '20px' }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="2" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                Active Trips
              </Text>
              <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                {kpis.activeTrips}
              </Text>
            </Box>
            <Box style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M9 16h6M8 8h8" />
              </svg>
            </Box>
          </Flex>
        </Card>

        <Card style={{ padding: '20px' }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="2" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                Device Usage (Mobile % )
              </Text>
              <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                {kpis.deviceUsagePct}%
              </Text>
            </Box>
            <Box style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(135, 206, 235, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4" />
              </svg>
            </Box>
          </Flex>
        </Card>

        <Card style={{ padding: '20px' }}>
          <Flex justify="between" align="center">
            <Box>
              <Text size="2" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                Customer Satisfaction
              </Text>
              <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                {kpis.customerSatisfactionPct}%
              </Text>
            </Box>
            <Box style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4 -4M12 2 a10 10 0 1 0 0 20 10 10 0 0 0 0 -20z" />
              </svg>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Grid */}
      <Grid columns={{ initial: '1', lg: '2' }} gap="6" mb="6">
        {/* Bookings Over Time – Bar Chart */}
        <Card style={{ padding: '24px' }}>
          <Flex justify="between" align="center" mb="4">
            <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
              Bookings Over Time
            </Text>
            <Box style={{
              padding: '4px 12px',
              backgroundColor: 'var(--accent-4)',
              borderRadius: '6px',
            }}>
              <Text size="1" style={{ color: 'var(--accent-11)' }}>
                This Month
              </Text>
            </Box>
          </Flex>
          <Box style={{ height: '256px', position: 'relative' }}>
            <Flex align="end" justify="between" gap="2" style={{ height: '100%' }}>
              {bookingsOverTime.map((item, index) => {
                const heightPct = (item.value / maxBookingValue) * 100
                return (
                  <Flex key={index} direction="column" align="center" style={{ flex: 1 }}>
                    <Box style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      minHeight: '4px',
                      background: 'linear-gradient(to top, #FFA500, #FF8C00)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                    }} />
                    <Text size="1" style={{ color: 'var(--accent-11)', marginTop: '8px' }}>
                      {item.time}
                    </Text>
                  </Flex>
                )
              })}
            </Flex>
            <Flex justify="between" mt="4">
              <Text size="1" style={{ color: 'var(--accent-11)' }}>0</Text>
              <Text size="1" style={{ color: 'var(--accent-11)' }}>{maxBookingValue}</Text>
            </Flex>
          </Box>
        </Card>

        {/* Traveler Activity – Line Chart */}
        <Card style={{ padding: '24px' }}>
          <Flex justify="between" align="center" mb="4">
            <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
              Traveler Activity
            </Text>
            <Flex gap="4">
              <Flex align="center" gap="2">
                <Box style={{
                  width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFA500',
                }} />
                <Text size="2" style={{ color: 'var(--accent-11)' }}>New Signups</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box style={{
                  width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#87CEEB',
                }} />
                <Text size="2" style={{ color: 'var(--accent-11)' }}>Bookings</Text>
              </Flex>
            </Flex>
          </Flex>
          <Box style={{ height: '256px', position: 'relative' }}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* grid lines */}
              {[0, 25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={`${100 - (y/75)*100}%`}
                  x2="100%"
                  y2={`${100 - (y/75)*100}%`}
                  stroke="var(--accent-6)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* newSignups line */}
              <polyline
                points={travelerActivity.map((d,i) =>
                  `${(i/(travelerActivity.length-1))*100}%,${100-(d.newSignups / maxActivityValue)*100}%`
                ).join(' ')}
                fill="none"
                stroke="#FFA500"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* bookings line */}
              <polyline
                points={travelerActivity.map((d,i) =>
                  `${(i/(travelerActivity.length-1))*100}%,${100-(d.bookings / maxActivityValue)*100}%`
                ).join(' ')}
                fill="none"
                stroke="#87CEEB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* data points */}
              {travelerActivity.map((d,i) => (
                <circle
                  key={`signup-${i}`}
                  cx={`${(i/(travelerActivity.length-1))*100}%`}
                  cy={`${100-(d.newSignups / maxActivityValue)*100}%`}
                  r="4"
                  fill="#FFA500"
                />
              ))}
              {travelerActivity.map((d,i) => (
                <circle
                  key={`booking-${i}`}
                  cx={`${(i/(travelerActivity.length-1))*100}%`}
                  cy={`${100-(d.bookings / maxActivityValue)*100}%`}
                  r="4"
                  fill="#87CEEB"
                />
              ))}
            </svg>
            <Flex justify="between" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 8px' }}>
              {travelerActivity.map((d,i) => (
                <Text key={i} size="1" style={{ color: 'var(--accent-11)', visibility: i%2===0 ? 'visible' : 'hidden' }}>
                  {d.day}
                </Text>
              ))}
            </Flex>
          </Box>
        </Card>

        {/* Destination Share – Donut Chart */}
        <Card style={{ padding: '24px' }}>
          <Text size="5" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
            Destination Share
          </Text>
          <Flex justify="center" align="center">
            <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
              {donutPaths.map((path, idx) => (
                <path
                  key={idx}
                  d={path.path}
                  fill={path.color}
                  stroke="var(--color-panel)"
                  strokeWidth="2"
                />
              ))}
              <circle
                cx={donutCenter}
                cy={donutCenter}
                r={donutRadius-40}
                fill="var(--color-panel)"
              />
            </svg>
          </Flex>
          <Box mt="6">
            {destinationShare.map((item, idx) => (
              <Flex key={idx} justify="between" align="center" mb="3">
                <Flex align="center" gap="3">
                  <Box style={{
                    width: '16px', height: '16px', borderRadius: '50%', backgroundColor: item.color,
                  }} />
                  <Text size="3" style={{ color: 'var(--accent-12)' }}>
                    {item.name}
                  </Text>
                </Flex>
                <Text size="3" weight="bold" style={{ color: 'var(--accent-11)' }}>
                  {item.value}%
                </Text>
              </Flex>
            ))}
          </Box>
        </Card>

        {/* Trip Progress – Horizontal Bar Chart */}
        <Card style={{ padding: '24px' }}>
          <Text size="5" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
            Trip Progress
          </Text>
          <Box>
            {tripProgress.map((item, idx) => (
              <Box key={idx} mb="6">
                <Flex justify="between" align="center" mb="2">
                  <Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
                    {item.name}
                  </Text>
                  <Text size="3" weight="bold" style={{ color: 'var(--accent-11)' }}>
                    {item.value}%
                  </Text>
                </Flex>
                <Box style={{
                  width: '100%',
                  height: '24px',
                  backgroundColor: 'var(--accent-4)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  <Box style={{
                    width: `${item.value}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: '12px',
                    transition: 'all 0.5s ease',
                  }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Grid>

      {/* Additional Info Section */}
      <Grid columns={{ initial: '1', lg: '2' }} gap="6">
        <Card style={{ padding: '24px' }}>
          <Text size="5" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
            Recent Activity
          </Text>
          <Box>
            {[
              { action: 'Kerala Monsoon Escape booked', time: '3 hours ago', status: 'success' },
              { action: 'Manali Kasol – Payment received', time: '5 hours ago', status: 'success' },
              { action: 'Ladakh Summer Circuit – 2 seats left', time: '8 hours ago', status: 'warning' },
              { action: 'New partner hotel added in Goa', time: '12 hours ago', status: 'info' },
            ].map((activity, index) => (
              <Box key={index} style={{ padding: '12px', backgroundColor: 'var(--accent-3)', borderRadius: '8px', marginBottom: '16px' }}>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="3">
                    <Box style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor:
                        activity.status === 'success' ? '#22c55e' :
                        activity.status === 'warning' ? '#eab308' : '#3b82f6',
                    }} />
                    <Text size="3" style={{ color: 'var(--accent-12)' }}>
                      {activity.action}
                    </Text>
                  </Flex>
                  <Text size="2" style={{ color: 'var(--accent-11)' }}>
                    {activity.time}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>

        <Card style={{ padding: '24px' }}>
          <Text size="5" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
            System Information
          </Text>
          <Box>
            {[
              { label: 'API Response Time', value: '120 ms', color: '#FFA500' },
              { label: 'Uptime (Last 24 h)', value: '99.9%', color: '#87CEEB' },
              { label: 'Pending Support Tickets', value: '3', color: '#9370DB' },
              { label: 'New Partner Requests', value: '2', color: '#22c55e' },
            ].map((info, idx) => (
              <Flex key={idx} justify="between" align="center" mb="4">
                <Text size="3" style={{ color: 'var(--accent-11)' }}>{info.label}</Text>
                <Flex align="center" gap="3">
                  <Box style={{
                    width: '128px', height: '8px', backgroundColor: 'var(--accent-4)', borderRadius: '4px', overflow: 'hidden',
                  }}>
                    <Box style={{
                      width: info.value.includes('%') ? info.value : 'auto',
                      height: '100%',
                      backgroundColor: info.color,
                      borderRadius: '4px',
                    }} />
                  </Box>
                  <Text size="3" weight="bold" style={{ color: 'var(--accent-12)', width: '48px', textAlign: 'right' }}>
                    {info.value}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Box>
        </Card>
      </Grid>
    </Box>
  )
}

export default Dashboard
