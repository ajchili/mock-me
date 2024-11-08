import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button.js";
import type { Role, SessionType } from "./types.js";
import { getRoleFromValue, getSessionTypeFromValue } from "./utils.js";

export const Login = (): JSX.Element => {
  const [role, setRole] = useState<Role>("candidate");
  const [sessionType, setSessionType] = useState<SessionType>("new");
  const [roomId, setRoomId] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roomId = searchParams.get("roomId");

    if (roomId) {
      setSessionType("existing")
      setRoomId(roomId);
    }
  }, []);

  const start = useCallback(() => {
    if (sessionType === "existing" && roomId.length === 0) {
      alert("You must provide a Room ID to join an existing session.");
      return;
    }

    const generatedRoomId = Date.now().toString(36);
    const roomIdToUse = sessionType === "new" ? generatedRoomId : roomId;

    navigate(`/${role}?roomId=${roomIdToUse}`);
  }, [navigate, role, sessionType, roomId]);

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-slate-950 to-slate-800">
      <span className="text-3xl text-white">👉🏽👈🏽 mock me</span>
      <span className="text-l text-white">
        I am {role === "candidate" ? "a" : "an"}
        <select
          className="bg-transparent border-0 border-b-2 border-white border-solid mx-2"
          value={role}
          onChange={(e) => setRole(getRoleFromValue(e.target.value))}
        >
          <option value="candidate">candidate 🧑‍🎓</option>
          <option value="interviewer">interviewer 🧑‍🏫</option>
        </select>
        and I will {sessionType === "new" ? "start a" : "join an"}
        <select
          className="bg-transparent border-0 border-b-2 border-white border-solid mx-2"
          value={sessionType}
          onChange={(e) =>
            setSessionType(getSessionTypeFromValue(e.target.value))
          }
        >
          <option value="new">new</option>
          <option value="existing">existing</option>
        </select>
      </span>
      <div className="flex gap-4">
        {sessionType === "existing" && (
          <input
            className="border-spacing-1 border-2 p-2 rounded-full border-slate-50 hover:border-slate-300 text-slate-950 bg-slate-50 hover:bg-slate-300"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        )}
        <Button onClick={start}>
          {sessionType === "new" ? "Start" : "Join"} Session
        </Button>
      </div>
    </div>
  );
};
