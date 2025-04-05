import React from "react";
import { Link } from "react-router-dom";

const topics = [
    { id: "menstrual-health", title: "Menstrual Health" },
    { id: "mental-wellbeing", title: "Mental Wellbeing" },
    { id: "self-defense", title: "Self-Defense Techniques" },
    { id: "hormonal-changes", title: "Hormonal Changes & Puberty" }
];

const EducationalResources = () => {
    return (
        <div className="educational-container">
            <h2 className="educational-title">Educational Resources</h2>
            <p className="educational-subtitle">Select a topic to learn more:</p>
            <ul className="topic-list">
                {topics.map((topic) => (
                    <li key={topic.id} className="topic-item">
                        <Link to={`/resources/${topic.id}`} className="topic-link">{topic.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EducationalResources;
