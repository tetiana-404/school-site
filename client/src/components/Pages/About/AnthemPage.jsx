import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const AnthemPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [anthem, setAnthem] = useState(null);

    useEffect(() => {
        const fetchAnthem = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/anthem`);
                const data = await res.json();
                setAnthem(data);
            } catch (error) {
                console.error("Failed to fetch Anthem:", error);
            }
        };

        fetchAnthem();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/anthem`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Гімн гімназії',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="anthemPage" className="section-padding bg-light py-5">
            <div className="auto-container">
                <div className="row">
                    <div className='col-lg-12'>
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>Гімн гімназії </h2>
                            <p>Слова і музика вчителя гімназії Дембіцької-Прокопець Ніни Григорівни  </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={anthem?.content || ""}
                                    setContent={(newContent) => setAnthem(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію установчі документи гімназії"
                                />

                                

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/anthem', 'PUT', { content: anthem?.content }, () => setEditMode(false))
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
                                <div dangerouslySetInnerHTML={{ __html: anthem?.content || "" }} />
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

export default AnthemPage;
