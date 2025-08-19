import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // Handle error with toast/snackbar if needed
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      {/* Back to Home Button */}
      <button
        onClick={() => routeTo("/home")}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
      >
        <HomeIcon className="text-white" />
        <span>Back to Home</span>
      </button>

      {/* Meeting History */}
      <h2 className="text-2xl font-semibold mb-4 text-purple-400">Meeting History</h2>
      <div className="grid gap-4">
        {meetings.length > 0 ? (
          meetings.map((e, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-5"
            >
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-white">Code:</span> {e.meetingCode}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">Date:</span> {formatDate(e.date)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No meeting history found.</p>
        )}
      </div>
    </div>
  );
}
