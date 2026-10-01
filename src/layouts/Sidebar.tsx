export default function Sidebar() {
  return (
    <aside className="sidebar">

      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}