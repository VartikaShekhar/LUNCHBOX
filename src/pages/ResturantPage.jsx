import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantDetailPanel from "../components/ResturantDetailPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single();

        if (error) throw error;
        setRestaurant(data);
        if (data?.created_by && user) {
          checkFriendStatus(user.id, data.created_by);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
    fetchComments();
  }, [restaurantId, user]);

  const checkFriendStatus = async (viewerId, ownerId) => {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("status", "accepted")
      .or(`and(requester_id.eq.${viewerId},addressee_id.eq.${ownerId}),and(requester_id.eq.${ownerId},addressee_id.eq.${viewerId})`)
      .limit(1);

    if (!error && data?.length) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("id, content, created_at, author_id, author:author_id (username, name, email)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (!error) {
      setComments(data || []);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!user) {
      setCommentError("Please log in to comment.");
      return;
    }

    if (!isFriend && user.id !== restaurant.created_by) {
      setCommentError("Only friends can comment on this restaurant.");
      return;
    }

    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setCommentLoading(true);
    const { error } = await supabase
      .from("comments")
      .insert([
        {
          restaurant_id: restaurantId,
          author_id: user.id,
          content: commentText.trim(),
        },
      ]);

    if (error) {
      setCommentError(error.message);
    } else {
      setCommentText("");
      fetchComments();
    }
    setCommentLoading(false);
  };

  if (loading) {
    return (
      <>
        <NavigationBar />
        <LoadingSpinner message="Loading restaurant..." />
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <NavigationBar />
        <Container className="py-4">
          <Alert variant="danger">
            {error || "Restaurant not found."}
          </Alert>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <Row>
          <Col md={12}>
            <RestaurantDetailPanel restaurant={restaurant} />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <h3>Comments</h3>
            {comments.length === 0 ? (
              <p className="text-muted">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="mb-3 border-bottom pb-2">
                  <div className="fw-bold">
                    {comment.author?.name || comment.author?.username || "User"}
                  </div>
                  <div className="text-muted small">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  <div>{comment.content}</div>
                </div>
              ))
            )}

            <div className="mt-3">
              <h5>Add a comment</h5>
              {commentError && <Alert variant="danger">{commentError}</Alert>}
              <form onSubmit={handleAddComment}>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Write your comment..." : "Login to comment"}
                  disabled={!user || (!isFriend && user?.id !== restaurant?.created_by)}
                />
                <Button
                  type="submit"
                  disabled={commentLoading || !user || (!isFriend && user?.id !== restaurant?.created_by)}
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
