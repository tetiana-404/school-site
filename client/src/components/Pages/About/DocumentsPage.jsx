import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const DocumentsPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/documents`);
                const data = await res.json();
                setDocuments(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };

        fetchDocuments();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/documents`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Установчі документи',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="documentsPage">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{backgroundImage:  `url(${process.env.PUBLIC_URL + '/img/bg/documents.jpg'})`}}
            >
                <div className="auto-container h-100 px-2">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2 
                                    className="page-banner-title"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                        Установчі документи</h2>
                                <div 
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p>У своїй роботі гімназія керується такими внутрішніми документами</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="section-padding">
                <div className="auto-container">
                    <div className="row">
                        <div className='col-lg-12'>
                            {editMode ? (
                                <>

                                    <TextEditor
                                        content={documents?.content || ""}
                                        setContent={(newContent) => setDocuments(prev => ({ ...prev, content: newContent }))}
                                        placeholder="Введіть інформацію установчі документи гімназії"
                                    />

                                    <div className="text-center mt-3">
                                        <button
                                            className="btn btn-outline-success btn-lg w-50"
                                            onClick={() =>
                                                handleSave('/api/documents', 'PUT', { content: documents?.content }, () => setEditMode(false))
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
                                            style={{ top: "-50px", right: 0 }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    <div dangerouslySetInnerHTML={{ __html: documents?.content || "" }} />
                                    {user?.role === 'admin' && !editMode && (
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
            </div>
        </section>
    );
};

export default DocumentsPage;
