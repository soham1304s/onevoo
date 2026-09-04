import React from 'react';
import { Link } from 'react-router-dom';

export default function CreatorPayoutsDashboard() {
  const kpis = [
    { label: 'TOTAL EARNINGS', value: '₹12,45,000', change: '+18% vs last month', changeType: 'positive' },
    { label: 'PENDING PAYOUTS', value: '₹2,30,000', sub: '2 payments', changeType: 'neutral' },
    { label: 'COMPLETED GIGS', value: '24', change: '+6 this month', changeType: 'positive' },
    { label: 'ON-TIME RATE', value: '98%', sub: 'Excellent', changeType: 'positive' },
  ];

  const recentActivity = [
    { title: 'Minimalist Furniture Campaign', city: 'Delhi NCR', amount: '₹45,000', status: 'Paid', statusColor: 'var(--accent-green)' },
    { title: 'Wireless Audio Tech Collab', city: 'Hyderabad', amount: '₹55,000', status: 'Processing', statusColor: 'var(--accent-purple)' },
    { title: 'Online Coding Boot Camp', city: 'Bengaluru', amount: '₹65,000', status: 'Pending', statusColor: 'var(--accent-gold)' },
    { title: 'Activewear Fitness Reels', city: 'Jaipur', amount: '₹65,000', status: 'Paid', statusColor: 'var(--accent-green)' },
  ];

  const timelineSteps = [
    { step: '01', title: 'Brief Accepted', date: 'Oct 10, 2026', done: true },
    { step: '02', title: 'Content Submitted', date: 'Oct 14, 2026', done: true },
    { step: '03', title: 'Approved by Brand', date: 'Oct 16, 2026', done: true },
    { step: '04', title: 'Payment Released', date: 'Oct 18, 2026', active: true, done: true },
  ];

  return (
    <section id="payouts" className="sec wrap payouts-section" style={{ position: 'relative', paddingBottom: '80px', marginBottom: '32px' }}>
      <div className="ambient-engineering-grid" />
      
      {/* Section Head */}
      <div className="sec-head" style={{ position: 'relative', zIndex: 1 }}>
        <span className="mono" style={{ color: 'var(--accent-purple)' }}>TRANSPARENT FINANCIALS</span>
        <h2>CREATOR PAYOUTS DASHBOARD</h2>
        <p>Track every collaboration, sponsor payment, and contract milestone in one unified place.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="payouts-kpi-grid" style={{ position: 'relative', zIndex: 1 }}>
        {kpis.map((kpi, idx) => (
          <div className="payout-kpi-card premium-card" key={idx}>
            <div className="kpi-label mono">{kpi.label}</div>
            <div className="kpi-val font-display">{kpi.value}</div>
            {kpi.change ? (
              <span className={`kpi-badge ${kpi.changeType}`}>
                {kpi.change}
              </span>
            ) : (
              <span className="kpi-sub mono">{kpi.sub}</span>
            )}
          </div>
        ))}
      </div>

      {/* Split Dashboard Content */}
      <div className="payouts-split-grid" style={{ position: 'relative', zIndex: 1, marginTop: '32px' }}>
        {/* Recent Activity Table */}
        <div className="recent-activity-panel premium-card">
          <div className="panel-header">
            <h3 className="mono" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>RECENT ACTIVITY</h3>
            <Link to="/opportunities" className="view-all-link mono" style={{ fontSize: '11px', color: 'var(--accent-purple)' }}>
              VIEW ALL →
            </Link>
          </div>
          <div className="activity-list">
            {recentActivity.map((item, idx) => (
              <div className="activity-row" key={idx}>
                <div className="activity-left">
                  <div className="activity-bullet" style={{ background: item.statusColor }} />
                  <div>
                    <h4 className="activity-title">{item.title}</h4>
                    <span className="activity-city mono">{item.city}</span>
                  </div>
                </div>
                <div className="activity-right">
                  <span className="activity-amount font-display">{item.amount}</span>
                  <span
                    className="activity-status-tag"
                    style={{
                      color: item.statusColor,
                      borderColor: item.statusColor,
                      backgroundColor: `${item.statusColor}18`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="payment-timeline-panel premium-card">
          <div className="panel-header">
            <h3 className="mono" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>PAYMENT TIMELINE</h3>
            <span className="timeline-live-tag mono" style={{ color: 'var(--accent-green)', fontSize: '11px' }}>
              ● LIVE ESCROW
            </span>
          </div>
          <div className="timeline-steps">
            {timelineSteps.map((step, idx) => (
              <div className={`timeline-step-item ${step.active ? 'is-active' : ''}`} key={idx}>
                <div className="step-circle mono">{step.step}</div>
                <div className="step-info">
                  <h4 className="step-title">{step.title}</h4>
                  <span className="step-date mono">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
