import React from "react";
import { useParams } from "react-router-dom";

const content = {
    "menstrual-health": {
        title: "Menstrual Health",
        text: "Menstrual health includes understanding your cycle, hygiene practices, and recognizing when to seek medical advice."
    },
    "mental-wellbeing": {
        title: "Mental Wellbeing",
        text: "Taking care of your mental health is crucial. Learn about stress management, self-care, and seeking support."
    },
    "self-defense": {
        title: "Self-Defense Techniques",
        text: "Basic self-defense moves can help in emergencies. Learn how to protect yourself effectively."
    },
    "hormonal-changes": {
        title: "Hormonal Changes & Puberty",
        text: "Understanding puberty and hormonal changes helps in dealing with physical and emotional shifts."
    }
};

const ResourcePage = () => {
    const { topicId } = useParams();
    const topicData = content[topicId];

    if (!topicData) {
        return <p className="resource-not-found">Topic not found.</p>;
    }

    return (
        <div className="resource-container">
            <h2 className="resource-title">{topicData.title}</h2>
            <p className="resource-text">{topicData.text}</p>
        </div>
    );
};

export default ResourcePage;
