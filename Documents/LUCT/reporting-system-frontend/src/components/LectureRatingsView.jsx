import { useState, useEffect } from "react";

function LectureRatingsView({ lectureId, refreshTrigger }) {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);

  const fetchRatings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ratings/lecture/${lectureId}`);
      const data = await res.json();
      setRatings(data);

      if (data.length > 0) {
        const avg = data.reduce((acc, r) => acc + Number(r.rating), 0) / data.length;
        setAverage(avg.toFixed(1));
      } else {
        setAverage("No ratings yet");
      }
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
      setAverage("Error loading ratings");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [lectureId, refreshTrigger]);

  return (
    <div className="lecture-ratings-display">
      <h4>Average Rating: {average}</h4>
      {ratings.length > 0 ? (
        <ul>
          {ratings.map((r) => (
            <li key={r.rating_id || r.id}>
              <strong>{r.student_name}:</strong> {r.rating}/5
              {r.comment && <> - "{r.comment}"</>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ratings yet.</p>
      )}
    </div>
  );
}

export default LectureRatingsView;
