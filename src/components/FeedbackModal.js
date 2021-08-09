import { Button } from "react-bootstrap";
import { useState } from "react";
import "./FeedbackModal.css";

import Modal from 'react-bootstrap/Modal';

function FeedbackModal(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        let d = new Date();
        let db = props.firebase.firestore();

        db.collection("report-system").add({
            Date: d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate() + ' ' + d.getTime(),
            Title: feedbackTitle,
            Feedback: feedback,
            Type: feedbackType,
            Email: props.user.email
        }).then(() => {
            alert((feedbackType === "bug") ? "Thanks for reporting this bug." : "Thanks for contacting us.");
            setFeedback("");
            setFeedbackTitle("");
            setFeedbackType("");
        })
    }

    return (
        <div>
            <Button variant="danger" style={props.buttonStyle} onClick={handleShow}>Report / Suggest</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Please give us your feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select className="feedbackSelector" onChange={(e) => { setFeedbackType(e.target.value) }} required>
                        <option hidden defaultValue="">Please choose one</option>
                        <option value="bug">Bug</option>
                        <option value="feature">Feedback</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder="Title" required style={{ width: "100%" }} onChange={(e) => { setFeedbackTitle(e.target.value) }} />
                    <textarea rows="12" placeholder="Leave your feedback here" required style={{ width: "100%" }} onChange={(e) => { setFeedback(e.target.value) }} />
                </Modal.Body>
                <Modal.Footer align='left'>
                    <Button variant='secondary' onClick={handleClose} >Cancel</Button>
                    <Button variant='success' onClick={() => { submitFeedback(); handleClose() }}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default FeedbackModal;