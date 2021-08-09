import { Button } from "react-bootstrap";
import { useState } from "react";
import "./FeedbackModal.css";

function FeedbackModal({ closeModal, firebase, user }) {

    const [feedback, setFeedback] = useState("");
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackType, setFeedbackType] = useState("");

    const submitFeedback = () => {
        if (feedbackType === "" || feedback === "" || feedbackTitle === "") {
            alert("Please fill out the required fields");
            return;
        } else {
            postFeedback();
        }
    }

    const postFeedback = () => {
        let now = new Date().toString();
        let db = firebase.firestore();

        db.collection("report-system").add({
            Date: now,
            Title: feedbackTitle,
            Feedback: feedback,
            Type: feedbackType,
            Email: user.email
        }).then(() => {
            alert((feedbackType === "bug") ? "Thanks for reporting this bug." : "Thanks for contacting us.");
            setFeedback("");
            setFeedbackTitle("");
            setFeedbackType("");
            closeModal(false);
        })

        //Previous version
        //db.collection("report-system").doc(feedbackType).collection(user.email).doc(now.toString()).get().then((doc) => {
        //    if (doc.exists) {
        //        db.collection("report-system").doc(feedbackType).collection(user.email).doc(now.toString()).set({
        //            Title: feedbackTitle,
        //            Feedback: feedback
        //        });
        //    } else {
        //        db.collection("report-system").doc(feedbackType).collection(user.email).doc(now.toString()).set({
        //            Title: feedbackTitle,
        //            Feedback: feedback
        //        });
        //    }
        //}).then(() => {
        //    alert((feedbackType === "bug") ? "Thanks for reporting this bug." : "Thanks for contacting us.");
        //    setFeedback("");
        //    setFeedbackTitle("");
        //    setFeedbackType("");
        //    closeModal(false);
        //});
    }

    return (

        <div className="modalBackground">
            <div className="modalContainer">
                <div className="modalHeader">
                    <h2>Please give us your feedback</h2>
                </div>
                <div className="modalBody">
                    <select className="feedbackSelector" onChange={(e) => { setFeedbackType(e.target.value) }} required>
                        <option hidden defaultValue="">Please choose one</option>
                        <option value="bug">Bug</option>
                        <option value="feature">Feedback</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder="Title" required style={{ width: "100%" }} onChange={(e) => { setFeedbackTitle(e.target.value) }} />
                    <textarea rows="12" placeholder="Leave your feedback here" required style={{ width: "100%" }} onChange={(e) => { setFeedback(e.target.value) }} />
                </div>
                <div className="modalFooter">
                    <Button onClick={() => { closeModal(false) }} id="cancelButton" style={{ width: "150px", height: "50px", margin: "10px", borderRadius: "8px", cursor: "pointer" }}>Cancel</Button>
                    <Button onClick={submitFeedback} style={{ width: "150px", height: "50px", margin: "10px", borderRadius: "8px", cursor: "pointer" }}>Submit</Button>
                </div>
            </div>
        </div>
        
        )
}

export default FeedbackModal;