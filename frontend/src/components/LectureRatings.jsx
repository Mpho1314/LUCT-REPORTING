import { useState, useEffect } from "react";
import { authService } from "../services/api";
import "../styles/Dashboard.css";

function LectureRatings({ lectureId, showForm = false, onRatingSubmitted, refreshTrigger }) {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = authService.getCurrentUser();
    if (!user) {
      setError("You must be logged in to submit a rating.");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lecture_id: lectureId,
          student_id: Number(user.id),
          rating,
          comment,
        }),
      });

      setSuccess("Rating submitted successfully!");
      setError("");
      setRating(0);
      setComment("");
      fetchRatings();

      if (onRatingSubmitted) onRatingSubmitted();
    } catch (err) {
      console.error(err);
      setError("Failed to submit rating. Try again.");
    }
  };

  return (
    <div className="lecture-rating-container">
      {showForm && (
        <form onSubmit={handleSubmit} className="lecture-rating-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <div>
            <label>Rating (1-5): </label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Comment: </label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button type="submit">Submit Rating</button>
        </form>
      )}

      <div className="lecture-ratings-display">
        <h4>
          Average Rating: {average !== null ? average : "Loading..."} ({ratings.length} review{ratings.length !== 1 ? "s" : ""})
        </h4>
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
    </div>
  );
}

export default LectureRatings;
