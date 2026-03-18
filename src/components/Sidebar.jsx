import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#f0f0f0", padding: "20px" }}>
      <h2>SupportFlow</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/tickets">Tickets</Link></li>
          <li><Link to="/ticket-comments">Ticket Comments</Link></li>
          <li><Link to="/departments">Departments</Link></li>
        </ul>
      </nav>
    </div>
  );
}
