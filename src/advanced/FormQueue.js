import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:8000";
const socket = io(BACKEND_URL);

export default function App() {
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState(null);
  const [active, setActive] = useState(false);

  // Form state
  const [memberCount, setMemberCount] = useState(1);
  const [members, setMembers] = useState([{ name: "", age: "", aadhaar: "" }]);
  const [formCode, setFormCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Queue/active tracking
  const [queueLength, setQueueLength] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  // Simulate userId
  const userId = React.useRef("user_" + Math.floor(Math.random() * 100000)).current;

  // Track if we sent the initial enterForm request
  const [joinedOnce, setJoinedOnce] = useState(false);

  // Real-time: listen for queue updates
  useEffect(() => {
    socket.on("queueUpdated", ({ queueLength, activeCount, waitingList }) => {
      setQueueLength(queueLength);
      setActiveCount(activeCount);

      if (status === "waiting" && waitingList) {
        const pos = waitingList.indexOf(userId);
        setPosition(pos >= 0 ? pos + 1 : null);
      }
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, [status, userId]);

  // 👇 Auto-upgrade when at front of queue and slot available
  useEffect(() => {
    if (status === "waiting" && position === 1 && activeCount < 3 && !active) {
      upgradeToActive();
    }
  }, [status, position, activeCount, active]);

  // Try to upgrade user to active slot
  const upgradeToActive = async () => {
    if (!active) {
      const response = await fetch(`${BACKEND_URL}/adv/enter-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setStatus(data.status);
      setMessage(data.message);
      setPosition(data.position || null);
      setActive(data.status === "active");
    }
  };

  // Join queue/form
  const enterForm = async () => {
    if (joinedOnce) return;
    setJoinedOnce(true);
    const response = await fetch(`${BACKEND_URL}/adv/enter-form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    setStatus(data.status);
    setMessage(data.message);
    setPosition(data.position || null);
    setActive(data.status === "active");
  };

  // Leave form
  const leaveForm = async () => {
    await fetch(`${BACKEND_URL}/adv/leave-form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setStatus("");
    setMessage("You left the form.");
    setPosition(null);
    setActive(false);
    setFormCode("");
    setMembers([{ name: "", age: "", aadhaar: "" }]);
    setMemberCount(1);
    setJoinedOnce(false);
  };

  // Handle member count
  const handleMemberCount = (count) => {
    setMemberCount(count);
    setMembers(
      Array.from({ length: count }, (_, i) => members[i] || { name: "", age: "", aadhaar: "" })
    );
  };

  // Member change
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await fetch(`${BACKEND_URL}/adv/submit-form`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberCount, members, userId }),
    });
    const data = await response.json();
    setSubmitting(false);

    if (data.success) {
      setFormCode(data.code);
      setMessage(data.message);
      // Redirect after success:
      window.location.href = "/asd";
    } else {
      setMessage("Submission failed: " + (data.error || ""));
    }
  };

  // UI Member Fields
  const renderMemberInputs = () =>
    members.map((member, i) => (
      <div key={i} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, marginBottom: 12 }}>
        <h4 style={{ margin: "6px 0" }}>Member {i + 1}</h4>
        <input
          type="text"
          placeholder="Name"
          style={{ marginRight: 10, padding: 6 }}
          value={member.name}
          onChange={(e) => handleMemberChange(i, "name", e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          style={{ marginRight: 10, padding: 6, width: 80 }}
          value={member.age}
          min="1"
          onChange={(e) => handleMemberChange(i, "age", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Aadhaar Number"
          style={{ padding: 6, width: 140 }}
          value={member.aadhaar}
          maxLength={12}
          minLength={12}
          onChange={(e) => handleMemberChange(i, "aadhaar", e.target.value)}
          required
        />
      </div>
    ));

  return (
    <div style={{
      padding: 40,
      fontFamily: "Arial, sans-serif",
      maxWidth: 520,
      margin: "40px auto",
      borderRadius: 12,
      background: "#f4f5fa",
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)"
    }}>

      {!active ? (
        <button
          onClick={enterForm}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            background: "#709dd0",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}
          disabled={joinedOnce}
        >
          {joinedOnce ? "Joined" : "Join Form Queue"}
        </button>
      ) : (
        <button
          onClick={leaveForm}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            background: "#ed5c63",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}
        >
          Leave Form
        </button>
      )}

      <div style={{ margin: "12px 0", textAlign: "center", color: "#444" }}>
        {message}
      </div>

      {status === "waiting" && (
        <div
          style={{
            padding: "14px",
            background: "#fcebb6",
            color: "#aa8600",
            borderRadius: 7,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Your Position in Queue: {position}

          {position === 1 && activeCount < 3 && (
            <div style={{ marginTop: 6, color: "#009879" }}>
              Slot available — moving you in...
            </div>
          )}
        </div>
      )}

      {active && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 30,
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 7,
            boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)"
          }}
        >
          <h3>Members Details</h3>
          <label>
            <span>Number of Members:&nbsp;</span>
            <input
              type="number"
              value={memberCount}
              min={1}
              max={10}
              onChange={(e) => handleMemberCount(parseInt(e.target.value) || 1)}
              required
              style={{ padding: 6, width: 60, margin: "8px 0" }}
            />
          </label>
          {renderMemberInputs()}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              background: "#009879",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 8,
              border: "none",
              marginTop: 16,
              cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? "Submitting..." : "Submit Form"}
          </button>
        </form>
      )}

      {formCode && (
        <div style={{
          marginTop: 15,
          color: "#009879",
          background: "#eafbea",
          padding: 14,
          borderRadius: 8,
          fontWeight: "bold",
          textAlign: "center"
        }}>
          Success! Your Unique Code: <span style={{ fontWeight: "bold" }}>{formCode}</span>
        </div>
      )}
    </div>
  );
}
