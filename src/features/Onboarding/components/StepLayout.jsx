export function StepLayout({ children, actions }) {
  return <div className="onboarding-screen">
    <div className="onboarding-screen-body">{children}</div>
    {actions && <footer className="onboarding-actions">{actions}</footer>}
  </div>
}
