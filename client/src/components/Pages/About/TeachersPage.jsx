import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const TeachersPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [teachers, setTeachers] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/teachers`);
                const data = await res.json();
                setTeachers(data);
            } catch (error) {
                console.error("Failed to fetch teachers:", error);
            }
        };

        fetchTeachers();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/teachers`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Кадровий склад',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="teachersPage" className="section-padding bg-light py-5">
            <div className="auto-container">
                <div className="row">
                    <div className='col-lg-12'>
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>Кадровий склад</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={teachers?.content || ""}
                                    setContent={(newContent) => setTeachers(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про кадровий склад гімназії"
                                />

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/teachers', 'PUT', { content: teachers?.content }, () => setEditMode(false))
                                        }
                                    >
                                        💾 Зберегти
                                    </button>
                                    <button className="btn btn-outline-warning btn-lg w-50" onClick={() => setEditMode(false)}>❌ Скасувати</button>
                                </div>
                            </>
                        ) : (
                            <div className='position-relative'>
                                    {user?.role === 'admin' && !editMode && (
                                        <button
                                            className="btn btn-outline-dark position-absolute m-0 w-auto"
                                            style={{ top: "-50px", right:0 }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                <div dangerouslySetInnerHTML={{ __html: teachers?.content || "" }} />
                                {user?.role === 'admin' && !editMode && (
                                        <button
                                            className="btn btn-outline-dark position-absolute m-0 w-auto"
                                            style={{ bottom: "0px", right:0 }}
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

export default TeachersPage;
