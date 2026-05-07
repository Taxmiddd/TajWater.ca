import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'TajWater — #1 Water Delivery Service in Metro Vancouver'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #003d4d 0%, #006064 35%, #0097a7 65%, #0277bd 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background circle decorations */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '220px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Wave at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '60% 60% 0 0 / 40px 40px 0 0',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 72px',
            height: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Top row: Logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                }}
              >
                💧
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '42px',
                    fontWeight: 900,
                    color: 'white',
                    letterSpacing: '-1px',
                    lineHeight: 1,
                  }}
                >
                  TajWater
                </span>
                <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>
                  tajwater.ca
                </span>
              </div>
            </div>

            {/* Price badge */}
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '16px',
                padding: '10px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.5px' }}>
                STARTING FROM
              </span>
              <span style={{ fontSize: '38px', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
                $8.99
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>per 5-gallon jug</span>
            </div>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '58px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.05,
                letterSpacing: '-1.5px',
              }}
            >
              Pure Water Delivery
            </span>
            <span
              style={{
                fontSize: '58px',
                fontWeight: 900,
                color: 'rgba(183,234,247,0.95)',
                lineHeight: 1.05,
                letterSpacing: '-1.5px',
              }}
            >
              Across Metro Vancouver
            </span>
          </div>

          {/* Key features row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '⚡', text: 'Same-Day Available' },
              { icon: '📍', text: '21 Cities Covered' },
              { icon: '❌', text: 'No Contracts Ever' },
              { icon: '💦', text: 'Spring · Alkaline · Distilled' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.14)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  borderRadius: '40px',
                  padding: '8px 18px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ fontSize: '16px', color: 'white', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom city list */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginRight: '4px' }}>
              SERVING:
            </span>
            {['Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'Langley', 'North Van', '+ 14 more'].map((city) => (
              <span
                key={city}
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.75)',
                  padding: '3px 10px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                }}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
