"use client";

import { FormEvent, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { getTranslation } from "../../data/translations";

const faqItems = [
    {
        question: "How can I cancel my booking?",
        answer:
            'Open "My Bookings", select your reservation and click "Cancel booking".',
    },
    {
        question: "How can I change my booking dates?",
        answer:
            "You can contact StayWay support and provide your booking details and the new dates.",
    },
    {
        question: "Can I change the number of guests?",
        answer:
            "Yes. Contact support before your check-in date and we will help you with your reservation.",
    },
    {
        question: "How can I change my currency?",
        answer:
            "Click the language and currency button in the header and select your preferred currency.",
    },
    {
        question: "How can I change the language?",
        answer:
            "Open the language and currency menu in the header and choose your preferred language.",
    },
];

export default function HelpPage() {
    const { language } = useSettings();

    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            subject: "",
            message: "",
        };

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email.";
        }

        if (!subject.trim()) {
            newErrors.subject = "Subject is required.";
        }

        if (!message.trim()) {
            newErrors.message = "Message is required.";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setSubmitted(false);
            return;
        }

        setSubmitted(true);

        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

        setErrors({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <main className="help-page page-enter">
            <section className="help-hero">
                <div className="help-hero-content">
                    <span className="help-icon">?</span>

                    <h1>Help & Support</h1>

                    <p>
                        Find answers to common questions or contact our
                        support team.
                    </p>
                </div>
            </section>

            <section className="help-content">
                <div className="help-section">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-list">
                        {faqItems.map((item, index) => (
                            <div className="faq-item" key={item.question}>
                                <button
                                    type="button"
                                    className="faq-question"
                                    onClick={() =>
                                        setOpenQuestion(
                                            openQuestion === index
                                                ? null
                                                : index
                                        )
                                    }
                                >
                                    <span>{item.question}</span>

                                    <span className="faq-arrow">
                                        {openQuestion === index ? "−" : "+"}
                                    </span>
                                </button>

                                {openQuestion === index && (
                                    <div className="faq-answer">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="help-section">
                    <h2>Contact Support</h2>

                    <p className="help-description">
                        Can't find what you're looking for? Send us a
                        message and our support team will help you.
                    </p>

                    {submitted && (
                        <div className="support-success">
                            ✓ Your message has been sent successfully!
                        </div>
                    )}

                    <form
                        className="support-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="help-name">Name</label>

                                <input
                                    id="help-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Your name"
                                />

                                {errors.name && (
                                    <span className="form-error">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="help-email">Email</label>

                                <input
                                    id="help-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="your@email.com"
                                />

                                {errors.email && (
                                    <span className="form-error">
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="help-subject">Subject</label>

                            <input
                                id="help-subject"
                                type="text"
                                value={subject}
                                onChange={(event) =>
                                    setSubject(event.target.value)
                                }
                                placeholder="How can we help?"
                            />

                            {errors.subject && (
                                <span className="form-error">
                                    {errors.subject}
                                </span>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="help-message">Message</label>

                            <textarea
                                id="help-message"
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                placeholder="Write your message..."
                                rows={6}
                            />

                            {errors.message && (
                                <span className="form-error">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="support-button">
                            Send message
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}