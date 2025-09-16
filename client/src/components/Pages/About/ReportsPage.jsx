import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const ReportsPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [reports, setReports] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports`);
                const data = await res.json();
                if (!data) {
                    setReports({ title: 'Звіти директора', content: '' });
                } else {
                    setReports(data);
                }
            } catch (error) {
                console.error("Failed to fetch Reports:", error);
            }
        };

        fetchReports();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Звіти директора',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="reportsPage" className="bg-light">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/reports.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    Звіти директора</h2>
                                <div
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p>Методична / Навчальна / Виховна робота</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="auto-container py-5">
                
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={reports?.content || ""}
                                    setContent={(newContent) => setReports(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про звіти директора"
                                />

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/reports', 'PUT', { content: reports?.content }, () => setEditMode(false))
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
                                <div dangerouslySetInnerHTML={{ __html: reports?.content || "" }} />
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

export default ReportsPage;
