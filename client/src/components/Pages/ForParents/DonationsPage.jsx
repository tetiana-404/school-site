import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const DonationsPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [donations, setDonations] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations`);
                const data = await res.json();
                setDonations(data);
            } catch (error) {
                console.error("Failed to fetch Donations:", error);
            }
        };

        fetchDonations();
    }, []);

    const handleSave = async (body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/donations`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...body,
                    title: "Благодійні внески",
                }),
            });
            callback();
        } catch (err) {
            console.error("Помилка при збереженні /api/donations", err);
        }
    };

    return (
        <section id="donationsPage" className="section-padding bg-light py-5">
            <div className="auto-container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>💝 Благодійні внески</h2>
                            <p>Інформація про благодійні внески та фінансову підтримку гімназії</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        {editMode ? (
                            <>
                                <TextEditor
                                    content={donations?.content || ""}
                                    setContent={(newContent) =>
                                        setDonations((prev) => ({ ...prev, content: newContent }))
                                    }
                                    placeholder="Введіть інформацію про благодійні внески"
                                />

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave({ content: donations?.content }, () =>
                                                setEditMode(false)
                                            )
                                        }
                                    >
                                        💾 Зберегти
                                    </button>
                                    <button
                                        className="btn btn-outline-warning btn-lg w-50"
                                        onClick={() => setEditMode(false)}
                                    >
                                        ❌ Скасувати
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="position-relative">
                                {user?.role === "admin" && !editMode && (
                                    <button
                                        className="btn btn-outline-dark position-absolute m-0 w-auto"
                                        style={{ top: "-50px", right: 0 }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        ✏️
                                    </button>
                                )}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: donations?.content || "",
                                    }}
                                />
                                {user?.role === "admin" && !editMode && (
                                    <button
                                        className="btn btn-outline-dark position-absolute m-0 w-auto"
                                        style={{ bottom: "0px", right: 0 }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        ✏️
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonationsPage;
