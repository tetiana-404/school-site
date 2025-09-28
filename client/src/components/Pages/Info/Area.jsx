import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const AreaPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [area, setArea] = useState(null);

    useEffect(() => {
        const fetchArea = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/area`);
                const data = await res.json();
                setArea(data);
            } catch (error) {
                console.error("Failed to fetch Area:", error);
            }
        };

        fetchArea();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/area`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Територія обслуговування',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="areaPage" className="bg-light">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/lviv.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    Територія обслуговування</h2>
                                <div
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="auto-container py-5">
                <div className="row">
                    <div className='col-lg-12'>
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>Територія обслуговування </h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={area?.content || ""}
                                    setContent={(newContent) => setArea(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про територію обслуговування"
                                />

                                <div className="fixed-bottom-actions text-center mt-5">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/area', 'PUT', { content: area?.content }, () => setEditMode(false))
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
                                <div dangerouslySetInnerHTML={{ __html: area?.content || "" }} />
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

export default AreaPage;
